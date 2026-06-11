package com.mindmate.domain;

import com.mindmate.domain.Enums.Emotion;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "emotion_logs")
public class EmotionLog {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @ManyToOne(optional = false) private User user;
  @Enumerated(EnumType.STRING) private Emotion emotion;
  private double confidenceScore;
  private Instant createdAt = Instant.now();

  public Long getId() { return id; }
  public User getUser() { return user; }
  public void setUser(User user) { this.user = user; }
  public Emotion getEmotion() { return emotion; }
  public void setEmotion(Emotion emotion) { this.emotion = emotion; }
  public double getConfidenceScore() { return confidenceScore; }
  public void setConfidenceScore(double confidenceScore) { this.confidenceScore = confidenceScore; }
  public Instant getCreatedAt() { return createdAt; }
}
