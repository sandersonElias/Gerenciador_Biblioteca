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

import javax.management.relation.Role;
import java.util.*;

@Service
@RequiredArgsConstructor
public class TokenService {
    private static final String TOKEN_PREFIX = "Bearer";

    private static final String ROLES_CLAIM = "roles";

    @Value("${jwt.expiration}")
    private String expiration;

    @Value("${jwt.secret}")
    private String secret;


    public String generateToken(User user) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + Long.parseLong(expiration));

        List<String> roles = List.of(user.getRole().getRole());

        return TOKEN_PREFIX + " " +
                Jwts.builder()
                        .setIssuer("biblioteca-api")
                        .claim(Claims.ID, user.getId().toString())
                        .claim(ROLES_CLAIM, roles)
                        .setIssuedAt(now)
                        .setExpiration(exp)
                        .signWith(SignatureAlgorithm.HS256, secret)
                        .compact();
    }

    public UsernamePasswordAuthenticationToken isValid(String token) {
        if (token != null) {
            Claims body = Jwts.parser()
                    .setSigningKey(secret)
                    .parseClaimsJws(token.replace(TOKEN_PREFIX, ""))
                    .getBody();
            String user = body.get(Claims.ID, String.class);
            if (user != null) {
                List<String> cargos = body.get(ROLES_CLAIM, List.class);
                List<SimpleGrantedAuthority> authorities = cargos.stream()
                        .map(SimpleGrantedAuthority::new)
                        .toList();
                UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =
                        new UsernamePasswordAuthenticationToken(user, null, authorities);
                return usernamePasswordAuthenticationToken;
            }
        }
        return null;
    }
}
