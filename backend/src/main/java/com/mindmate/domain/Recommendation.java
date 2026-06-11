package com.mindmate.domain;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "recommendations")
public class Recommendation {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @ManyToOne(optional = false) private User user;
  @Column(columnDefinition = "text") private String content;
  private String source;
  private Instant createdAt = Instant.now();

  public Long getId() { return id; }
  public User getUser() { return user; }
  public void setUser(User user) { this.user = user; }
  public String getContent() { return content; }
  public void setContent(String content) { this.content = content; }
  public String getSource() { return source; }
  public void setSource(String source) { this.source = source; }
  public Instant getCreatedAt() { return createdAt; }
}
