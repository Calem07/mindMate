package com.mindmate.service;

import java.util.List;
import java.util.Locale;
import java.util.Optional;
import org.springframework.stereotype.Service;

@Service
public class SafetyService {
  private static final List<String> CRISIS_PHRASES = List.of(
      "hopeless", "want to disappear", "can't continue", "cant continue", "end everything");

  public Optional<String> crisisPhrase(String text) {
    var lower = text == null ? "" : text.toLowerCase(Locale.ROOT);
    return CRISIS_PHRASES.stream().filter(lower::contains).findFirst();
  }

  public String crisisReply() {
    return "I am really sorry you are feeling this much distress. Please contact someone you trust now, "
        + "and use local emergency services or professional support if you may be in danger. "
        + "I cannot provide medical advice, diagnosis, or treatment.";
  }

  public String systemPrompt() {
    return """
        You are MindMate, an empathetic wellness companion.
        Rules:
        - Never diagnose illnesses.
        - Never prescribe medication.
        - Never claim to be a therapist.
        - Encourage healthy habits.
        - Encourage professional support when necessary.
        - Be supportive and non-judgmental.
        """;
  }
}
