package dev.sanderson.Back_End.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.sanderson.Back_End.dto.UserDtos.UserRequest;
import dev.sanderson.Back_End.dto.UserDtos.UserResponse;
import dev.sanderson.Back_End.entity.Roles;
import dev.sanderson.Back_End.entity.User;
import dev.sanderson.Back_End.exception.BusinessRuleException;
import dev.sanderson.Back_End.repository.RoleRepository;
import dev.sanderson.Back_End.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public Optional<User> findByLoginAndPassword(String email, String password) {
        return userRepository.findByEmailAndPassword(email, password);
    }

    public Optional<User> findById(Long id){
        return userRepository.findById(id);
    }

    public Optional<User> findByEmail(String email){
        return userRepository.findByEmail(email);
    }

    public UserResponse registrar(UserRequest userRequest) throws BusinessRuleException {

        if(userRepository.findByEmail(userRequest.getEmail()).isPresent()){
            throw new BusinessRuleException("Email já " + userRequest.getEmail() + " está em uso");
        }

        User newUser = new User();

        newUser.setName(userRequest.getName());
        newUser.setEmail(userRequest.getEmail());
        newUser.setPassword(passwordEncoder.encode(userRequest.getPassword()));

        Roles role = buscarRole(userRequest.getRole());
        newUser.setRole(role);

        newUser = userRepository.save(newUser);

        UserResponse registrar = objectMapper.convertValue(newUser, UserResponse.class);
        return registrar;
    }

    public Roles buscarRole(String role) throws BusinessRuleException {
        return roleRepository.findByRole(role)
                .orElseThrow(() ->
                        new BusinessRuleException("Role não existe: " + role));
    }
}