package dev.sanderson.Back_End.security;

import dev.sanderson.Back_End.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TokenService {

    private static final String TOKEN_PREFIX = "Bearer";
    private static final String ROLES_CLAIM  = "roles";
    private static final String EMAIL_CLAIM  = "email";

    @Value("${jwt.expiration}")
    private String expiration;

    @Value("${jwt.secret}")
    private String secret;

    public String generateToken(User user) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + Long.parseLong(expiration));

        // O banco já armazena a role com prefixo ROLE_ (ex: "ROLE_ALUNO")
        // NÃO adicionar prefixo novamente para evitar "ROLE_ROLE_ALUNO"
        String role = user.getRole().getRole();

        return TOKEN_PREFIX + " " +
                Jwts.builder()
                        .setIssuer("biblioteca-api")
                        .claim(EMAIL_CLAIM, user.getEmail())        // email como principal
                        .claim(Claims.ID, user.getId().toString())  // id mantido para referência
                        .claim(ROLES_CLAIM, List.of(role))
                        .setIssuedAt(now)
                        .setExpiration(exp)
                        .signWith(SignatureAlgorithm.HS256, secret)
                        .compact();
    }

    public UsernamePasswordAuthenticationToken isValid(String token) {
        if (token == null) return null;

        Claims body = Jwts.parser()
                .setSigningKey(secret)
                .parseClaimsJws(token.replace(TOKEN_PREFIX, "").trim())
                .getBody();

        // Usa o email como principal — necessário para /minha-conta/{email}
        String email = body.get(EMAIL_CLAIM, String.class);
        if (email == null) return null;

        List<String> cargos = body.get(ROLES_CLAIM, List.class);
        List<SimpleGrantedAuthority> authorities = cargos.stream()
                .map(SimpleGrantedAuthority::new)
                .toList();

        return new UsernamePasswordAuthenticationToken(email, null, authorities);
    }
}