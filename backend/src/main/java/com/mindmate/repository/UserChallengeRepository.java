package com.mindmate.repository;

import com.mindmate.domain.User;
import com.mindmate.domain.UserChallenge;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserChallengeRepository extends JpaRepository<UserChallenge, Long> {
  List<UserChallenge> findByUser(User user);
}
