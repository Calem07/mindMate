package com.mindmate.repository;

import com.mindmate.domain.FutureMeLetter;
import com.mindmate.domain.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FutureMeLetterRepository extends JpaRepository<FutureMeLetter, Long> {
  List<FutureMeLetter> findByUser(User user);
}
