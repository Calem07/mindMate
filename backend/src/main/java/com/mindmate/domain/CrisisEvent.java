package com.mindmate.domain;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "crisis_events")
public class CrisisEvent {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @ManyToOne(optional = false) private User user;
  private String triggerPhrase;
  @Column(columnDefinition = "text") private String sourceText;
  private Instant createdAt = Instant.now();

  public Long getId() { return id; }
  public User getUser() { return user; }
  public void setUser(User user) { this.user = user; }
  public String getTriggerPhrase() { return triggerPhrase; }
  public void setTriggerPhrase(String triggerPhrase) { this.triggerPhrase = triggerPhrase; }
  public String getSourceText() { return sourceText; }
  public void setSourceText(String sourceText) { this.sourceText = sourceText; }
  public Instant getCreatedAt() { return createdAt; }
}
