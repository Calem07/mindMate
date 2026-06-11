package com.mindmate.repository;

import com.mindmate.domain.User;
import com.mindmate.domain.UserBadge;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserBadgeRepository extends JpaRepository<UserBadge, Long> {
  List<UserBadge> findByUser(User user);
  boolean existsByUserAndBadgeName(User user, String badgeName);
}
