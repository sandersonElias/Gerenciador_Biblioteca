package dev.sanderson.Back_End.controller;

import dev.sanderson.Back_End.dto.UserDtos.UserResponse;
import dev.sanderson.Back_End.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
}
