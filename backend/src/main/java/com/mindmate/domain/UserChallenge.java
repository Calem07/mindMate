package com.mindmate.domain;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "user_challenges")
public class UserChallenge {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @Column(name = "challenge_name", nullable = false, length = 160)
  private String challengeName;

  @Column(name = "challenge_type", nullable = false, length = 100)
  private String challengeType;

  @Column(nullable = false)
  private int progress;

  @Column(nullable = false)
  private int target;

  @Column(nullable = false)
  private boolean completed;

  @Column(name = "reward_xp", nullable = false)
  private int rewardXp;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt = Instant.now();

  public Long getId() { return id; }
  public User getUser() { return user; }
  public void setUser(User user) { this.user = user; }
  public String getChallengeName() { return challengeName; }
  public void setChallengeName(String challengeName) { this.challengeName = challengeName; }
  public String getChallengeType() { return challengeType; }
  public void setChallengeType(String challengeType) { this.challengeType = challengeType; }
  public int getProgress() { return progress; }
  public void setProgress(int progress) { this.progress = progress; }
  public int getTarget() { return target; }
  public void setTarget(int target) { this.target = target; }
  public boolean isCompleted() { return completed; }
  public void setCompleted(boolean completed) { this.completed = completed; }
  public int getRewardXp() { return rewardXp; }
  public void setRewardXp(int rewardXp) { this.rewardXp = rewardXp; }
  public Instant getCreatedAt() { return createdAt; }
  public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
