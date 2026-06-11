package com.mindmate.repository;

import com.mindmate.domain.EmotionLog;
import com.mindmate.domain.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmotionLogRepository extends JpaRepository<EmotionLog, Long> {
  List<EmotionLog> findByUserOrderByCreatedAtDesc(User user);
}
