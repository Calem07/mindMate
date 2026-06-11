package com.mindmate.domain;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "chat_sessions")
public class ChatSession {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @ManyToOne(optional = false) private User user;
  private Instant createdAt = Instant.now();

  public Long getId() { return id; }
  public User getUser() { return user; }
  public void setUser(User user) { this.user = user; }
  public Instant getCreatedAt() { return createdAt; }
}
