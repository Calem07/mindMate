package com.mindmate.domain;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.Instant;

@Entity
@Table(name = "future_me_letters")
public class FutureMeLetter {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @Column(nullable = false, columnDefinition = "text")
  private String content;

  @Column(name = "unlock_date", nullable = false)
  private LocalDate unlockDate;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt = Instant.now();

  public Long getId() { return id; }
  public User getUser() { return user; }
  public void setUser(User user) { this.user = user; }
  public String getContent() { return content; }
  public void setContent(String content) { this.content = content; }
  public LocalDate getUnlockDate() { return unlockDate; }
  public void setUnlockDate(LocalDate unlockDate) { this.unlockDate = unlockDate; }
  public Instant getCreatedAt() { return createdAt; }
  public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
