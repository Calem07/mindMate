package com.mindmate.repository;

import com.mindmate.domain.Mood;
import com.mindmate.domain.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MoodRepository extends JpaRepository<Mood, Long> {
  List<Mood> findByUserOrderByCreatedAtDesc(User user);
}
