package com.mindmate.service;

import com.mindmate.domain.Enums.Emotion;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class GeminiService {
  private static final Logger log = LoggerFactory.getLogger(GeminiService.class);
  private final WebClient webClient;
  private final String apiKey;
  private final String model;
  private final SafetyService safety;

  public GeminiService(WebClient.Builder builder, @Value("${mindmate.gemini-api-key}") String apiKey,
      @Value("${mindmate.gemini-model}") String model, SafetyService safety) {
    this.webClient = builder.baseUrl("https://generativelanguage.googleapis.com").build();
    this.apiKey = apiKey;
    this.model = model;
    this.safety = safety;
  }

  public String chat(String message) {
    return chat(message, "No recent logs recorded.", "");
  }

  public String chat(String message, String context) {
    return chat(message, context, "");
  }

  public String chat(String message, String context, String companionPrompt) {
    if (apiKey == null || apiKey.isBlank()) {
      return "I hear you. I can help you make this smaller: choose one next step, take a short pause, "
          + "and reach out to trusted support if this feels too heavy. I am not a therapist and cannot diagnose.";
    }
    try {
      String prompt = safety.systemPrompt();
      if (companionPrompt != null && !companionPrompt.isBlank()) {
        prompt = companionPrompt + "\n" + prompt;
      }
      var body = Map.of("contents", new Object[] {
          Map.of("parts", new Object[] { Map.of("text", prompt + "\nContext: " + context + "\nStudent message: " + message) })
      });
      var response = webClient.post()
          .uri("/v1beta/models/{model}:generateContent?key={key}", model, apiKey)
          .bodyValue(body)
          .retrieve()
          .bodyToMono(Map.class)
          .block();
      if (response != null && response.containsKey("candidates")) {
        var candidates = (List<?>) response.get("candidates");
        if (candidates != null && !candidates.isEmpty()) {
          var firstCandidate = (Map<?, ?>) candidates.get(0);
          if (firstCandidate != null && firstCandidate.containsKey("content")) {
            var content = (Map<?, ?>) firstCandidate.get("content");
            if (content != null && content.containsKey("parts")) {
              var parts = (List<?>) content.get("parts");
              if (parts != null && !parts.isEmpty()) {
                var firstPart = (Map<?, ?>) parts.get(0);
                if (firstPart != null && firstPart.containsKey("text")) {
                  return String.valueOf(firstPart.get("text"));
                }
              }
            }
          }
        }
      }
      return String.valueOf(response);
    } catch (RuntimeException ex) {
      log.warn("AI provider request failed: {}", ex.getMessage());
      return "I could not reach the AI provider, but I can still suggest a small reset: write one concern, "
          + "one controllable action, and one person you can contact if needed.";
    }
  }

  public Emotion classify(String text) {
    var lower = text == null ? "" : text.toLowerCase(Locale.ROOT);
    if (lower.contains("angry")) return Emotion.ANGRY;
    if (lower.contains("anxious") || lower.contains("nervous")) return Emotion.ANXIOUS;
    if (lower.contains("stress") || lower.contains("overwhelm")) return Emotion.STRESSED;
    if (lower.contains("sad") || lower.contains("low")) return Emotion.SAD;
    if (lower.contains("happy") || lower.contains("great")) return Emotion.HAPPY;
    return Emotion.NEUTRAL;
  }

  public String summarize(String content) {
    if (content == null || content.isBlank()) return "No journal content provided.";
    return "AI summary: " + content.substring(0, Math.min(120, content.length()));
  }

  public String keyConcerns(String content) {
    var emotion = classify(content);
    return "Primary signal: " + emotion.name().toLowerCase(Locale.ROOT) + "; suggested focus: one small next step.";
  }
}
