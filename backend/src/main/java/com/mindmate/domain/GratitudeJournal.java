package com.mindmate.domain;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "gratitude_journals")
public class GratitudeJournal {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @Column(name = "happy_moment", nullable = false, columnDefinition = "text")
  private String happyMoment;

  @Column(name = "grateful_for", nullable = false, columnDefinition = "text")
  private String gratefulFor;

  @Column(name = "proud_achievement", nullable = false, columnDefinition = "text")
  private String proudAchievement;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt = Instant.now();

  public Long getId() { return id; }
  public User getUser() { return user; }
  public void setUser(User user) { this.user = user; }
  public String getHappyMoment() { return happyMoment; }
  public void setHappyMoment(String happyMoment) { this.happyMoment = happyMoment; }
  public String getGratefulFor() { return gratefulFor; }
  public void setGratefulFor(String gratefulFor) { this.gratefulFor = gratefulFor; }
  public String getProudAchievement() { return proudAchievement; }
  public void setProudAchievement(String proudAchievement) { this.proudAchievement = proudAchievement; }
  public Instant getCreatedAt() { return createdAt; }
  public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
