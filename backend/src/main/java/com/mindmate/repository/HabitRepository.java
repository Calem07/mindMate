package com.mindmate.repository;

import com.mindmate.domain.Habit;
import com.mindmate.domain.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HabitRepository extends JpaRepository<Habit, Long> {
  List<Habit> findByUser(User user);
}
