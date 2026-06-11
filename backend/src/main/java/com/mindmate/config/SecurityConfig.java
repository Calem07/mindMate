package com.mindmate.config;

import com.mindmate.repository.UserRepository;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.Arrays;
import java.util.Base64;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.OncePerRequestFilter;

@Configuration
public class SecurityConfig {
  @Bean
  SecurityFilterChain security(HttpSecurity http, JwtAuthFilter jwtAuthFilter) throws Exception {
    return http.csrf(csrf -> csrf.disable())
        .cors(cors -> {})
        .httpBasic(AbstractHttpConfigurer::disable)
        .formLogin(AbstractHttpConfigurer::disable)
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/auth/**", "/actuator/health", "/actuator/health/**").permitAll()
            .requestMatchers("/api/admin/**").hasRole("ADMIN")
            .anyRequest().authenticated())
        .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
        .build();
  }

  @Bean
  PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  UserDetailsService userDetailsService() {
    return username -> {
      throw new UsernameNotFoundException("Password authentication is disabled.");
    };
  }

  @Bean
  CorsConfigurationSource corsConfigurationSource(@Value("${mindmate.allowed-origins:http://localhost:*,http://127.0.0.1:*}") String allowedOrigins) {
    var config = new CorsConfiguration();
    config.setAllowedOriginPatterns(Arrays.stream(allowedOrigins.split(","))
        .map(String::trim)
        .filter(origin -> !origin.isBlank())
        .toList());
    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    config.setAllowedHeaders(List.of("*"));
    var source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return source;
  }
}

@Component
class JwtAuthFilter extends OncePerRequestFilter {
  private final JwtService jwtService;
  private final UserRepository users;

  JwtAuthFilter(JwtService jwtService, UserRepository users) {
    this.jwtService = jwtService;
    this.users = users;
  }

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {
    var header = request.getHeader("Authorization");
    if (header != null && header.startsWith("Bearer ")) {
      try {
        var token = header.substring(7);
        users.findByEmail(jwtService.subject(token)).ifPresent(user -> {
          var authorities = List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
          var auth = new UsernamePasswordAuthenticationToken(user.getEmail(), null, authorities);
          SecurityContextHolder.getContext().setAuthentication(auth);
        });
      } catch (JwtException | IllegalArgumentException ex) {
        SecurityContextHolder.clearContext();
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.getWriter().write("{\"error\":\"Invalid or expired token\"}");
        return;
      }
    }
    filterChain.doFilter(request, response);
  }
}

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
class RequestCorrelationFilter extends OncePerRequestFilter {
  static final String HEADER = "X-Request-ID";

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {
    String requestId = request.getHeader(HEADER);
    if (requestId == null || requestId.isBlank() || requestId.length() > 80) {
      requestId = UUID.randomUUID().toString();
    }
    MDC.put("requestId", requestId);
    response.setHeader(HEADER, requestId);
    try {
      filterChain.doFilter(request, response);
    } finally {
      MDC.remove("requestId");
    }
  }
}

@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 1)
class RateLimitFilter extends OncePerRequestFilter {
  private static final List<Rule> RULES = List.of(
      new Rule("POST", "/api/auth/login", 10, 60),
      new Rule("POST", "/api/auth/forgot-password", 5, 300),
      new Rule("POST", "/api/chat", 30, 60),
      new Rule("GET", "/api/reflections/weekly", 10, 300),
      new Rule("GET", "/api/future-me/generate", 10, 300)
  );

  private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {
    Rule rule = match(request);
    if (rule == null || "OPTIONS".equalsIgnoreCase(request.getMethod())) {
      filterChain.doFilter(request, response);
      return;
    }

    String key = rule.method() + ":" + rule.path() + ":" + clientKey(request);
    long now = Instant.now().getEpochSecond();
    Bucket bucket = buckets.compute(key, (ignored, existing) -> {
      if (existing == null || now >= existing.resetAt()) {
        return new Bucket(1, now + rule.windowSeconds());
      }
      return new Bucket(existing.count() + 1, existing.resetAt());
    });

    if (bucket.count() > rule.maxRequests()) {
      response.setStatus(429);
      response.setContentType("application/json");
      response.setHeader("Retry-After", String.valueOf(Math.max(1, bucket.resetAt() - now)));
      response.getWriter().write("{\"error\":\"Too many requests. Please try again later.\"}");
      return;
    }

    filterChain.doFilter(request, response);
  }

  private Rule match(HttpServletRequest request) {
    String method = request.getMethod().toUpperCase(Locale.ROOT);
    String path = request.getRequestURI();
    return RULES.stream()
        .filter(rule -> rule.method().equals(method) && rule.path().equals(path))
        .findFirst()
        .orElse(null);
  }

  private String clientKey(HttpServletRequest request) {
    String forwardedFor = request.getHeader("X-Forwarded-For");
    String ip = forwardedFor == null || forwardedFor.isBlank()
        ? request.getRemoteAddr()
        : forwardedFor.split(",")[0].trim();
    String auth = request.getHeader("Authorization");
    if (auth == null || auth.isBlank()) {
      return ip;
    }
    return ip + ":" + sha256(auth);
  }

  private String sha256(String value) {
    try {
      MessageDigest digest = MessageDigest.getInstance("SHA-256");
      return Base64.getUrlEncoder().withoutPadding()
          .encodeToString(digest.digest(value.getBytes(StandardCharsets.UTF_8)));
    } catch (Exception ex) {
      return "hash-unavailable";
    }
  }

  private record Rule(String method, String path, int maxRequests, long windowSeconds) {}
  private record Bucket(int count, long resetAt) {}
}
