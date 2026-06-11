package com.mindmate.service;

import com.mindmate.domain.DailyCheckin;
import com.mindmate.domain.HabitLog;
import com.mindmate.domain.User;
import com.mindmate.dto.AppDtos.CorrelationResponse;
import com.mindmate.repository.DailyCheckinRepository;
import com.mindmate.repository.HabitLogRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CorrelationEngineService {
  private final DailyCheckinRepository checkins;
  private final HabitLogRepository habitLogs;

  public CorrelationEngineService(DailyCheckinRepository checkins, HabitLogRepository habitLogs) {
    this.checkins = checkins;
    this.habitLogs = habitLogs;
  }

  @Transactional(readOnly = true)
  public List<CorrelationResponse> getCorrelations(User user) {
    List<DailyCheckin> logs = checkins.findByUserOrderByCreatedAtDesc(user).stream()
        .filter(checkin -> checkin != null && checkin.getCreatedAt() != null)
        .toList();
    List<CorrelationResponse> correlations = new ArrayList<>();

    if (logs.size() < 3) {
      correlations.add(new CorrelationResponse(
          "Insufficient Data",
          "Calculations pending",
          "Please log daily check-ins for at least 3 days to reveal habits correlations."
      ));
      return correlations;
    }

    // Correlation 1: Sleep Hours vs Mood Score
    double highSleepAvgMood = 0;
    int highSleepCount = 0;
    double lowSleepAvgMood = 0;
    int lowSleepCount = 0;

    for (DailyCheckin c : logs) {
      int score = getMoodScore(c.getMood());
      if (c.getSleepHours() >= 7.5) {
        highSleepAvgMood += score;
        highSleepCount++;
      } else {
        lowSleepAvgMood += score;
        lowSleepCount++;
      }
    }

    if (highSleepCount > 0 && lowSleepCount > 0) {
      double diff = (highSleepAvgMood / highSleepCount) - (lowSleepAvgMood / lowSleepCount);
      String text = diff > 5 
          ? String.format("You score %.1f%% happier on days with 7.5+ sleep hours compared to shorter nights.", diff)
          : "Your daily mood remains consistent across various sleeping lengths.";
      correlations.add(new CorrelationResponse("Sleep Hours", "Mood Score", text));
    }

    // Correlation 2: Stress vs Social Interaction
    double highSocialStress = 0;
    int highSocialCount = 0;
    double lowSocialStress = 0;
    int lowSocialCount = 0;

    for (DailyCheckin c : logs) {
      if (c.getSocialInteraction() >= 4) {
        highSocialStress += c.getStressLevel();
        highSocialCount++;
      } else {
        lowSocialStress += c.getStressLevel();
        lowSocialCount++;
      }
    }

    if (highSocialCount > 0 && lowSocialCount > 0) {
      double diff = (lowSocialStress / lowSocialCount) - (highSocialStress / highSocialCount);
      String text = diff > 0.5
          ? String.format("Social interactions lower your average stress by %.1f levels.", diff)
          : "Social engagement shows neutral influence on your daily academic stress.";
      correlations.add(new CorrelationResponse("Social Interaction", "Stress Reduction", text));
    }

    // Correlation 3: Exercise Habit Logs vs Wellness Score
    List<HabitLog> hLogs = habitLogs.findByUser(user).stream()
        .filter(log -> log.getHabit() != null && log.getCompletedDate() != null)
        .toList();
    if (!hLogs.isEmpty()) {
      double exerciseDayWellness = 0;
      int exerciseDayCount = 0;
      double nonExerciseDayWellness = 0;
      int nonExerciseDayCount = 0;

      for (DailyCheckin c : logs) {
        java.time.LocalDate checkinDate = c.getCreatedAt().atZone(java.time.ZoneId.systemDefault()).toLocalDate();
        boolean exercised = hLogs.stream().anyMatch(h -> 
            h.getCompletedDate().equals(checkinDate)
                && h.getHabit().getName() != null
                && h.getHabit().getName().toLowerCase(Locale.ROOT).contains("exercise")
        );

        if (exercised) {
          exerciseDayWellness += c.getWellnessScore();
          exerciseDayCount++;
        } else {
          nonExerciseDayWellness += c.getWellnessScore();
          nonExerciseDayCount++;
        }
      }

      if (exerciseDayCount > 0) {
        double diff = (exerciseDayWellness / exerciseDayCount) - (nonExerciseDayWellness / Math.max(1, nonExerciseDayCount));
        if (diff > 2) {
          correlations.add(new CorrelationResponse(
              "Exercise", "Wellness Index",
              String.format("Wellness index increases by %.1f points on days you complete your exercise habit.", diff)
          ));
        }
      }
    }

    if (correlations.isEmpty()) {
      correlations.add(new CorrelationResponse(
          "Stable Routine",
          "Balanced Indicators",
          "No extreme variance detected. Your indicators (sleep, social interaction, habits) represent a balanced routine."
      ));
    }

    return correlations;
  }

  private int getMoodScore(String mood) {
    if (mood == null || mood.isBlank()) {
      return 60;
    }
    return switch (mood.toUpperCase(Locale.ROOT)) {
      case "EXCELLENT" -> 100;
      case "GOOD" -> 80;
      case "NEUTRAL" -> 60;
      case "STRESSED" -> 40;
      case "SAD" -> 20;
      default -> 60;
    };
  }
}
