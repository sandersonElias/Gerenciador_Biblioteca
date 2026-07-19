package dev.sanderson.Back_End.security;

import dev.sanderson.Back_End.entity.Roles;
import dev.sanderson.Back_End.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import static org.junit.jupiter.api.Assertions.*;

class TokenServiceTest {

    private TokenService tokenService;

    @BeforeEach
    void setUp() {
        tokenService = new TokenService();
        // Set private fields via reflection for testing
        try {
            var expirationField = TokenService.class.getDeclaredField("expiration");
            expirationField.setAccessible(true);
            expirationField.set(tokenService, "86400000");

            var secretField = TokenService.class.getDeclaredField("secret");
            secretField.setAccessible(true);
            // Base64-encoded secret for HS256 (at least 256 bits / 32 bytes)
            secretField.set(tokenService, "dGVzdC1zZWNyZXQtZm9yLXVuaXQtdGVzdHMtb25seS1taW4tMzItY2hhcnM=");
        } catch (Exception e) {
            throw new RuntimeException("Failed to set up TokenService", e);
        }
    }

    @Test
    void generateToken_shouldReturnJwtToken() {
        // Arrange
        User user = createTestUser("test@example.com", "ROLE_ALUNO");

        // Act
        String token = tokenService.generateToken(user);

        // Assert
        assertNotNull(token);
        assertTrue(token.length() > 0);
        // Token should be a valid JWT (three parts separated by dots)
        assertTrue(token.contains("."));
        String[] parts = token.split("\\.");
        assertEquals(3, parts.length);
    }

    @Test
    void isValid_shouldReturnAuthenticationForValidToken() {
        // Arrange
        User user = createTestUser("test@example.com", "ROLE_ALUNO");
        String token = tokenService.generateToken(user);

        // Act
        UsernamePasswordAuthenticationToken auth = tokenService.isValid(token);

        // Assert
        assertNotNull(auth);
        assertEquals("test@example.com", auth.getPrincipal());
        assertNull(auth.getCredentials());
        assertNotNull(auth.getAuthorities());
        assertEquals(1, auth.getAuthorities().size());
        assertTrue(auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ALUNO")));
    }

    @Test
    void isValid_shouldReturnNullForNullToken() {
        // Act
        UsernamePasswordAuthenticationToken auth = tokenService.isValid(null);

        // Assert
        assertNull(auth);
    }

    @Test
    void isValid_shouldThrowForInvalidToken() {
        // Act & Assert
        assertThrows(Exception.class, () -> tokenService.isValid("invalid-token"));
    }

    @Test
    void generateToken_shouldIncludeEmailInClaims() {
        // Arrange
        User user = createTestUser("user@domain.com", "ROLE_FUNCIONARIO");

        // Act
        String token = tokenService.generateToken(user);

        // Assert - token should be valid and contain the email
        UsernamePasswordAuthenticationToken auth = tokenService.isValid(token);
        assertEquals("user@domain.com", auth.getPrincipal());
    }

    private User createTestUser(String email, String role) {
        User user = new User();
        user.setId(1L);
        user.setEmail(email);
        user.setName("Test User");

        Roles roles = new Roles();
        roles.setRole(role);
        user.setRole(roles);

        return user;
    }
}