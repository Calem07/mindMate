package com.mindmate.service;

import com.mindmate.domain.User;
import com.mindmate.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class CurrentUserService {
  private final UserRepository users;

  public CurrentUserService(UserRepository users) {
    this.users = users;
  }

  public User get() {
    var email = SecurityContextHolder.getContext().getAuthentication().getName();
    return users.findByEmail(email).orElseThrow();
  }
}
