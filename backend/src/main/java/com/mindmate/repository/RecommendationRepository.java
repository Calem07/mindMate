package com.mindmate.repository;

import com.mindmate.domain.Recommendation;
import com.mindmate.domain.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecommendationRepository extends JpaRepository<Recommendation, Long> {
  List<Recommendation> findByUserOrderByCreatedAtDesc(User user);
}
