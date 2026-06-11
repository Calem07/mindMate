package com.mindmate.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "badges")
public class Badge {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "badge_name", nullable = false, unique = true, length = 100)
  private String name;

  @Column(name = "description", nullable = false, length = 255)
  private String description;

  @Column(name = "xp_reward", nullable = false)
  private int xpReward;

  @Column(name = "rarity", nullable = false, length = 50)
  private String rarity;

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getName() { return name; }
  public void setName(String name) { this.name = name; }

  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }

  public int getXpReward() { return xpReward; }
  public void setXpReward(int xpReward) { this.xpReward = xpReward; }

  public String getRarity() { return rarity; }
  public void setRarity(String rarity) { this.rarity = rarity; }
}
