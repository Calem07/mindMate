package com.mindmate.controller;

import com.mindmate.dto.AppDtos.*;
import com.mindmate.repository.UserRepository;
import com.mindmate.service.CurrentUserService;
import com.mindmate.service.WellnessService;
import com.mindmate.service.TeenWellnessService;
import com.mindmate.service.CorrelationEngineService;
import com.mindmate.service.ReflectionService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.time.Instant;
import java.util.List;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@Validated
public class WellnessController {
  private final CurrentUserService currentUser;
  private final WellnessService wellness;
  private final UserRepository users;
  private final TeenWellnessService teenWellness;
  private final CorrelationEngineService correlationEngine;
  private final ReflectionService reflectionService;

  public WellnessController(CurrentUserService currentUser, WellnessService wellness, UserRepository users,
                            TeenWellnessService teenWellness, CorrelationEngineService correlationEngine,
                            ReflectionService reflectionService) {
    this.currentUser = currentUser;
    this.wellness = wellness;
    this.users = users;
    this.teenWellness = teenWellness;
    this.correlationEngine = correlationEngine;
    this.reflectionService = reflectionService;
  }

  @PostMapping("/moods")
  public MoodResponse logMood(@Valid @RequestBody MoodRequest request) {
    return wellness.logMood(currentUser.get(), request);
  }

  @GetMapping("/moods")
  public List<MoodResponse> moods() {
    return wellness.moods(currentUser.get());
  }

  @PostMapping("/journals")
  public JournalResponse createJournal(@Valid @RequestBody JournalRequest request) {
    return wellness.createJournal(currentUser.get(), request);
  }

  @GetMapping("/journals")
  public List<JournalResponse> journals() {
    return wellness.journals(currentUser.get());
  }

  @GetMapping("/journals/{id}")
  public JournalResponse journal(@PathVariable Long id) {
    return wellness.journals(currentUser.get()).stream().filter(journal -> journal.id().equals(id)).findFirst().orElseThrow();
  }

  @PutMapping("/journals/{id}")
  public JournalResponse updateJournal(@PathVariable Long id, @Valid @RequestBody JournalRequest request) {
    return wellness.updateJournal(currentUser.get(), id, request);
  }

  @DeleteMapping("/journals/{id}")
  public void deleteJournal(@PathVariable Long id) {
    wellness.deleteJournal(currentUser.get(), id);
  }

  @PostMapping("/chat")
  public ChatResponse chat(@Valid @RequestBody ChatRequest request) {
    return wellness.chat(currentUser.get(), request);
  }

  @GetMapping("/chat/history")
  public List<ChatHistoryItem> chatHistory() {
    return wellness.chatHistory(currentUser.get());
  }

  @GetMapping("/dashboard")
  public DashboardResponse dashboard() {
    return wellness.dashboard(currentUser.get());
  }

  @GetMapping("/recommendations")
  public List<RecommendationResponse> recommendations() {
    return wellness.recommendations(currentUser.get());
  }

  @PutMapping("/profile/consent")
  public UserSummary consent(@Valid @RequestBody ConsentRequest request) {
    var user = currentUser.get();
    user.setModerationConsent(request.moderationConsent());
    user.setModerationConsentAt(request.moderationConsent() ? Instant.now() : null);
    users.save(user);
    return new UserSummary(user.getId(), user.getName(), user.getEmail(), user.getRole(), user.isModerationConsent(), user.getCreatedAt());
  }

  // --- Teen Wellness 2.0 & 3.0 Endpoints ---

  @PostMapping("/checkins")
  public DailyCheckinResponse logCheckin(@Valid @RequestBody DailyCheckinRequest request) {
    return teenWellness.logCheckin(currentUser.get(), request);
  }

  @GetMapping("/checkins/history")
  public List<DailyCheckinResponse> getCheckinHistory() {
    return teenWellness.getCheckinHistory(currentUser.get());
  }

  @GetMapping("/habits")
  public List<HabitResponse> getHabits(@RequestParam(required = false) String date) {
    java.time.LocalDate localDate = date == null ? java.time.LocalDate.now() : java.time.LocalDate.parse(date);
    return teenWellness.getHabitsWithCompletion(currentUser.get(), localDate);
  }

  @GetMapping("/habits/logs")
  public List<HabitLogResponse> getHabitLogs() {
    return teenWellness.getHabitLogs(currentUser.get());
  }

  @PostMapping("/habits")
  public HabitResponse createHabit(@Valid @RequestBody HabitCreateRequest request) {
    return teenWellness.createHabit(currentUser.get(), request);
  }

