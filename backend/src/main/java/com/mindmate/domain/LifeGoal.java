package com.mindmate.domain;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.Instant;

@Entity
@Table(name = "life_goals")
public class LifeGoal {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @Column(nullable = false, length = 50)
  private String category; // ACADEMIC, FITNESS, PERSONAL_DEVELOPMENT, CAREER_PREPARATION, SKILL_DEVELOPMENT

  @Column(nullable = false, length = 220)
  private String title;

  @Column(name = "target_date")
  private LocalDate targetDate;

  @Column(name = "progress_percent", nullable = false)
  private int progressPercent;

  @Column(nullable = false)
  private boolean completed;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt = Instant.now();

  public Long getId() { return id; }
  public User getUser() { return user; }
  public void setUser(User user) { this.user = user; }
  public String getCategory() { return category; }
  public void setCategory(String category) { this.category = category; }
  public String getTitle() { return title; }
  public void setTitle(String title) { this.title = title; }
  public LocalDate getTargetDate() { return targetDate; }
  public void setTargetDate(LocalDate targetDate) { this.targetDate = targetDate; }
  public int getProgressPercent() { return progressPercent; }
  public void setProgressPercent(int progressPercent) { this.progressPercent = progressPercent; }
  public boolean isCompleted() { return completed; }
  public void setCompleted(boolean completed) { this.completed = completed; }
  public Instant getCreatedAt() { return createdAt; }
  public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
