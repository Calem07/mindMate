package com.mindmate.domain;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "user_badges")
public class UserBadge {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @Column(name = "badge_name", nullable = false, length = 100)
  private String badgeName;

  @Column(name = "earned_at", nullable = false)
  private Instant earnedAt = Instant.now();

  public Long getId() { return id; }
  public User getUser() { return user; }
  public void setUser(User user) { this.user = user; }
  public String getBadgeName() { return badgeName; }
  public void setBadgeName(String badgeName) { this.badgeName = badgeName; }
  public Instant getEarnedAt() { return earnedAt; }
  public void setEarnedAt(Instant earnedAt) { this.earnedAt = earnedAt; }
}
