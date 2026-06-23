package com.mindmate.domain;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "daily_checkins")
public class DailyCheckin {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @Column(nullable = false)
  private String mood;

  @Column(name = "energy_level", nullable = false)
  private int energyLevel;

  @Column(name = "stress_level")
  private Integer stressLevel;

  @Column(name = "sleep_hours")
  private Double sleepHours;

  @Column(name = "sleep_quality")
  private Integer sleepQuality;

  @Column(name = "social_interaction")
  private Integer socialInteraction;

  @Column(name = "mood_trigger")
  private String moodTrigger;

  @Column(name = "wellness_score", nullable = false)
  private int wellnessScore;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt = Instant.now();

  public Long getId() { return id; }
  public User getUser() { return user; }
  public void setUser(User user) { this.user = user; }
  public String getMood() { return mood; }
  public void setMood(String mood) { this.mood = mood; }
  public int getEnergyLevel() { return energyLevel; }
  public void setEnergyLevel(int energyLevel) { this.energyLevel = energyLevel; }
  public Integer getStressLevel() { return stressLevel; }
  public void setStressLevel(Integer stressLevel) { this.stressLevel = stressLevel; }
  public Double getSleepHours() { return sleepHours; }
  public void setSleepHours(Double sleepHours) { this.sleepHours = sleepHours; }
  public Integer getSleepQuality() { return sleepQuality; }
  public void setSleepQuality(Integer sleepQuality) { this.sleepQuality = sleepQuality; }
  public Integer getSocialInteraction() { return socialInteraction; }
  public void setSocialInteraction(Integer socialInteraction) { this.socialInteraction = socialInteraction; }
  public String getMoodTrigger() { return moodTrigger; }
  public void setMoodTrigger(String moodTrigger) { this.moodTrigger = moodTrigger; }
  public int getWellnessScore() { return wellnessScore; }
  public void setWellnessScore(int wellnessScore) { this.wellnessScore = wellnessScore; }
  public Instant getCreatedAt() { return createdAt; }
  public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
