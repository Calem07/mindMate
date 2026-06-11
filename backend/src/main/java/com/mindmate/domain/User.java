package com.mindmate.domain;

import com.mindmate.domain.Enums.Role;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "users")
public class User {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private String name;
  @Column(unique = true, nullable = false)
  private String email;
  @Column(nullable = false)
  private String passwordHash;
  @Enumerated(EnumType.STRING)
  private Role role = Role.STUDENT;
  private boolean moderationConsent;
  private Instant moderationConsentAt;
  private Instant createdAt = Instant.now();

  private int xp;
  private int level = 1;
  private int currentStreak;
  private int longestStreak;
  private java.time.LocalDate lastActivityDate;
  private String gardenTheme = "CLASSIC";

  private String petType;
  private String petName;
  private int petXp = 0;
  private String petTheme;
  private String petAccessory;
  private Instant petCreatedAt;
  private boolean hasSelectedCompanion = false;

  public Long getId() { return id; }
  public String getName() { return name; }
  public void setName(String name) { this.name = name; }
  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }
  public String getPasswordHash() { return passwordHash; }
  public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
  public Role getRole() { return role; }
  public void setRole(Role role) { this.role = role; }
  public boolean isModerationConsent() { return moderationConsent; }
  public void setModerationConsent(boolean moderationConsent) { this.moderationConsent = moderationConsent; }
  public Instant getModerationConsentAt() { return moderationConsentAt; }
  public void setModerationConsentAt(Instant moderationConsentAt) { this.moderationConsentAt = moderationConsentAt; }
  public Instant getCreatedAt() { return createdAt; }

  public int getXp() { return xp; }
  public void setXp(int xp) { this.xp = xp; }
  public int getLevel() { return level; }
  public void setLevel(int level) { this.level = level; }
  public int getCurrentStreak() { return currentStreak; }
  public void setCurrentStreak(int currentStreak) { this.currentStreak = currentStreak; }
  public int getLongestStreak() { return longestStreak; }
  public void setLongestStreak(int longestStreak) { this.longestStreak = longestStreak; }
  public java.time.LocalDate getLastActivityDate() { return lastActivityDate; }
  public void setLastActivityDate(java.time.LocalDate lastActivityDate) { this.lastActivityDate = lastActivityDate; }
  public String getGardenTheme() { return gardenTheme; }
  public void setGardenTheme(String gardenTheme) { this.gardenTheme = gardenTheme; }

  public String getPetType() { return petType; }
  public void setPetType(String petType) { this.petType = petType; }
  public String getPetName() { return petName; }
  public void setPetName(String petName) { this.petName = petName; }
  public int getPetXp() { return petXp; }
  public void setPetXp(int petXp) { this.petXp = petXp; }
  public String getPetTheme() { return petTheme; }
  public void setPetTheme(String petTheme) { this.petTheme = petTheme; }
  public String getPetAccessory() { return petAccessory; }
  public void setPetAccessory(String petAccessory) { this.petAccessory = petAccessory; }
  public Instant getPetCreatedAt() { return petCreatedAt; }
  public void setPetCreatedAt(Instant petCreatedAt) { this.petCreatedAt = petCreatedAt; }
  public boolean isHasSelectedCompanion() { return hasSelectedCompanion; }
  public void setHasSelectedCompanion(boolean hasSelectedCompanion) { this.hasSelectedCompanion = hasSelectedCompanion; }
}
