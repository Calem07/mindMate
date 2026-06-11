package com.mindmate.repository;

import com.mindmate.domain.ChatSession;
import com.mindmate.domain.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatSessionRepository extends JpaRepository<ChatSession, Long> {
  Optional<ChatSession> findFirstByUserOrderByCreatedAtDesc(User user);
}
