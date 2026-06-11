package com.mindmate.repository;

import com.mindmate.domain.ExamEvent;
import com.mindmate.domain.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExamEventRepository extends JpaRepository<ExamEvent, Long> {
  List<ExamEvent> findByUserOrderByExamDateAsc(User user);
}
