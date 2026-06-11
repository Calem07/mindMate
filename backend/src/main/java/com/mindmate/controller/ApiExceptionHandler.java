package com.mindmate.controller;

import com.mindmate.observability.SentryHooks;
import java.util.Map;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
public class ApiExceptionHandler {
  private final SentryHooks sentry;

  public ApiExceptionHandler(SentryHooks sentry) {
    this.sentry = sentry;
  }

  @ExceptionHandler({UnauthorizedException.class})
  ResponseEntity<Map<String, String>> unauthorized(RuntimeException ex) {
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", ex.getMessage()));
  }

  @ExceptionHandler({MethodArgumentNotValidException.class, ConstraintViolationException.class})
  ResponseEntity<Map<String, String>> validation(Exception ex) {
    return ResponseEntity.badRequest().body(Map.of("error", "Validation failed"));
  }

  @ExceptionHandler({IllegalArgumentException.class})
  ResponseEntity<Map<String, String>> badRequest(RuntimeException ex) {
    return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
  }

  @ExceptionHandler({RuntimeException.class})
  ResponseEntity<Map<String, String>> serverError(RuntimeException ex) {
    sentry.captureException(ex);
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Unexpected server error"));
  }
}
