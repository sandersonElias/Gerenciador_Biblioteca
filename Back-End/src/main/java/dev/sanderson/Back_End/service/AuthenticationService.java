package dev.sanderson.Back_End.service;

import dev.sanderson.Back_End.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthenticationService implements UserDetailsService {

    private final UserService userService;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        Optional<User> usuarioEntityOptional = userService.findByEmail(email);

        return usuarioEntityOptional
                .orElseThrow(() ->
                        new UsernameNotFoundException("Usuário inválido"));
    }
}