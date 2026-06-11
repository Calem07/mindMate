package com.mindmate.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

import com.mindmate.domain.DailyCheckin;
import com.mindmate.domain.User;
import com.mindmate.dto.AppDtos.BurnoutCheckResponse;
import com.mindmate.repository.*;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class TeenWellnessServiceTest {
  private UserRepository users;
  private DailyCheckinRepository checkins;
  private GratitudeJournalRepository gratitudeJournals;
  private HabitRepository habits;
  private HabitLogRepository habitLogs;
  private FutureMeLetterRepository letters;
  private ExamEventRepository exams;
  private LifeGoalRepository goals;
  private UserBadgeRepository badges;
  private UserChallengeRepository challenges;
  private JournalEntryRepository journals;
  private BadgeRepository badgeRepository;
  private CompanionMemoryRepository memoryRepository;

  private TeenWellnessService service;
  private User testUser;

  @BeforeEach
  void setUp() {
    users = mock(UserRepository.class);
    checkins = mock(DailyCheckinRepository.class);
    gratitudeJournals = mock(GratitudeJournalRepository.class);
    habits = mock(HabitRepository.class);
    habitLogs = mock(HabitLogRepository.class);
    letters = mock(FutureMeLetterRepository.class);
    exams = mock(ExamEventRepository.class);
    goals = mock(LifeGoalRepository.class);
    badges = mock(UserBadgeRepository.class);
    challenges = mock(UserChallengeRepository.class);
    journals = mock(JournalEntryRepository.class);
    badgeRepository = mock(BadgeRepository.class);
    memoryRepository = mock(CompanionMemoryRepository.class);

    service = new TeenWellnessService(
        users, checkins, gratitudeJournals, habits, habitLogs, letters, exams, goals, badges, challenges, journals, badgeRepository, memoryRepository
    );

    testUser = new User();
    testUser.setXp(0);
    testUser.setLevel(1);
  }

  @Test
  void testAddXpLevelProgression() {
    // Adding 150 XP should set level to (150/100) + 1 = 2
    service.addXp(testUser, 150);
    assertThat(testUser.getXp()).isEqualTo(150);
    assertThat(testUser.getLevel()).isEqualTo(2);
    verify(users).save(testUser);
  }

  @Test
  void testBurnoutRiskLowData() {
    when(checkins.findByUserOrderByCreatedAtDesc(testUser)).thenReturn(Collections.emptyList());
    BurnoutCheckResponse res = service.checkBurnoutRisk(testUser);
    assertThat(res.burnoutRisk()).isFalse();
    assertThat(res.suggestion()).contains("Complete more daily check-ins");
  }

  @Test
  void testBurnoutRiskTriggered() {
    DailyCheckin log1 = new DailyCheckin();
    log1.setStressLevel(5);
    log1.setSleepHours(5.0);
    log1.setMood("SAD");

    DailyCheckin log2 = new DailyCheckin();
    log2.setStressLevel(4);
    log2.setSleepHours(4.5);
    log2.setMood("STRESSED");

    DailyCheckin log3 = new DailyCheckin();
    log3.setStressLevel(3);
    log3.setSleepHours(7.0);
    log3.setMood("GOOD");

    List<DailyCheckin> history = Arrays.asList(log1, log2, log3);
    when(checkins.findByUserOrderByCreatedAtDesc(testUser)).thenReturn(history);

    BurnoutCheckResponse res = service.checkBurnoutRisk(testUser);
    assertThat(res.burnoutRisk()).isTrue();
    assertThat(res.suggestion()).contains("High Burnout Risk");
  }
}
