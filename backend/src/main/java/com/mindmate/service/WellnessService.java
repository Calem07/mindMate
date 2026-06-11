package com.mindmate.service;

import com.mindmate.domain.*;
import com.mindmate.domain.Enums.*;
import com.mindmate.dto.AppDtos.*;
import com.mindmate.repository.*;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class WellnessService {
  private final MoodRepository moods;
  private final JournalEntryRepository journals;
  private final ChatSessionRepository sessions;
  private final ChatMessageRepository messages;
  private final EmotionLogRepository emotionLogs;
  private final RecommendationRepository recommendations;
  private final CrisisEventRepository crisisEvents;
  private final GeminiService gemini;
  private final SafetyService safety;
  private final DailyCheckinRepository checkins;
  private final CompanionMemoryRepository memoryRepository;

  public WellnessService(MoodRepository moods, JournalEntryRepository journals, ChatSessionRepository sessions,
      ChatMessageRepository messages, EmotionLogRepository emotionLogs, RecommendationRepository recommendations,
      CrisisEventRepository crisisEvents, GeminiService gemini, SafetyService safety, DailyCheckinRepository checkins,
      CompanionMemoryRepository memoryRepository) {
    this.moods = moods;
    this.journals = journals;
    this.sessions = sessions;
    this.messages = messages;
    this.emotionLogs = emotionLogs;
    this.recommendations = recommendations;
    this.crisisEvents = crisisEvents;
    this.gemini = gemini;
    this.safety = safety;
    this.checkins = checkins;
    this.memoryRepository = memoryRepository;
  }

  public MoodResponse logMood(User user, MoodRequest request) {
    var mood = new Mood();
    mood.setUser(user);
    mood.setMood(request.mood());
    moods.save(mood);
    return new MoodResponse(mood.getId(), mood.getMood(), mood.getCreatedAt());
  }

  public List<MoodResponse> moods(User user) {
    return moods.findByUserOrderByCreatedAtDesc(user).stream().map(this::toMood).toList();
  }

  public JournalResponse createJournal(User user, JournalRequest request) {
    var entry = new JournalEntry();
    entry.setUser(user);
    entry.setTitle(request.title());
    entry.setContent(request.content());
    entry.setEmotion(gemini.classify(request.content()));
    entry.setSummary(gemini.summarize(request.content()));
    entry.setKeyConcerns(gemini.keyConcerns(request.content()));
    journals.save(entry);
    logEmotion(user, entry.getEmotion(), 0.72);
    return toJournal(entry);
  }

  public List<JournalResponse> journals(User user) {
    return journals.findByUserOrderByCreatedAtDesc(user).stream().map(this::toJournal).toList();
  }

  public JournalResponse updateJournal(User user, Long id, JournalRequest request) {
    var entry = journals.findById(id).filter(j -> j.getUser().getId().equals(user.getId())).orElseThrow();
    entry.setTitle(request.title());
    entry.setContent(request.content());
    entry.setEmotion(gemini.classify(request.content()));
    entry.setSummary(gemini.summarize(request.content()));
    entry.setKeyConcerns(gemini.keyConcerns(request.content()));
    journals.save(entry);
    return toJournal(entry);
  }

  public void deleteJournal(User user, Long id) {
    var entry = journals.findById(id).filter(j -> j.getUser().getId().equals(user.getId())).orElseThrow();
    journals.delete(entry);
  }

  public ChatResponse chat(User user, ChatRequest request) {
    var session = sessions.findFirstByUserOrderByCreatedAtDesc(user).orElseGet(() -> {
      var created = new ChatSession();
      created.setUser(user);
      return sessions.save(created);
    });
    saveMessage(user, session, Sender.STUDENT, request.message());
    var emotion = gemini.classify(request.message());
    logEmotion(user, emotion, 0.78);
    var crisis = safety.crisisPhrase(request.message());
    var reply = crisis.map(phrase -> {
      var event = new CrisisEvent();
      event.setUser(user);
      event.setTriggerPhrase(phrase);
      event.setSourceText(request.message());
      crisisEvents.save(event);
      return safety.crisisReply();
    }).orElseGet(() -> {
      String contextStr = "No recent records.";
      try {
        var recentCheckins = checkins.findByUserOrderByCreatedAtDesc(user);
        if (!recentCheckins.isEmpty()) {
          var c = recentCheckins.get(0);
          contextStr = String.format("{\"recent_mood\": \"%s\", \"sleep_hours\": %.1f, \"stress_level\": %d, \"energy_level\": %d}",
              c.getMood(), c.getSleepHours(), c.getStressLevel(), c.getEnergyLevel());
        }
      } catch (Exception e) {}
      
      String companionPrompt = "";
      if (user.getPetType() != null) {
        String personality = TeenWellnessService.getPetPersonality(user.getPetType());
        String species = TeenWellnessService.getPetSpecies(user.getPetType());
        companionPrompt = String.format("You are %s, the student's virtual %s companion who has a %s personality. Keep your tone highly reflective of this personality. Do NOT break character.",
            user.getPetName(), species, personality);
        
        var memories = memoryRepository.findTop5ByUserOrderByCreatedAtDesc(user);
        if (!memories.isEmpty()) {
          StringBuilder memoryBuilder = new StringBuilder("\nRecent companion memories of student activities to guide your conversation:");
          for (var memory : memories) {
            memoryBuilder.append(String.format("\n- [%s] %s: %s", memory.getMemoryType(), memory.getTitle(), memory.getDescription()));
          }
          companionPrompt += memoryBuilder.toString();
        }
      }
      return gemini.chat(request.message(), contextStr, companionPrompt);
    });
    saveMessage(user, session, Sender.MINDMATE, reply);
    return new ChatResponse(reply, emotion, 0.78, crisis.isPresent());
  }

  public List<ChatHistoryItem> chatHistory(User user) {
    return messages.findByUserOrderByCreatedAtAsc(user).stream()
        .map(message -> new ChatHistoryItem(message.getSender(), message.getContent(), message.getCreatedAt()))
        .toList();
  }

  public DashboardResponse dashboard(User user) {
    var recentMoods = moods(user);
    var recentJournals = journals(user);
    return new DashboardResponse(
        recentMoods.size(),
        recentJournals.size(),
        messages.findByUserOrderByCreatedAtAsc(user).size(),
        crisisEvents.findByUserOrderByCreatedAtDesc(user).size(),
        recentMoods.stream().limit(7).toList(),
        recentJournals.stream().limit(5).toList());
  }

  public List<RecommendationResponse> recommendations(User user) {
    var existing = recommendations.findByUserOrderByCreatedAtDesc(user);
    if (existing.isEmpty()) {
      List.of("Try a 20-minute focus block followed by a short walk.",
          "Use a breathing reset before starting the next task.",
          "Write one concern and one controllable next step.").forEach(text -> {
            var rec = new Recommendation();
            rec.setUser(user);
            rec.setSource("baseline");
            rec.setContent(text);
            recommendations.save(rec);
          });
    }
    return recommendations.findByUserOrderByCreatedAtDesc(user).stream().map(this::toRecommendation).toList();
  }

  private void saveMessage(User user, ChatSession session, Sender sender, String content) {
    var message = new ChatMessage();
    message.setUser(user);
    message.setSession(session);
    message.setSender(sender);
    message.setContent(content);
    messages.save(message);
  }

  private void logEmotion(User user, Emotion emotion, double confidence) {
    var log = new EmotionLog();
    log.setUser(user);
    log.setEmotion(emotion);
    log.setConfidenceScore(confidence);
    emotionLogs.save(log);
  }

  private MoodResponse toMood(Mood mood) {
    return new MoodResponse(mood.getId(), mood.getMood(), mood.getCreatedAt());
  }

  private JournalResponse toJournal(JournalEntry entry) {
    return new JournalResponse(entry.getId(), entry.getTitle(), entry.getContent(), entry.getSummary(),
        entry.getKeyConcerns(), entry.getEmotion(), entry.getCreatedAt());
  }

  private RecommendationResponse toRecommendation(Recommendation recommendation) {
    return new RecommendationResponse(recommendation.getId(), recommendation.getContent(), recommendation.getSource(), recommendation.getCreatedAt());
  }
}
