package com.mindmate.repository;

import com.mindmate.domain.GratitudeJournal;
import com.mindmate.domain.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GratitudeJournalRepository extends JpaRepository<GratitudeJournal, Long> {
  List<GratitudeJournal> findByUserOrderByCreatedAtDesc(User user);
}
