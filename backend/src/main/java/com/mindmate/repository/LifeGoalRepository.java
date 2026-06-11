package com.mindmate.repository;

import com.mindmate.domain.LifeGoal;
import com.mindmate.domain.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LifeGoalRepository extends JpaRepository<LifeGoal, Long> {
  List<LifeGoal> findByUser(User user);
}
