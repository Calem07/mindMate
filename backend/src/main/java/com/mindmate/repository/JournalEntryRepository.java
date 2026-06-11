package com.mindmate.repository;

import com.mindmate.domain.JournalEntry;
import com.mindmate.domain.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JournalEntryRepository extends JpaRepository<JournalEntry, Long> {
  List<JournalEntry> findByUserOrderByCreatedAtDesc(User user);
}
