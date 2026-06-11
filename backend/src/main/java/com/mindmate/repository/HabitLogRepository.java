package com.mindmate.repository;

import com.mindmate.domain.Habit;
import com.mindmate.domain.HabitLog;
import com.mindmate.domain.User;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HabitLogRepository extends JpaRepository<HabitLog, Long> {
  Optional<HabitLog> findByUserAndHabitAndCompletedDate(User user, Habit habit, LocalDate date);
  List<HabitLog> findByUserAndCompletedDate(User user, LocalDate date);
  @EntityGraph(attributePaths = "habit")
  List<HabitLog> findByUser(User user);
  void deleteByUserAndHabitAndCompletedDate(User user, Habit habit, LocalDate date);
}
