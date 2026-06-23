package com.mindmate.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

import com.mindmate.config.JwtService;
import com.mindmate.domain.User;
import com.mindmate.dto.AuthDtos.RegisterRequest;
import com.mindmate.repository.PasswordResetTokenRepository;
import com.mindmate.repository.UserRepository;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

class AuthServiceTest {
  private UserRepository users;
  private AuthService service;

  @BeforeEach
  void setUp() {
    users = mock(UserRepository.class);
    PasswordResetTokenRepository resetTokens = mock(PasswordResetTokenRepository.class);
    service = new AuthService(
        users,
        resetTokens,
        new BCryptPasswordEncoder(),
        new JwtService("local-test-secret-local-test-secret-local-test-secret")
    );
  }

  @Test
  void registerNormalizesEmailAndInitializesGrowthDefaults() {
    when(users.findByEmail("student@example.com")).thenReturn(Optional.empty());
    when(users.save(any(User.class))).thenAnswer(invocation -> {
      User user = invocation.getArgument(0);
      user.setLevel(user.getLevel());
      return user;
    });

    service.register(new RegisterRequest(" New Student ", " Student@Example.COM ", "CodexTest123!"));

    ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
    verify(users).save(captor.capture());
    User saved = captor.getValue();
    assertThat(saved.getName()).isEqualTo("New Student");
    assertThat(saved.getEmail()).isEqualTo("student@example.com");
    assertThat(saved.getXp()).isZero();
    assertThat(saved.getLevel()).isEqualTo(1);
    assertThat(saved.getCurrentStreak()).isZero();
    assertThat(saved.getLongestStreak()).isZero();
    assertThat(saved.getGardenTheme()).isEqualTo("CLASSIC");
    assertThat(saved.getPetXp()).isZero();
    assertThat(saved.isHasSelectedCompanion()).isFalse();
  }

  @Test
  void registerExistingEmailReturnsDomainErrorBeforeSave() {
    when(users.findByEmail("student@example.com")).thenReturn(Optional.of(new User()));

    assertThatThrownBy(() ->
        service.register(new RegisterRequest("Student", " Student@Example.COM ", "CodexTest123!"))
    ).isInstanceOf(IllegalArgumentException.class)
        .hasMessage("Email is already registered");
    verify(users, never()).save(any());
  }
}
