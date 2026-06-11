package com.mindmate.domain;

import com.mindmate.domain.Enums.Sender;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "chat_messages")
public class ChatMessage {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @ManyToOne(optional = false) private ChatSession session;
  @ManyToOne(optional = false) private User user;
  @Enumerated(EnumType.STRING) private Sender sender;
  @Column(columnDefinition = "text") private String content;
  private Instant createdAt = Instant.now();

  public Long getId() { return id; }
  public ChatSession getSession() { return session; }
  public void setSession(ChatSession session) { this.session = session; }
  public User getUser() { return user; }
  public void setUser(User user) { this.user = user; }
  public Sender getSender() { return sender; }
  public void setSender(Sender sender) { this.sender = sender; }
  public String getContent() { return content; }
  public void setContent(String content) { this.content = content; }
  public Instant getCreatedAt() { return createdAt; }
}
