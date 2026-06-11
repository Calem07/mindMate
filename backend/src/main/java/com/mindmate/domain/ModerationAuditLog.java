package com.mindmate.domain;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "moderation_audit_logs")
public class ModerationAuditLog {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @ManyToOne(optional = false) private User adminUser;
  private String action;
  private Long targetUserId;
  private Instant createdAt = Instant.now();

  public Long getId() { return id; }
  public User getAdminUser() { return adminUser; }
  public void setAdminUser(User adminUser) { this.adminUser = adminUser; }
  public String getAction() { return action; }
  public void setAction(String action) { this.action = action; }
  public Long getTargetUserId() { return targetUserId; }
  public void setTargetUserId(Long targetUserId) { this.targetUserId = targetUserId; }
  public Instant getCreatedAt() { return createdAt; }
}
