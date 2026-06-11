package com.mindmate.domain;

import com.mindmate.domain.Enums.Emotion;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "journal_entries")
public class JournalEntry {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @ManyToOne(optional = false) private User user;
  private String title;
  @Column(columnDefinition = "text") private String content;
  @Column(columnDefinition = "text") private String summary;
  @Column(columnDefinition = "text") private String keyConcerns;
  @Enumerated(EnumType.STRING) private Emotion emotion = Emotion.NEUTRAL;
  private Instant createdAt = Instant.now();

  public Long getId() { return id; }
  public User getUser() { return user; }
  public void setUser(User user) { this.user = user; }
  public String getTitle() { return title; }
  public void setTitle(String title) { this.title = title; }
  public String getContent() { return content; }
  public void setContent(String content) { this.content = content; }
  public String getSummary() { return summary; }
  public void setSummary(String summary) { this.summary = summary; }
  public String getKeyConcerns() { return keyConcerns; }
  public void setKeyConcerns(String keyConcerns) { this.keyConcerns = keyConcerns; }
  public Emotion getEmotion() { return emotion; }
  public void setEmotion(Emotion emotion) { this.emotion = emotion; }
  public Instant getCreatedAt() { return createdAt; }
}
