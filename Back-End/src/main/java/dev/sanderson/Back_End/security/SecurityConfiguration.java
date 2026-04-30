package dev.sanderson.Back_End.security;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {

    private final TokenService tokenService;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .headers(headers -> headers.frameOptions(frame -> frame.disable()))
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth

                        // ── Swagger ───────────────────────────────────────────────────
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()

                        // ── Auth ──────────────────────────────────────────────────────
                        .requestMatchers(HttpMethod.POST, "/auth").permitAll()
                        .requestMatchers(HttpMethod.POST, "/auth/registrar").hasRole("ADMIN")

                        // ── Livro: GET público ─────────────────────────────────────────
                        .requestMatchers(HttpMethod.GET, "/livro/**").permitAll()

                        // ── Exemplar: GET para FUNCIONARIO/ADMIN, POST para ADMIN ──────
                        .requestMatchers(HttpMethod.GET, "/exemplar/**")
                        .hasAnyRole("FUNCIONARIO", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/exemplar/**")
                        .hasRole("ADMIN")

                        // ── Autor / Gênero / Catalogação: GET público, escrita só ADMIN ──
                        // GET público para que o autocomplete funcione sem login
                        .requestMatchers(HttpMethod.GET, "/autor/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/genero/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/catalogacao/**").permitAll()

                        // POST/PUT/DELETE dessas entidades só para ADMIN
                        .requestMatchers(HttpMethod.POST,   "/autor/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT,    "/autor/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/autor/**").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.POST,   "/genero/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT,    "/genero/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/genero/**").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.POST,   "/catalogacao/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT,    "/catalogacao/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/catalogacao/**").hasRole("ADMIN")

                        // ── Livro: escrita só para ADMIN ──────────────────────────────
                        .requestMatchers(HttpMethod.POST,   "/livro/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT,    "/livro/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/livro/**").hasRole("ADMIN")

                        // ── Minha conta: qualquer role autenticada ────────────────────
                        // DEVE vir ANTES de /emprestimo/**
                        .requestMatchers(HttpMethod.GET, "/emprestimo/minha-conta/**")
                        .hasAnyRole("ALUNO", "FUNCIONARIO", "ADMIN")

                        // Trocar senha :
                        .requestMatchers(HttpMethod.POST, "/user/me/trocar-senha")
                        .hasRole("ALUNO")

                        // ── Solicitações: POST — aluno solicita renovação ─────────────
                        .requestMatchers(HttpMethod.POST, "/solicitacoes-renovacao/**")
                        .hasAnyRole("ALUNO", "FUNCIONARIO", "ADMIN")

                        // ── Solicitações: GET e PUT — funcionário gerencia ────────────
                        .requestMatchers(HttpMethod.GET, "/solicitacoes-renovacao/**")
                        .hasAnyRole("FUNCIONARIO", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/solicitacoes-renovacao/**")
                        .hasAnyRole("FUNCIONARIO", "ADMIN")

                        // ── Reservas: qualquer autenticado ────────────────────────────
                        .requestMatchers("/reserva/**")
                        .hasAnyRole("ALUNO", "FUNCIONARIO", "ADMIN")

                        // ── Empréstimos e usuários: FUNCIONARIO/ADMIN ─────────────────
                        .requestMatchers("/emprestimo/**", "/user/**")
                        .hasAnyRole("FUNCIONARIO", "ADMIN")

                        // ── Admin ─────────────────────────────────────────────────────
                        .requestMatchers("/admin/**").hasRole("ADMIN")

                        .anyRequest().authenticated()
                );

        http.addFilterBefore(
                new TokenAuthenticationFilter(tokenService),
                UsernamePasswordAuthenticationFilter.class
        );

        return http.build();
    }

    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return (web) -> web.ignoring()
                .requestMatchers(PathRequest.toStaticResources().atCommonLocations())
                .requestMatchers("/swagger-resources/**", "/swagger-ui/**", "/v3/api-docs/**");
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins(
                                "http://localhost:3000",
                                "https://biblioteca-monsa.vercel.app"
                        )
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true)
                        .exposedHeaders("Authorization");
            }
        };
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}