  @PostMapping("/habits/{id}/toggle")
  public HabitResponse toggleHabit(@PathVariable Long id, @RequestParam(required = false) String date) {
    java.time.LocalDate localDate = date == null ? java.time.LocalDate.now() : java.time.LocalDate.parse(date);
    return teenWellness.toggleHabit(currentUser.get(), id, localDate);
  }

  @DeleteMapping("/habits/{id}")
  public void deleteHabit(@PathVariable Long id) {
    teenWellness.deleteHabit(currentUser.get(), id);
  }

  @PostMapping("/gratitude")
  public GratitudeResponse logGratitude(@Valid @RequestBody GratitudeRequest request) {
    return teenWellness.logGratitude(currentUser.get(), request);
  }

  @GetMapping("/gratitude/history")
  public List<GratitudeResponse> getGratitudeHistory() {
    return teenWellness.getGratitudeHistory(currentUser.get());
  }

  @GetMapping("/goals")
  public List<LifeGoalResponse> getGoals() {
    return teenWellness.getGoals(currentUser.get());
  }

  @PostMapping("/goals")
  public LifeGoalResponse createGoal(@Valid @RequestBody LifeGoalRequest request) {
    return teenWellness.createGoal(currentUser.get(), request);
  }

  @PutMapping("/goals/{id}")
  public LifeGoalResponse updateGoal(@PathVariable Long id, @Valid @RequestBody LifeGoalRequest request) {
    return teenWellness.updateGoal(currentUser.get(), id, request);
  }

  @DeleteMapping("/goals/{id}")
  public void deleteGoal(@PathVariable Long id) {
    teenWellness.deleteGoal(currentUser.get(), id);
  }

  @PostMapping("/letters")
  public void writeLetter(@Valid @RequestBody LetterRequest request) {
    teenWellness.writeLetter(currentUser.get(), request.content(), request.unlockDate());
  }

  @GetMapping("/letters")
  public List<LetterRequest> getLetters() {
    return teenWellness.getLetters(currentUser.get()).stream()
        .map(letter -> {
          boolean locked = java.time.LocalDate.now().isBefore(letter.getUnlockDate());
          String displayContent = locked ? "[Locked until " + letter.getUnlockDate() + "]" : letter.getContent();
          return new LetterRequest(displayContent, letter.getUnlockDate());
        })
        .toList();
  }

  @PostMapping("/exams")
  public ExamResponse createExam(@Valid @RequestBody ExamRequest request) {
    return teenWellness.createExam(currentUser.get(), request);
  }

  @GetMapping("/exams")
  public List<ExamResponse> getExams() {
    return teenWellness.getExams(currentUser.get());
  }

  @PostMapping("/exams/{id}/study")
  public ExamResponse studyFocusSession(@PathVariable Long id, @RequestParam @Min(1) @Max(1440) int minutes) {
    return teenWellness.studyFocusSession(currentUser.get(), id, minutes);
  }

  @GetMapping("/badges")
  public List<BadgeResponse> getUserBadges() {
    return teenWellness.getUserBadges(currentUser.get());
  }

  @GetMapping("/challenges")
  public List<ChallengeResponse> getActiveChallenges() {
    return teenWellness.getActiveChallenges(currentUser.get());
  }

  @GetMapping("/burnout/check")
  public BurnoutCheckResponse checkBurnoutRisk() {
    return teenWellness.checkBurnoutRisk(currentUser.get());
  }

  @GetMapping("/correlations")
  public List<CorrelationResponse> getCorrelations() {
    return correlationEngine.getCorrelations(currentUser.get());
  }

  @GetMapping("/reflections/weekly")
  public java.util.Map<String, String> getWeeklyReflection() {
    return java.util.Map.of("content", reflectionService.generateWeeklyReflection(currentUser.get()));
  }

  @GetMapping("/future-me/generate")
  public java.util.Map<String, String> generateFutureMeLetter() {
    return java.util.Map.of("content", reflectionService.generateFutureMeLetter(currentUser.get()));
  }

  @GetMapping("/gamification/progress")
  public GamificationProgressResponse getGamificationProgress() {
    return teenWellness.getGamificationProgress(currentUser.get());
  }

  @PostMapping("/gamification/theme")
  public void updateGardenTheme(@Valid @RequestBody ThemeRequest request) {
    teenWellness.updateGardenTheme(currentUser.get(), request.theme());
  }

  @GetMapping("/companion")
  public CompanionResponse getCompanion() {
    return teenWellness.getCompanion(currentUser.get());
  }

  @GetMapping("/companion/templates")
  public List<CompanionTemplateResponse> getCompanionTemplates() {
    return teenWellness.getTemplates();
  }

  @PostMapping("/companion")
  public CompanionResponse saveCompanion(@Valid @RequestBody CompanionRequest request) {
    return teenWellness.saveCompanion(currentUser.get(), request);
  }
}
