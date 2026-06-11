package com.mindmate.domain;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "exam_events")
public class ExamEvent {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @Column(nullable = false, length = 160)
  private String subject;

  @Column(name = "exam_date", nullable = false)
  private Instant examDate;

  @Column(name = "study_minutes", nullable = false)
  private int studyMinutes;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt = Instant.now();

  public Long getId() { return id; }
  public User getUser() { return user; }
  public void setUser(User user) { this.user = user; }
  public String getSubject() { return subject; }
  public void setSubject(String subject) { this.subject = subject; }
  public Instant getExamDate() { return examDate; }
  public void setExamDate(Instant examDate) { this.examDate = examDate; }
  public int getStudyMinutes() { return studyMinutes; }
  public void setStudyMinutes(int studyMinutes) { this.studyMinutes = studyMinutes; }
  public Instant getCreatedAt() { return createdAt; }
  public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
