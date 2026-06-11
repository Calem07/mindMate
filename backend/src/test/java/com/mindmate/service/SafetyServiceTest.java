package com.mindmate.service;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class SafetyServiceTest {
  private final SafetyService safety = new SafetyService();

  @Test
  void detectsCrisisPhrase() {
    assertThat(safety.crisisPhrase("I feel hopeless about everything")).contains("hopeless");
  }

  @Test
  void ignoresOrdinaryStudyStress() {
    assertThat(safety.crisisPhrase("I am stressed about exams")).isEmpty();
  }

  @Test
  void crisisReplyAvoidsMedicalClaims() {
    assertThat(safety.crisisReply())
        .contains("local emergency services")
        .contains("cannot provide medical advice");
  }
}
