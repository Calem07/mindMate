package com.mindmate.dto;

import com.mindmate.domain.Enums.*;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.List;

public final class AppDtos {
  private AppDtos() {}

  public record MoodRequest(@NotNull MoodOption mood) {}
  public record MoodResponse(Long id, MoodOption mood, Instant createdAt) {}
  public record JournalRequest(@NotBlank @Size(max = 220) String title, @NotBlank @Size(max = 10000) String content) {}
  public record JournalResponse(Long id, String title, String content, String summary, String keyConcerns, Emotion emotion, Instant createdAt) {}
  public record ChatRequest(@NotBlank @Size(max = 4000) String message) {}
  public record ChatResponse(String reply, Emotion emotion, double confidenceScore, boolean crisisDetected) {}
  public record ChatHistoryItem(Sender sender, String content, Instant createdAt) {}
  public record RecommendationResponse(Long id, String content, String source, Instant createdAt) {}
  public record DashboardResponse(long moodCount, long journalCount, long chatMessageCount, long crisisEventCount, List<MoodResponse> recentMoods, List<JournalResponse> recentJournals) {}
  public record ConsentRequest(@NotNull Boolean moderationConsent) {}
  public record UserSummary(Long id, String name, String email, Role role, boolean moderationConsent, Instant createdAt) {}
  public record ModerationItem(String type, Long userId, String userEmail, String content, Instant createdAt) {}
  public record CrisisEventResponse(Long id, Long userId, String triggerPhrase, String sourceText, Instant createdAt) {}

  // Teen Wellness 2.0 & 3.0 records
  public record DailyCheckinRequest(
      @NotBlank @Pattern(regexp = "EXCELLENT|GOOD|NEUTRAL|STRESSED|SAD") String mood,
      @Min(1) @Max(5) int energyLevel,
      @Min(1) @Max(5) int stressLevel,
      @DecimalMin("0.0") @DecimalMax("24.0") double sleepHours,
      @Min(1) @Max(5) int sleepQuality,
      @Min(1) @Max(5) int socialInteraction,
      @Size(max = 100) String moodTrigger
  ) {}
  public record DailyCheckinResponse(Long id, String mood, int energyLevel, int stressLevel, double sleepHours, int sleepQuality, int socialInteraction, String moodTrigger, int wellnessScore, Instant createdAt) {}
  
  public record GratitudeRequest(@NotBlank @Size(max = 4000) String happyMoment, @NotBlank @Size(max = 4000) String gratefulFor, @NotBlank @Size(max = 4000) String proudAchievement) {}
  public record GratitudeResponse(Long id, String happyMoment, String gratefulFor, String proudAchievement, Instant createdAt) {}

  public record HabitResponse(Long id, String name, boolean isCustom, boolean completed) {}
  public record HabitLogResponse(Long id, Long habitId, String habitName, java.time.LocalDate completedDate) {}
  public record HabitCreateRequest(@NotBlank @Size(max = 160) String name) {}

  public record LifeGoalRequest(
      @NotBlank @Pattern(regexp = "ACADEMIC|FITNESS|PERSONAL_DEVELOPMENT|CAREER_PREPARATION|SKILL_DEVELOPMENT|PERSONAL|CAREER|SKILL|HEALTH|OTHER|Growth|Academic|Dream|Fitness|Career") String category,
      @NotBlank @Size(max = 220) String title,
      @FutureOrPresent java.time.LocalDate targetDate,
      @Min(0) @Max(100) int progressPercent,
      boolean completed
  ) {}
  public record LifeGoalResponse(Long id, String category, String title, java.time.LocalDate targetDate, int progressPercent, boolean completed, Instant createdAt) {}

  public record BadgeResponse(String badgeName, String description, int xpReward, String rarity, Instant earnedAt, boolean earned) {}
  public record ChallengeResponse(Long id, String challengeName, String challengeType, int progress, int target, boolean completed, int rewardXp) {}

  public record ExamRequest(@NotBlank @Size(max = 160) String subject, @NotNull Instant examDate, @Min(0) @Max(100000) int studyMinutes) {}
  public record ExamResponse(Long id, String subject, Instant examDate, int studyMinutes, Instant createdAt) {}

  public record GamificationProgressResponse(int xp, int level, int currentStreak, int longestStreak, String gardenTheme, String levelTitle) {}
  public record BurnoutCheckResponse(boolean burnoutRisk, String suggestion) {}
  public record CorrelationResponse(String factor, String effect, String correlationText) {}
  public record LetterRequest(@NotBlank @Size(max = 10000) String content, @NotNull @FutureOrPresent java.time.LocalDate unlockDate) {}
  public record ThemeRequest(@NotBlank @Pattern(regexp = "classic|Classic|forest|Forest|autumn|Autumn|galaxy|Galaxy|cyber|Cyber") String theme) {}
  public record CompanionRequest(
      @NotBlank @Pattern(regexp = "CAT|DOG|FOX|PANDA|RABBIT|OWL") String petType,
      @NotBlank @Size(max = 100) String petName,
      @Size(max = 100) String petTheme,
      @Size(max = 100) String petAccessory
  ) {}
  public record CompanionResponse(
      String petType,
      String petName,
      String species,
      String personality,
      int petXp,
      int level,
      String evolutionStage,
      String mood,
      String avatar,
      List<String> unlockedThemes,
      List<String> unlockedAccessories,
      String insight,
      boolean hasSelectedCompanion
  ) {}
  public record CompanionTemplateResponse(
      String petType,
      String species,
      String personality,
      String description,
      String defaultTheme,
      String defaultAccessory,
      String avatar
  ) {}
}
