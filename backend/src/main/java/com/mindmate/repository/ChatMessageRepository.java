package com.mindmate.repository;

import com.mindmate.domain.ChatMessage;
import com.mindmate.domain.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
  List<ChatMessage> findByUserOrderByCreatedAtAsc(User user);
}
