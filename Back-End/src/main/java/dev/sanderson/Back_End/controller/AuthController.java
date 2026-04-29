package dev.sanderson.Back_End.controller;

import dev.sanderson.Back_End.controller.doc.AuthControllerDoc;
import dev.sanderson.Back_End.dto.UserDtos.LoginResponse;
import dev.sanderson.Back_End.dto.UserDtos.UserLoginDto;
import dev.sanderson.Back_End.dto.UserDtos.UserRequest;
import dev.sanderson.Back_End.dto.UserDtos.UserResponse;
import dev.sanderson.Back_End.entity.User;
import dev.sanderson.Back_End.exception.BusinessRuleException;
import dev.sanderson.Back_End.security.TokenService;
import dev.sanderson.Back_End.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@Validated
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController implements AuthControllerDoc {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<LoginResponse> auth(@RequestBody @Valid UserLoginDto userLoginDto) {

        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =
                new UsernamePasswordAuthenticationToken(
                        userLoginDto.getEmail(),
                        userLoginDto.getPassword()
                );

        Authentication authentication =
                authenticationManager.authenticate(usernamePasswordAuthenticationToken);

        User userValidado = (User) authentication.getPrincipal();

        String token = tokenService.generateToken(userValidado);
        LoginResponse response = new LoginResponse(token, userValidado.isSenhaAlterada());

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping(
            value = "/registrar",
            consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<UserResponse> registrar(@RequestBody @Valid UserRequest userRequest) throws BusinessRuleException {
        UserResponse user = userService.registrar(userRequest);
        return new ResponseEntity<>(user, HttpStatus.CREATED);
    }
}