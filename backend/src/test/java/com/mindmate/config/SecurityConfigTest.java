package com.mindmate.config;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;

import com.mindmate.repository.UserRepository;
import jakarta.servlet.ServletException;
import java.io.IOException;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

class SecurityConfigTest {
  @Test
  void corsUsesExactConfiguredOrigins() {
    var source = new SecurityConfig().corsConfigurationSource(
        "http://127.0.0.1:5177,http://localhost:5177,https://mind-mate-tan-phi.vercel.app"
    );
    var request = new MockHttpServletRequest("OPTIONS", "/api/auth/login");
    request.addHeader("Origin", "http://127.0.0.1:5177");

    var config = source.getCorsConfiguration(request);

    assertThat(config).isNotNull();
    assertThat(config.getAllowedOrigins()).containsExactly(
        "http://127.0.0.1:5177",
        "http://localhost:5177",
        "https://mind-mate-tan-phi.vercel.app"
    );
    assertThat(config.getAllowedOriginPatterns()).isNull();
  }

  @Test
  void malformedJwtReturnsUnauthorized() throws ServletException, IOException {
    var filter = new JwtAuthFilter(
        new JwtService("local-test-secret-local-test-secret-local-test-secret"),
        mock(UserRepository.class)
    );
    var request = new MockHttpServletRequest("GET", "/api/habits");
    request.addHeader("Authorization", "Bearer not-a-valid-jwt");
    var response = new MockHttpServletResponse();

    filter.doFilterInternal(request, response, new MockFilterChain());

    assertThat(response.getStatus()).isEqualTo(401);
    assertThat(response.getContentAsString()).contains("Invalid or expired token");
  }
}
