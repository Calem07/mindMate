package com.mindmate.repository;

import com.mindmate.domain.DailyCheckin;
import com.mindmate.domain.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DailyCheckinRepository extends JpaRepository<DailyCheckin, Long> {
  List<DailyCheckin> findByUserOrderByCreatedAtDesc(User user);
}
