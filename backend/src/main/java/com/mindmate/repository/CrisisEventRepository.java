package com.mindmate.repository;

import com.mindmate.domain.CrisisEvent;
import com.mindmate.domain.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CrisisEventRepository extends JpaRepository<CrisisEvent, Long> {
  List<CrisisEvent> findByUserOrderByCreatedAtDesc(User user);
}
