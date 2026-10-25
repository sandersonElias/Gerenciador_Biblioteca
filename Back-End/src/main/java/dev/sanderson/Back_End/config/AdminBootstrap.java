package dev.sanderson.Back_End.config;

import dev.sanderson.Back_End.entity.Roles;
import dev.sanderson.Back_End.entity.User;
import dev.sanderson.Back_End.repository.RoleRepository;
import dev.sanderson.Back_End.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@Order(1)
@RequiredArgsConstructor
public class AdminBootstrap implements ApplicationRunner {

    private static final String ADMIN_ROLE = "ROLE_ADMIN";
    private static final int MIN_PASSWORD_LENGTH = 8;

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.bootstrap.name:}")
    private String adminName;

    @Value("${admin.bootstrap.email:}")
    private String adminEmail;

    @Value("${admin.bootstrap.password:}")
    private String adminPassword;

    @Override
    public void run(ApplicationArguments args) {
        if (adminEmail == null || adminEmail.isBlank()
                || adminPassword == null || adminPassword.isBlank()) {
            log.info("Admin inicial nao configurado; defina ADMIN_NAME, ADMIN_EMAIL e ADMIN_PASSWORD.");
            return;
        }

        String email = adminEmail.trim().toLowerCase();

        if (userRepository.findByEmail(email).isPresent()) {
            log.info("Admin inicial ja existe para {}.", email);
            return;
        }

        if (adminPassword.length() < MIN_PASSWORD_LENGTH) {
            log.warn("ADMIN_PASSWORD deve ter pelo menos {} caracteres; admin inicial nao criado.",
                    MIN_PASSWORD_LENGTH);
            return;
        }

        Roles adminRole = roleRepository.findByRole(ADMIN_ROLE).orElse(null);
        if (adminRole == null) {
            log.error("Role {} nao encontrada; admin inicial nao criado.", ADMIN_ROLE);
            return;
        }

        User admin = new User();
        admin.setName(adminName == null || adminName.isBlank() ? "Administrador" : adminName.trim());
        admin.setEmail(email);
        admin.setPassword(passwordEncoder.encode(adminPassword));
        admin.setRole(adminRole);
        admin.setSenhaAlterada(true);

        userRepository.save(admin);
        log.info("Admin inicial criado para {}.", email);
    }
}
