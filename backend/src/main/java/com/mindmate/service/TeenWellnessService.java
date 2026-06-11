package com.mindmate.service;

import com.mindmate.domain.*;
import com.mindmate.dto.AppDtos.*;
import com.mindmate.repository.*;
import java.time.LocalDate;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TeenWellnessService {
  private final UserRepository users;
  private final DailyCheckinRepository checkins;
  private final GratitudeJournalRepository gratitudeJournals;
  private final HabitRepository habits;
  private final HabitLogRepository habitLogs;
  private final FutureMeLetterRepository letters;
  private final ExamEventRepository exams;
  private final LifeGoalRepository goals;
  private final UserBadgeRepository badges;
  private final UserChallengeRepository challenges;
  private final JournalEntryRepository journals;
  private final BadgeRepository badgeRepository;
  private final CompanionMemoryRepository memoryRepository;

  public TeenWellnessService(
      UserRepository users, DailyCheckinRepository checkins, GratitudeJournalRepository gratitudeJournals,
      HabitRepository habits, HabitLogRepository habitLogs, FutureMeLetterRepository letters,
      ExamEventRepository exams, LifeGoalRepository goals, UserBadgeRepository badges,
      UserChallengeRepository challenges, JournalEntryRepository journals, BadgeRepository badgeRepository,
      CompanionMemoryRepository memoryRepository) {
    this.users = users;
    this.checkins = checkins;
    this.gratitudeJournals = gratitudeJournals;
    this.habits = habits;
    this.habitLogs = habitLogs;
    this.letters = letters;
    this.exams = exams;
    this.goals = goals;
    this.badges = badges;
    this.challenges = challenges;
    this.journals = journals;
    this.badgeRepository = badgeRepository;
    this.memoryRepository = memoryRepository;
  }

  // --- Gamification System ---

  @Transactional
  public void addXp(User user, int amount) {
    int currentXp = user.getXp() + amount;
    if (currentXp < 0) currentXp = 0;
    user.setXp(currentXp);

    // Level formula: Level = (XP / 100) + 1
    int targetLevel = (currentXp / 100) + 1;
    if (targetLevel > user.getLevel()) {
      user.setLevel(targetLevel);
      // Award level badges if milestones met
      if (targetLevel >= 5) checkAndEarnBadge(user, "Level 5: Optimist");
      if (targetLevel >= 10) checkAndEarnBadge(user, "Level 10: Achiever");
      if (targetLevel >= 20) checkAndEarnBadge(user, "Level 20: Mentor");
    }
    users.save(user);
  }

  @Transactional
  public void checkActivityStreak(User user) {
    LocalDate today = LocalDate.now();
    LocalDate lastDate = user.getLastActivityDate();

    if (lastDate == null) {
      user.setCurrentStreak(1);
      user.setLongestStreak(1);
    } else if (lastDate.equals(today.minusDays(1))) {
      int newStreak = user.getCurrentStreak() + 1;
      user.setCurrentStreak(newStreak);
      if (newStreak > user.getLongestStreak()) {
        user.setLongestStreak(newStreak);
      }
      if (newStreak == 3 || newStreak == 7 || newStreak == 14 || newStreak == 30) {
        addMemory(user, "STREAK", newStreak + "-Day Wellness Streak", "Reached a " + newStreak + "-Day Wellness Streak.");
      }
      if (newStreak >= 7) {
        if (checkAndEarnBadge(user, "7-Day Streak")) {
          addXp(user, 50); // Streak reward
        }
      }
    } else if (!lastDate.equals(today)) {
      user.setCurrentStreak(1);
    }

    user.setLastActivityDate(today);
    users.save(user);
  }

  @Transactional
  public boolean checkAndEarnBadge(User user, String badgeName) {
    if (!badges.existsByUserAndBadgeName(user, badgeName)) {
      UserBadge userBadge = new UserBadge();
      userBadge.setUser(user);
      userBadge.setBadgeName(badgeName);
      badges.save(userBadge);
      addXp(user, 15); // Badge achievement reward
      return true;
    }
    return false;
  }

  public GamificationProgressResponse getGamificationProgress(User user) {
    String levelTitle = "Level " + user.getLevel() + ": ";
    if (user.getLevel() < 5) levelTitle += "Explorer";
    else if (user.getLevel() < 10) levelTitle += "Optimist";
    else if (user.getLevel() < 20) levelTitle += "Achiever";
    else levelTitle += "Mentor";

    return new GamificationProgressResponse(
        user.getXp(), user.getLevel(), user.getCurrentStreak(), user.getLongestStreak(),
        user.getGardenTheme(), levelTitle
    );
  }

  @Transactional
  public void updateGardenTheme(User user, String theme) {
    user.setGardenTheme(theme);
    users.save(user);
  }

  // --- Daily Check-Ins ---

  @Transactional
  public DailyCheckinResponse logCheckin(User user, DailyCheckinRequest req) {
    DailyCheckin checkin = new DailyCheckin();
    checkin.setUser(user);
    checkin.setMood(req.mood());
    checkin.setEnergyLevel(req.energyLevel());
    checkin.setStressLevel(req.stressLevel());
    checkin.setSleepHours(req.sleepHours());
    checkin.setSleepQuality(req.sleepQuality());
    checkin.setSocialInteraction(req.socialInteraction());
    checkin.setMoodTrigger(req.moodTrigger());

    // Calculate wellness score 0 to 100
    int moodVal = switch (req.mood().toUpperCase()) {
      case "EXCELLENT" -> 100;
      case "GOOD" -> 80;
      case "NEUTRAL" -> 60;
      case "STRESSED" -> 40;
      case "SAD" -> 20;
      default -> 60;
    };
    int stressFactor = (6 - req.stressLevel()) * 20; // Lower stress = higher score
    int energyFactor = req.energyLevel() * 20;
    int sleepFactor = (int) Math.min(req.sleepHours() * 12.5, 100.0);
    int qualityFactor = req.sleepQuality() * 20;
    int socialFactor = req.socialInteraction() * 20;

    int wellnessScore = (moodVal + stressFactor + energyFactor + sleepFactor + qualityFactor + socialFactor) / 6;
    checkin.setWellnessScore(Math.max(0, Math.min(100, wellnessScore)));

    checkins.save(checkin);
    checkActivityStreak(user);
    addXp(user, 5);
    addPetXp(user, 20);

    String checkinDesc = String.format("Mood: %s, Sleep: %.1f hrs, Stress: %d/5",
        req.mood(), req.sleepHours(), req.stressLevel());
    addMemory(user, "CHECKIN", "Completed Daily Check-in", checkinDesc);

    if (req.sleepHours() >= 8.0 && req.sleepQuality() >= 4) {
      addMemory(user, "CHECKIN", "Reported improved sleep quality", "Reported improved sleep quality with " + req.sleepHours() + " hours of sleep.");
    }

    // Update dynamic checks for badges
    long checkinCount = checkins.findByUserOrderByCreatedAtDesc(user).size();
    if (checkinCount >= 5) {
      checkAndEarnBadge(user, "Wellness Warrior");
    }
    if (req.sleepHours() >= 8.0 && req.sleepQuality() >= 4) {
      checkAndEarnBadge(user, "Sleep Champion");
    }

    // Challenge check
    updateChallengeProgress(user, "SLEEP_CONSISTENCY", req.sleepHours() >= 8.0 ? 1 : 0);
    updateChallengeProgress(user, "MOOD_TRACKING", 1);

    return toCheckinResponse(checkin);
  }

  public List<DailyCheckinResponse> getCheckinHistory(User user) {
    return checkins.findByUserOrderByCreatedAtDesc(user).stream()
        .map(this::toCheckinResponse)
        .toList();
  }

  @Transactional(readOnly = true)
  public List<HabitLogResponse> getHabitLogs(User user) {
    return habitLogs.findByUser(user).stream()
        .filter(log -> log.getHabit() != null && log.getCompletedDate() != null)
        .map(log -> new HabitLogResponse(
            log.getId(),
            log.getHabit().getId(),
            log.getHabit().getName() == null ? "Habit" : log.getHabit().getName(),
            log.getCompletedDate()
        ))
        .toList();
  }

  // --- Habits Management ---

  @Transactional
  public List<HabitResponse> getHabitsWithCompletion(User user, LocalDate date) {
    List<Habit> userHabits = habits.findByUser(user);
    if (userHabits.isEmpty()) {
      // Seed default user habits
      String[] defaults = {"Drink water", "Sleep 8 hours", "Exercise", "Study", "Read", "Meditation"};
      for (String def : defaults) {
        Habit h = new Habit();
        h.setUser(user);
        h.setName(def);
        h.setCustom(false);
        h.setCreatedAt(Instant.now());
        habits.save(h);
        userHabits.add(h);
      }
    }

    List<HabitLog> completions = habitLogs.findByUserAndCompletedDate(user, date);
    return userHabits.stream().map(h -> {
      boolean completed = completions.stream().anyMatch(log -> log.getHabit().getId().equals(h.getId()));
      return new HabitResponse(h.getId(), h.getName(), h.isCustom(), completed);
    }).toList();
  }

  @Transactional
  public HabitResponse createHabit(User user, HabitCreateRequest req) {
    Habit h = new Habit();
    h.setUser(user);
    h.setName(req.name());
    h.setCustom(true);
    h.setCreatedAt(Instant.now());
    habits.save(h);
    return new HabitResponse(h.getId(), h.getName(), h.isCustom(), false);
  }

  @Transactional
  public HabitResponse toggleHabit(User user, Long id, LocalDate date) {
    Habit h = habits.findById(id).filter(item -> item.getUser().getId().equals(user.getId())).orElseThrow();
    Optional<HabitLog> logOpt = habitLogs.findByUserAndHabitAndCompletedDate(user, h, date);
    boolean completed;

    if (logOpt.isPresent()) {
      habitLogs.delete(logOpt.get());
      addXp(user, -3);
      addPetXp(user, -10);
      completed = false;
    } else {
      HabitLog log = new HabitLog();
      log.setHabit(h);
      log.setUser(user);
      log.setCompletedDate(date);
      habitLogs.save(log);
      addXp(user, 3);
      addPetXp(user, 10);
      completed = true;

      // Check badges
      long completedCount = habitLogs.findByUser(user).size();
      if (completedCount >= 10) checkAndEarnBadge(user, "Consistency Master");
      if (completedCount >= 5) checkAndEarnBadge(user, "Habit Hero");

      // Update challenge
      updateChallengeProgress(user, "HABIT_DAILY", 1);
      
      addMemory(user, "HABIT", "Completed Habit", "Completed " + h.getName() + " habit.");
    }
    return new HabitResponse(h.getId(), h.getName(), h.isCustom(), completed);
  }

  @Transactional
  public void deleteHabit(User user, Long id) {
    Habit h = habits.findById(id).filter(item -> item.getUser().getId().equals(user.getId())).orElseThrow();
    habits.delete(h);
  }

  // --- Gratitude Journal ---

  @Transactional
  public GratitudeResponse logGratitude(User user, GratitudeRequest req) {
    GratitudeJournal journal = new GratitudeJournal();
    journal.setUser(user);
    journal.setHappyMoment(req.happyMoment());
    journal.setGratefulFor(req.gratefulFor());
    journal.setProudAchievement(req.proudAchievement());
    gratitudeJournals.save(journal);

    checkActivityStreak(user);
    addXp(user, 10);
    addPetXp(user, 15);
    checkAndEarnBadge(user, "First Journal Entry");
    addMemory(user, "GRATITUDE", "Logged Gratitude Entry", "Logged happy moment and gratitude.");

    return new GratitudeResponse(
        journal.getId(), journal.getHappyMoment(), journal.getGratefulFor(),
        journal.getProudAchievement(), journal.getCreatedAt()
    );
  }

  public List<GratitudeResponse> getGratitudeHistory(User user) {
    return gratitudeJournals.findByUserOrderByCreatedAtDesc(user).stream()
        .map(j -> new GratitudeResponse(j.getId(), j.getHappyMoment(), j.getGratefulFor(), j.getProudAchievement(), j.getCreatedAt()))
        .toList();
  }

  // --- Life Goals Tracker ---

  @Transactional
  public LifeGoalResponse createGoal(User user, LifeGoalRequest req) {
    LifeGoal goal = new LifeGoal();
    goal.setUser(user);
    goal.setCategory(req.category());
    goal.setTitle(req.title());
    goal.setTargetDate(req.targetDate());
    goal.setProgressPercent(req.progressPercent());
    goal.setCompleted(req.completed());
    goals.save(goal);
    addXp(user, 10);
    return toGoalResponse(goal);
  }

  public List<LifeGoalResponse> getGoals(User user) {
    return goals.findByUser(user).stream().map(this::toGoalResponse).toList();
  }

  @Transactional
  public LifeGoalResponse updateGoal(User user, Long id, LifeGoalRequest req) {
    LifeGoal goal = goals.findById(id).filter(g -> g.getUser().getId().equals(user.getId())).orElseThrow();
    goal.setCategory(req.category());
    goal.setTitle(req.title());
    goal.setTargetDate(req.targetDate());
    goal.setProgressPercent(req.progressPercent());
    boolean wasCompleted = goal.isCompleted();
    goal.setCompleted(req.completed());
    goals.save(goal);

    if (goal.isCompleted() && !wasCompleted) {
      addXp(user, 20); // Bonus for completion
      addPetXp(user, 50);
      checkAndEarnBadge(user, "Goal Achiever");
      addMemory(user, "GOAL", "Completed Goal", "Completed goal: " + goal.getTitle());
    }

    return toGoalResponse(goal);
  }

  @Transactional
  public void deleteGoal(User user, Long id) {
    LifeGoal goal = goals.findById(id).filter(g -> g.getUser().getId().equals(user.getId())).orElseThrow();
    goals.delete(goal);
  }

  // --- Future Me Letters ---

  @Transactional
  public FutureMeLetter writeLetter(User user, String content, LocalDate unlockDate) {
    FutureMeLetter letter = new FutureMeLetter();
    letter.setUser(user);
    letter.setContent(content);
    letter.setUnlockDate(unlockDate);
    letters.save(letter);
    addXp(user, 10);
    return letter;
  }

  public List<FutureMeLetter> getLetters(User user) {
    return letters.findByUser(user);
  }

  // --- Exam Mode ---

  @Transactional
  public ExamResponse createExam(User user, ExamRequest req) {
    ExamEvent exam = new ExamEvent();
    exam.setUser(user);
    exam.setSubject(req.subject());
    exam.setExamDate(req.examDate());
    exam.setStudyMinutes(req.studyMinutes());
    exams.save(exam);
    addXp(user, 10);
    return toExamResponse(exam);
  }

  public List<ExamResponse> getExams(User user) {
    return exams.findByUserOrderByExamDateAsc(user).stream().map(this::toExamResponse).toList();
  }

  @Transactional
  public ExamResponse studyFocusSession(User user, Long id, int minutes) {
    ExamEvent exam = exams.findById(id).filter(e -> e.getUser().getId().equals(user.getId())).orElseThrow();
    exam.setStudyMinutes(exam.getStudyMinutes() + minutes);
    exams.save(exam);
    addXp(user, minutes / 5); // 1 XP for every 5 minutes studied
    addPetXp(user, minutes);
    addMemory(user, "CHECKIN", "Study Focus Session", "Completed " + minutes + " minutes of study focus for " + exam.getSubject() + ".");
    return toExamResponse(exam);
  }

  // --- Badges & Challenges ---

  public List<BadgeResponse> getUserBadges(User user) {
    List<Badge> allBadges = badgeRepository.findAll();
    List<UserBadge> earned = badges.findByUser(user);
    List<BadgeResponse> list = new ArrayList<>();
    for (Badge b : allBadges) {
      Optional<UserBadge> match = earned.stream()
          .filter(item -> item.getBadgeName().equalsIgnoreCase(b.getName()))
          .findFirst();
      list.add(new BadgeResponse(
          b.getName(),
          b.getDescription(),
          b.getXpReward(),
          b.getRarity(),
          match.map(UserBadge::getEarnedAt).orElse(null),
          match.isPresent()
      ));
    }
    return list;
  }

  public List<ChallengeResponse> getActiveChallenges(User user) {
    List<UserChallenge> list = challenges.findByUser(user);
    if (list.isEmpty()) {
      // Seed challenges
      createChallenge(user, "Journal for 7 Consecutive Days", "JOURNAL_STREAK", 7, 50);
      createChallenge(user, "Sleep 8 Hours for 5 Days", "SLEEP_CONSISTENCY", 5, 40);
      createChallenge(user, "Complete 3 Habits Daily", "HABIT_DAILY", 3, 30);
      createChallenge(user, "Maintain Positive Mood Tracking", "MOOD_TRACKING", 5, 30);
      list = challenges.findByUser(user);
    }
    return list.stream().map(this::toChallengeResponse).toList();
  }

  private void createChallenge(User user, String name, String type, int target, int xp) {
    UserChallenge uc = new UserChallenge();
    uc.setUser(user);
    uc.setChallengeName(name);
    uc.setChallengeType(type);
    uc.setProgress(0);
    uc.setTarget(target);
    uc.setCompleted(false);
    uc.setRewardXp(xp);
    challenges.save(uc);
  }

  @Transactional
  public void updateChallengeProgress(User user, String type, int amount) {
    List<UserChallenge> list = challenges.findByUser(user);
    for (UserChallenge uc : list) {
      if (uc.getChallengeType().equals(type) && !uc.isCompleted()) {
        int newProgress = uc.getProgress() + amount;
        if (newProgress >= uc.getTarget()) {
          uc.setProgress(uc.getTarget());
          uc.setCompleted(true);
          addXp(user, uc.getRewardXp());
        } else {
          uc.setProgress(newProgress);
        }
        challenges.save(uc);
      }
    }
  }

  // --- Burnout Detection Logic ---

  public BurnoutCheckResponse checkBurnoutRisk(User user) {
    List<DailyCheckin> history = checkins.findByUserOrderByCreatedAtDesc(user);
    if (history.size() < 3) {
      return new BurnoutCheckResponse(false, "Complete more daily check-ins to monitor burnout risk.");
    }

    // Check last 3 logs
    List<DailyCheckin> recent = history.stream().limit(3).toList();
    long highStressCount = recent.stream().filter(c -> c.getStressLevel() >= 4).count();
    long lowSleepCount = recent.stream().filter(c -> c.getSleepHours() < 6.0).count();
    long negativeMoodCount = recent.stream().filter(c -> c.getMood().equalsIgnoreCase("SAD") || c.getMood().equalsIgnoreCase("STRESSED")).count();

    if (highStressCount >= 2 && lowSleepCount >= 2) {
      return new BurnoutCheckResponse(true, "High Burnout Risk: Consecutive stress levels and sleep deficit detected. Try setting a focus timer limit, sleeping earlier, and using a breathing exercise.");
    }
    if (negativeMoodCount >= 2) {
      return new BurnoutCheckResponse(true, "Mild Fatigue Warning: Recent mood shows fatigue or low energy. Consider taking a 15-minute screen-free break.");
    }
    return new BurnoutCheckResponse(false, "Wellness levels within stable ranges. Keep maintaining balanced study and sleep intervals.");
  }

  // --- Conversions ---

  private DailyCheckinResponse toCheckinResponse(DailyCheckin c) {
    return new DailyCheckinResponse(
        c.getId(), c.getMood(), c.getEnergyLevel(), c.getStressLevel(),
        c.getSleepHours(), c.getSleepQuality(), c.getSocialInteraction(),
        c.getMoodTrigger(), c.getWellnessScore(), c.getCreatedAt()
    );
  }

  private LifeGoalResponse toGoalResponse(LifeGoal g) {
    return new LifeGoalResponse(
        g.getId(), g.getCategory(), g.getTitle(), g.getTargetDate(),
        g.getProgressPercent(), g.isCompleted(), g.getCreatedAt()
    );
  }

  private ChallengeResponse toChallengeResponse(UserChallenge uc) {
    return new ChallengeResponse(
        uc.getId(), uc.getChallengeName(), uc.getChallengeType(),
        uc.getProgress(), uc.getTarget(), uc.isCompleted(), uc.getRewardXp()
    );
  }

  private ExamResponse toExamResponse(ExamEvent e) {
    return new ExamResponse(e.getId(), e.getSubject(), e.getExamDate(), e.getStudyMinutes(), e.getCreatedAt());
  }

  public static final List<CompanionTemplateResponse> COMPANION_TEMPLATES = List.of(
      new CompanionTemplateResponse("CAT", "Cat", "Reflective", "Luna is calm, reflective, and supportive, helping you ponder your feelings.", "Classic", "None", "luna_avatar.png"),
      new CompanionTemplateResponse("DOG", "Dog", "Motivational", "Max is energetic, motivational, and upbeat, pushing you to do your best.", "Classic", "None", "max_avatar.png"),
      new CompanionTemplateResponse("FOX", "Fox", "Strategic", "Nova is strategic and goal-oriented, helping you analyze and plan your success.", "Classic", "None", "nova_avatar.png"),
      new CompanionTemplateResponse("PANDA", "Panda", "Calm", "Bamboo is calm, mindful, and peaceful, helping you find grounding and relax.", "Classic", "None", "bamboo_avatar.png"),
      new CompanionTemplateResponse("RABBIT", "Rabbit", "Positive", "Mochi is sweet, positive, and encouraging, spreading joy and reassurance.", "Classic", "None", "mochi_avatar.png"),
      new CompanionTemplateResponse("OWL", "Owl", "Wise", "Sage is wise, thoughtful, and insightful, offering gentle and deep guidance.", "Classic", "None", "sage_avatar.png")
  );

  public List<CompanionTemplateResponse> getTemplates() {
      return COMPANION_TEMPLATES;
  }

  @Transactional
  public void addMemory(User user, String type, String title, String description) {
    CompanionMemory memory = new CompanionMemory();
    memory.setUser(user);
    memory.setMemoryType(type);
    memory.setTitle(title);
    memory.setDescription(description);
    memory.setCreatedAt(Instant.now());
    memoryRepository.save(memory);
  }

  @Transactional
  public void addPetXp(User user, int amount) {
    if (user.getPetType() == null) return;
    int oldXp = user.getPetXp();
    int newXp = Math.max(0, oldXp + amount);
    user.setPetXp(newXp);

    int oldLevel = (oldXp / 100) + 1;
    int newLevel = (newXp / 100) + 1;

    if (newLevel > oldLevel) {
      String milestoneMsg = String.format("✨ %s reached Level %d", user.getPetName(), newLevel);
      String evolution = getEvolutionStage(newLevel);
      String unlock = getUnlockForLevel(newLevel);

      String desc = "Evolution: " + evolution;
      if (unlock != null) {
        desc += " | Unlocked: " + unlock;
      }
      addMemory(user, "ACHIEVEMENT", milestoneMsg, desc);
    }
    users.save(user);
  }

  public static String getEvolutionStage(int level) {
    if (level < 5) return "BABY";
    if (level < 10) return "YOUNG";
    return "ADULT";
  }

  private String getUnlockForLevel(int level) {
    return switch (level) {
      case 2 -> "Glasses";
      case 3 -> "Forest Theme";
      case 4 -> "Scarves";
      case 5 -> "Autumn Theme";
      case 6 -> "Hats";
      case 8 -> "Backpacks";
      case 10 -> "Galaxy Theme";
      case 12 -> "Crowns";
      case 15 -> "Cyber Theme";
      default -> null;
    };
  }

  public static String getPetSpecies(String petType) {
    if (petType == null) return "";
    return switch (petType.toUpperCase()) {
      case "FOX" -> "Fox";
      case "CAT" -> "Cat";
      case "DOG" -> "Dog";
      case "PANDA" -> "Panda";
      case "RABBIT" -> "Rabbit";
      case "OWL" -> "Owl";
      default -> petType;
    };
  }

  public static String getPetPersonality(String petType) {
    if (petType == null) return "";
    return switch (petType.toUpperCase()) {
      case "FOX" -> "Strategic";
      case "CAT" -> "Reflective";
      case "DOG" -> "Motivational";
      case "PANDA" -> "Calm";
      case "RABBIT" -> "Positive";
      case "OWL" -> "Wise";
      default -> "Friendly";
    };
  }

  public static String getPetAvatarFilename(String petType) {
    if (petType == null) return "luna_avatar.png";
    return petType.toLowerCase() + "_avatar.png";
  }

  public List<String> getUnlockedThemes(int level) {
    List<String> themes = new ArrayList<>();
    themes.add("Classic");
    if (level >= 3) themes.add("Forest");
    if (level >= 5) themes.add("Autumn");
    if (level >= 10) themes.add("Galaxy");
    if (level >= 15) themes.add("Cyber");
    return themes;
  }

  public List<String> getUnlockedAccessories(int level) {
    List<String> accs = new ArrayList<>();
    accs.add("None");
    if (level >= 2) accs.add("Glasses");
    if (level >= 4) accs.add("Scarves");
    if (level >= 6) accs.add("Hats");
    if (level >= 8) accs.add("Backpacks");
    if (level >= 12) accs.add("Crowns");
    return accs;
  }

  public String calculateCompanionMood(User user) {
    List<DailyCheckin> checkinList = checkins.findByUserOrderByCreatedAtDesc(user);
    DailyCheckin latestCheckin = checkinList.isEmpty() ? null : checkinList.get(0);

    // 1. CONCERNED: Stress level >= 4
    if (latestCheckin != null && latestCheckin.getStressLevel() >= 4) {
      return "CONCERNED";
    }

    // 2. SLEEPY: Sleep < 6.0
    if (latestCheckin != null && latestCheckin.getSleepHours() < 6.0) {
      return "SLEEPY";
    }

    // 3. THINKING: Upcoming exam in 2 days
    List<ExamEvent> userExams = exams.findByUserOrderByExamDateAsc(user);
    boolean hasExamSoon = false;
    LocalDate today = LocalDate.now();
    for (ExamEvent exam : userExams) {
      LocalDate examLocalDate = LocalDate.ofInstant(exam.getExamDate(), java.time.ZoneId.systemDefault());
      if (!examLocalDate.isBefore(today) && !examLocalDate.isAfter(today.plusDays(2))) {
        hasExamSoon = true;
        break;
      }
    }
    if (hasExamSoon) {
      return "THINKING";
    }

    // 4. MOTIVATED: Habits completed today >= 3 or (>= 1 habit and active goals)
    List<HabitLog> todayLogs = habitLogs.findByUserAndCompletedDate(user, today);
    int completedHabitsCount = todayLogs.size();
    List<LifeGoal> activeGoals = goals.findByUser(user).stream().filter(g -> !g.isCompleted()).toList();
    if (completedHabitsCount >= 3 || (completedHabitsCount >= 1 && !activeGoals.isEmpty())) {
      return "MOTIVATED";
    }

    // 5. HAPPY: Wellness score >= 75 and streak >= 3
    if (latestCheckin != null && latestCheckin.getWellnessScore() >= 75 && user.getCurrentStreak() >= 3) {
      return "HAPPY";
    }

    return "CALM";
  }

  public String generateCompanionInsight(User user, String petName, String mood) {
    LocalDate today = LocalDate.now();
    List<HabitLog> todayLogs = habitLogs.findByUserAndCompletedDate(user, today);
    int completedHabitsCount = todayLogs.size();

    List<ExamEvent> userExams = exams.findByUserOrderByExamDateAsc(user);
    ExamEvent soonExam = null;
    long examDays = -1;
    for (ExamEvent exam : userExams) {
      LocalDate examLocalDate = LocalDate.ofInstant(exam.getExamDate(), java.time.ZoneId.systemDefault());
      long daysBetween = java.time.temporal.ChronoUnit.DAYS.between(today, examLocalDate);
      if (daysBetween >= 0 && daysBetween <= 2) {
        soonExam = exam;
        examDays = daysBetween;
        break;
      }
    }

    // Combined habits + exam case
    if (completedHabitsCount > 0 && soonExam != null) {
      String dayText = examDays == 0 ? "today" : (examDays == 1 ? "tomorrow" : "only " + examDays + " days away");
      return String.format("%s noticed you completed %d %s today and your %s exam is %s.",
          petName, completedHabitsCount, completedHabitsCount == 1 ? "habit" : "habits", soonExam.getSubject(), dayText);
    }

    // Individual cases
    if (soonExam != null) {
      String dayText = examDays == 0 ? "today" : (examDays == 1 ? "tomorrow" : "in 2 days");
      return String.format("%s noticed your %s exam is %s. Let's block some study focus time!", petName, soonExam.getSubject(), dayText);
    }

    List<DailyCheckin> checkinList = checkins.findByUserOrderByCreatedAtDesc(user);
    DailyCheckin latestCheckin = checkinList.isEmpty() ? null : checkinList.get(0);
    if (latestCheckin != null) {
      if (latestCheckin.getStressLevel() >= 4) {
        return String.format("%s noticed you're feeling a bit stressed. Let's take a 10-minute break together.", petName);
      }
      if (latestCheckin.getSleepHours() < 6.0) {
        return String.format("%s noticed you got only %.1f hours of sleep last night. Prioritize resting early tonight!", petName, latestCheckin.getSleepHours());
      }
    }

    if (completedHabitsCount >= 3) {
      return String.format("%s noticed you completed %d habits today! Excellent progress on your goals.", petName, completedHabitsCount);
    }

    if (user.getCurrentStreak() >= 3) {
      return String.format("%s is cheering for your %d-day streak! You're building amazing consistency.", petName, user.getCurrentStreak());
    }

    if (latestCheckin != null && latestCheckin.getWellnessScore() >= 75) {
      return String.format("%s is happy to see your wellness score at %d. Keep up this balanced rhythm!", petName, latestCheckin.getWellnessScore());
    }

    return String.format("%s is here to guide you. Try logging a gratitude entry or check-in to start your day.", petName);
  }

  public CompanionResponse getCompanion(User user) {
    if (user.getPetType() == null) {
      return new CompanionResponse(
          null, null, "", "", 0, 1, "BABY", "CALM", "luna_avatar.png",
          List.of("Classic"), List.of("None"), "", false
      );
    }
    int xp = user.getPetXp();
    int level = (xp / 100) + 1;
    String mood = calculateCompanionMood(user);
    String petName = user.getPetName();
    String petType = user.getPetType();
    
    return new CompanionResponse(
        petType,
        petName,
        getPetSpecies(petType),
        getPetPersonality(petType),
        xp,
        level,
        getEvolutionStage(level),
        mood,
        getPetAvatarFilename(petType),
        getUnlockedThemes(level),
        getUnlockedAccessories(level),
        generateCompanionInsight(user, petName, mood),
        user.isHasSelectedCompanion()
    );
  }

  @Transactional
  public CompanionResponse saveCompanion(User user, CompanionRequest req) {
    user.setPetType(req.petType());
    user.setPetName(req.petName());
    user.setPetTheme(req.petTheme() == null ? "Classic" : req.petTheme());
    user.setPetAccessory(req.petAccessory() == null ? "None" : req.petAccessory());
    user.setHasSelectedCompanion(true);
    if (user.getPetCreatedAt() == null) {
      user.setPetCreatedAt(Instant.now());
    }
    users.save(user);
    return getCompanion(user);
  }
}
