package com.mindmate.observability;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class SentryHooks {
  private static final Logger log = LoggerFactory.getLogger(SentryHooks.class);

  private final boolean configured;

  public SentryHooks(@Value("${mindmate.sentry-dsn:}") String dsn) {
    this.configured = dsn != null && !dsn.isBlank();
    if (!configured) {
      log.info("Sentry DSN not configured; backend error reporting hook is inactive.");
    }
  }

  public void captureException(Throwable throwable) {
    if (!configured || throwable == null) {
      return;
    }
    // Hook point for sentry-spring-boot-starter when the dependency is enabled.
    log.debug("Sentry backend hook captured exception type {}", throwable.getClass().getName());
  }
}
