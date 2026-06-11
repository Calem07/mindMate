package com.mindmate.domain;

import com.mindmate.domain.Enums.MoodOption;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "moods")
public class Mood {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @ManyToOne(optional = false) private User user;
  @Enumerated(EnumType.STRING) private MoodOption mood;
  private Instant createdAt = Instant.now();

  public Long getId() { return id; }
  public User getUser() { return user; }
  public void setUser(User user) { this.user = user; }
  public MoodOption getMood() { return mood; }
  public void setMood(MoodOption mood) { this.mood = mood; }
  public Instant getCreatedAt() { return createdAt; }
}
