package dev.sanderson.Back_End.controller;

import dev.sanderson.Back_End.dto.UserDtos.TrocarSenhaRequest;
import dev.sanderson.Back_End.dto.UserDtos.UserResponse;
import dev.sanderson.Back_End.exception.BusinessRuleException;
import dev.sanderson.Back_End.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/name/{name}")
    public ResponseEntity<List<UserResponse>> buscarUserName(@PathVariable String name) {
        return ResponseEntity.ok(userService.buscarUserName(name));
    }

    /**
     * Troca a senha do usuário autenticado.
     * O email é extraído do token JWT (Authentication.getName()).
     */
    @PostMapping("/me/trocar-senha")
    public ResponseEntity<Void> trocarSenha(
            @RequestBody @Valid TrocarSenhaRequest request,
            Authentication authentication
    ) throws BusinessRuleException {

        String email = authentication.getName();
        userService.trocarSenha(email, request);
        return ResponseEntity.noContent().build();
    }
}