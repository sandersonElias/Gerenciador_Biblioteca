package dev.sanderson.Back_End.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.sanderson.Back_End.dto.UserDtos.*;
import dev.sanderson.Back_End.entity.Roles;
import dev.sanderson.Back_End.entity.User;
import dev.sanderson.Back_End.exception.BusinessRuleException;
import dev.sanderson.Back_End.repository.RoleRepository;
import dev.sanderson.Back_End.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private static final String ROLE_PROFESSOR = "ROLE_PROFESSOR";

    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Deprecated
    public Optional<User> findByLoginAndPassword(String email, String password) {
        return userRepository.findByEmailAndPassword(email, password);
    }

    @Transactional(readOnly = true)
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Transactional
    public UserResponse registrar(UserRequest userRequest) {

        if (userRepository.findByEmail(userRequest.getEmail()).isPresent()) {
            throw new BusinessRuleException("Email ja " + userRequest.getEmail() + " esta em uso");
        }

        User newUser = new User();
        newUser.setName(userRequest.getName());
        newUser.setEmail(userRequest.getEmail());
        newUser.setPassword(passwordEncoder.encode(userRequest.getPassword()));
        newUser.setSenhaAlterada(true);

        Roles role = buscarRole(userRequest.getRole());
        newUser.setRole(role);

        newUser = userRepository.save(newUser);

        return objectMapper.convertValue(newUser, UserResponse.class);
    }

    private Roles buscarRole(String role) {
        return roleRepository.findByRole(role)
                .orElseThrow(() ->
                        new BusinessRuleException("Role nao existe: " + role));
    }

    @Transactional(readOnly = true)
    public List<UserResponse> buscarUserName(String name) {
        return userRepository.buscarPeloNome(name)
                .stream()
                .map(e -> objectMapper.convertValue(e, UserResponse.class))
                .toList();
    }

    @Transactional
    public UserResponse cadastrarProfessor(CadastrarProfessorRequest request) {

        String emailLower = request.getEmail().toLowerCase();

        if (userRepository.findByEmail(emailLower).isPresent()) {
            throw new BusinessRuleException("Email " + emailLower + " ja esta em uso");
        }

        if (userRepository.findByMatricula(request.getMatricula()).isPresent()) {
            throw new BusinessRuleException("Matricula " + request.getMatricula() + " ja esta em uso");
        }

        Roles roleProfessor = buscarRole(ROLE_PROFESSOR);

        User professor = new User();
        professor.setName(request.getNome());
        professor.setEmail(emailLower);
        professor.setMatricula(request.getMatricula());
        professor.setPassword(passwordEncoder.encode(request.getMatricula()));
        professor.setRole(roleProfessor);
        professor.setSenhaAlterada(false);

        User salvo = userRepository.save(professor);
        return objectMapper.convertValue(salvo, UserResponse.class);
    }

    @Transactional
    public void trocarSenha(String email, TrocarSenhaRequest request) {

        if (!request.getNovaSenha().equals(request.getConfirmacaoNovaSenha())) {
            throw new BusinessRuleException("A nova senha e a confirmacao nao conferem");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessRuleException("Usuario nao encontrado"));

        if (!passwordEncoder.matches(request.getSenhaAtual(), user.getPassword())) {
            throw new BusinessRuleException("Senha atual incorreta");
        }

        if (passwordEncoder.matches(request.getNovaSenha(), user.getPassword())) {
            throw new BusinessRuleException("A nova senha deve ser diferente da atual");
        }

        user.setPassword(passwordEncoder.encode(request.getNovaSenha()));
        user.setSenhaAlterada(true);
        userRepository.save(user);
    }
}
