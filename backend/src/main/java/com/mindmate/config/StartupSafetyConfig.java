package com.mindmate.config;

import com.mindmate.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class StartupSafetyConfig implements ApplicationRunner {
  private static final Logger log = LoggerFactory.getLogger(StartupSafetyConfig.class);
  private static final String DEFAULT_JWT_SECRET = "change-this-development-secret-change-this-development-secret";

  private final String appEnv;
  private final String jwtSecret;
  private final boolean allowDemoUsers;
  private final UserRepository users;

  public StartupSafetyConfig(
      @Value("${mindmate.app-env:dev}") String appEnv,
      @Value("${mindmate.jwt-secret}") String jwtSecret,
      @Value("${mindmate.allow-demo-users:false}") boolean allowDemoUsers,
      UserRepository users) {
    this.appEnv = appEnv;
    this.jwtSecret = jwtSecret;
    this.allowDemoUsers = allowDemoUsers;
    this.users = users;
  }

  @Override
  public void run(ApplicationArguments args) {
    if (isDev()) {
      return;
    }

    if (DEFAULT_JWT_SECRET.equals(jwtSecret)) {
      throw new IllegalStateException("Refusing to start outside dev with the default JWT_SECRET.");
    }
    if (hasDemoUsers()) {
      if (allowDemoUsers) {
        log.warn("ALLOW_DEMO_USERS=true: starting outside dev with demo seed users present. Use only for controlled closed beta deployments and remove demo credentials before production.");
      } else {
        throw new IllegalStateException("Refusing to start outside dev with demo seed users present.");
      }
    }
  }

  private boolean hasDemoUsers() {
    return users.findByEmail("student@mindmate.local").isPresent()
        || users.findByEmail("admin@mindmate.local").isPresent();
  }

  private boolean isDev() {
    return appEnv == null || appEnv.isBlank() || "dev".equalsIgnoreCase(appEnv) || "local".equalsIgnoreCase(appEnv);
  }
}
