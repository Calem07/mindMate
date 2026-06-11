package com.mindmate.domain;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.Instant;

@Entity
@Table(name = "habit_logs", uniqueConstraints = {
  @UniqueConstraint(name = "unique_user_habit_date", columnNames = {"user_id", "habit_id", "completed_date"})
})
public class HabitLog {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "habit_id", nullable = false)
  private Habit habit;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @Column(name = "completed_date", nullable = false)
  private LocalDate completedDate;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt = Instant.now();

  public Long getId() { return id; }
  public Habit getHabit() { return habit; }
  public void setHabit(Habit habit) { this.habit = habit; }
  public User getUser() { return user; }
  public void setUser(User user) { this.user = user; }
  public LocalDate getCompletedDate() { return completedDate; }
  public void setCompletedDate(LocalDate completedDate) { this.completedDate = completedDate; }
  public Instant getCreatedAt() { return createdAt; }
  public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
