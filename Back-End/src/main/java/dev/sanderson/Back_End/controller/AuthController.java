package dev.sanderson.Back_End.controller;

import dev.sanderson.Back_End.controller.doc.AuthControllerDoc;
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
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@Validated
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController implements AuthControllerDoc {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;

    @PostMapping
    public ResponseEntity<String> auth(@RequestBody @Valid UserLoginDto userLoginDto)  {

        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =
                new UsernamePasswordAuthenticationToken(
                        userLoginDto.getEmail(),
                        userLoginDto.getPassword()
                );

        Authentication authentication =
                authenticationManager.authenticate(
                        usernamePasswordAuthenticationToken);

        User userValidado = (User) authentication.getPrincipal();

        return new ResponseEntity<>(tokenService.generateToken(userValidado), HttpStatus.OK);

    }

    @PostMapping("/registrar")
    public ResponseEntity<UserResponse> registrar (@RequestBody @Valid UserRequest userRequest) throws BusinessRuleException {
        UserResponse user = userService.registrar(userRequest);
        return new ResponseEntity<>(user, HttpStatus.CREATED);
    }
}
