package com.mindmate.service;

import com.mindmate.domain.*;
import com.mindmate.repository.DailyCheckinRepository;
import com.mindmate.repository.HabitLogRepository;
import com.mindmate.repository.JournalEntryRepository;
import com.mindmate.repository.LifeGoalRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ReflectionService {
  private final DailyCheckinRepository checkins;
  private final HabitLogRepository habitLogs;
  private final JournalEntryRepository journals;
  private final LifeGoalRepository goals;
  private final GeminiService gemini;

  public ReflectionService(
      DailyCheckinRepository checkins, HabitLogRepository habitLogs,
      JournalEntryRepository journals, LifeGoalRepository goals, GeminiService gemini) {
    this.checkins = checkins;
    this.habitLogs = habitLogs;
    this.journals = journals;
    this.goals = goals;
    this.gemini = gemini;
  }

  public String generateWeeklyReflection(User user) {
    List<DailyCheckin> logs = checkins.findByUserOrderByCreatedAtDesc(user);
    List<HabitLog> hLogs = habitLogs.findByUser(user);

    if (logs.isEmpty()) {
      return "Start your first daily check-in to get a weekly reflection. Focus on small steps: drinking water and sleeping early!";
    }

    int checkinDays = Math.min(logs.size(), 7);
    double avgSleep = logs.stream().limit(checkinDays).mapToDouble(DailyCheckin::getSleepHours).average().orElse(0.0);
    double avgStress = logs.stream().limit(checkinDays).mapToLong(DailyCheckin::getStressLevel).average().orElse(0.0);

    String statsSummary = String.format(
        "Student Stats this week: Logged %d days, Average sleep duration: %.1f hours, Average stress level: %.1f/5.",
        checkinDays, avgSleep, avgStress
    );

    // Call Gemini with stats context or return local fallback
    String aiPrompt = statsSummary + "\nProvide a friendly, motivational academic weekly reflection for a teenager under 100 words. Do not make medical claims.";
    try {
      String response = gemini.chat(aiPrompt);
      if (response != null && !response.trim().isEmpty() && !response.contains("I could not reach the AI provider")) {
        return response;
      }
    } catch (Exception ignored) {}

    // Fallback
    StringBuilder sb = new StringBuilder();
    sb.append(String.format("Great effort this week! You completed %d wellness check-ins. ", checkinDays));
    sb.append(String.format("Your average sleep was %.1f hours with an academic stress level of %.1f/5. ", avgSleep, avgStress));
    if (avgSleep < 7.0) {
      sb.append("Try setting a screen wind-down alarm 30 minutes before sleep to hit your 8-hour target.");
    } else {
      sb.append("You are maintaining excellent sleep habits, keep it up to boost memory and focus!");
    }
    return sb.toString();
  }

  public String generateFutureMeLetter(User user) {
    List<LifeGoal> activeGoals = goals.findByUser(user);
    List<JournalEntry> recentJournals = journals.findByUserOrderByCreatedAtDesc(user);

    String goalsText = activeGoals.isEmpty() ? "No goals logged yet." : activeGoals.stream().limit(3).map(LifeGoal::getTitle).reduce((a, b) -> a + ", " + b).orElse("");
    String journalText = recentJournals.isEmpty() ? "No reflections logged yet." : recentJournals.get(0).getContent();

    String aiPrompt = String.format(
        "Generate a letter from the future self to this teenager (maximum 100 words). Goals: %s. Recent journal reflection snippet: %s. Inspire optimism and resilience.",
        goalsText, journalText
    );

    try {
      String response = gemini.chat(aiPrompt);
      if (response != null && !response.trim().isEmpty() && !response.contains("I could not reach the AI provider")) {
        return response;
      }
    } catch (Exception ignored) {}

    // Fallback
    return String.format(
        "Hello from the future! I see you working hard toward your goals: '%s'. "
        + "Remember that nerve-wracking days fade and turn into wisdom. Keep practicing self-care, maintaining your check-ins, "
        + "and showing kindness to yourself. You've got this!",
        goalsText.length() > 50 ? goalsText.substring(0, 47) + "..." : goalsText
    );
  }
}
