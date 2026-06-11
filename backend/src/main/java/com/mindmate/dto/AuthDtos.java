package com.mindmate.dto;

import com.mindmate.domain.Enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public final class AuthDtos {
  private AuthDtos() {}

  public record RegisterRequest(@NotBlank @Size(max = 160) String name, @NotBlank @Email @Size(max = 220) String email, @NotBlank @Size(min = 8, max = 128) String password) {}
  public record LoginRequest(@NotBlank @Email @Size(max = 220) String email, @NotBlank @Size(max = 128) String password) {}
  public record AuthResponse(String token, Long id, String name, String email, Role role) {}
  public record ForgotPasswordRequest(@NotBlank @Email @Size(max = 220) String email) {}
  public record ForgotPasswordResponse(String message) {}
  public record ResetPasswordRequest(@NotBlank @Size(max = 120) String token, @NotBlank @Size(min = 8, max = 128) String newPassword) {}
}
