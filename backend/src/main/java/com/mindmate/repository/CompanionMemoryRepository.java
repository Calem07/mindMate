package com.mindmate.repository;

import com.mindmate.domain.CompanionMemory;
import com.mindmate.domain.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanionMemoryRepository extends JpaRepository<CompanionMemory, Long> {
  List<CompanionMemory> findByUserOrderByCreatedAtDesc(User user);
  List<CompanionMemory> findTop5ByUserOrderByCreatedAtDesc(User user);
}
