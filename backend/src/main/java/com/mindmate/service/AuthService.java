package com.mindmate.service;

import com.mindmate.config.JwtService;
import com.mindmate.controller.UnauthorizedException;
import com.mindmate.domain.PasswordResetToken;
import com.mindmate.domain.User;
import com.mindmate.dto.AuthDtos.*;
import com.mindmate.repository.PasswordResetTokenRepository;
import com.mindmate.repository.UserRepository;
import java.time.Instant;
import java.util.UUID;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
  private final UserRepository users;
  private final PasswordResetTokenRepository resetTokens;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;

  public AuthService(UserRepository users, PasswordResetTokenRepository resetTokens, PasswordEncoder passwordEncoder, JwtService jwtService) {
    this.users = users;
    this.resetTokens = resetTokens;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
  }

  public AuthResponse register(RegisterRequest request) {
    users.findByEmail(request.email()).ifPresent(user -> { throw new IllegalArgumentException("Email is already registered"); });
    var user = new User();
    user.setName(request.name());
    user.setEmail(request.email().toLowerCase());
    user.setPasswordHash(passwordEncoder.encode(request.password()));
    users.save(user);
    return authResponse(user);
  }

  public AuthResponse login(LoginRequest request) {
    var user = users.findByEmail(request.email().toLowerCase())
        .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));
    if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
      throw new UnauthorizedException("Invalid credentials");
    }
    return authResponse(user);
  }

  public ForgotPasswordResponse forgotPassword(ForgotPasswordRequest request) {
    var user = users.findByEmail(request.email().toLowerCase()).orElse(null);
    if (user != null) {
      var token = new PasswordResetToken();
      token.setUser(user);
      token.setToken(UUID.randomUUID().toString());
      token.setExpiresAt(Instant.now().plusSeconds(60 * 30));
      resetTokens.save(token);
    }
    return new ForgotPasswordResponse("If that account exists, a reset token was created.");
  }

  public void resetPassword(ResetPasswordRequest request) {
    var token = resetTokens.findByToken(request.token()).orElseThrow();
    if (token.isUsed() || token.getExpiresAt().isBefore(Instant.now())) throw new IllegalArgumentException("Token expired");
    token.getUser().setPasswordHash(passwordEncoder.encode(request.newPassword()));
    token.setUsed(true);
    resetTokens.save(token);
    users.save(token.getUser());
  }

  private AuthResponse authResponse(User user) {
    var jwt = jwtService.createToken(user.getEmail(), user.getRole().name());
    return new AuthResponse(jwt, user.getId(), user.getName(), user.getEmail(), user.getRole());
  }
}
