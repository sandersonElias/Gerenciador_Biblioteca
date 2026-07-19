package dev.sanderson.Back_End.service;

import dev.sanderson.Back_End.dto.UserDtos.UserRequest;
import dev.sanderson.Back_End.dto.UserDtos.UserResponse;
import dev.sanderson.Back_End.entity.Roles;
import dev.sanderson.Back_End.exception.BusinessRuleException;
import dev.sanderson.Back_End.repository.RoleRepository;
import dev.sanderson.Back_End.repository.UserRepository;
import dev.sanderson.Back_End.repository.EmprestimoRepository;
import dev.sanderson.Back_End.repository.ReservaRepository;
import dev.sanderson.Back_End.repository.SolicitacaoRenovacaoRepository;
import dev.sanderson.Back_End.repository.LivroRepository;
import dev.sanderson.Back_End.repository.ExemplarRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class UserServiceTest {

    @Autowired private UserService userService;
    @Autowired private UserRepository userRepository;
    @Autowired private RoleRepository roleRepository;
    @Autowired private EmprestimoRepository emprestimoRepository;
    @Autowired private ReservaRepository reservaRepository;
    @Autowired private SolicitacaoRenovacaoRepository solicitacaoRepository;
    @Autowired private ExemplarRepository exemplarRepository;
    @Autowired private LivroRepository livroRepository;

    @BeforeEach
    void setUp() {
        solicitacaoRepository.deleteAll();
        emprestimoRepository.deleteAll();
        reservaRepository.deleteAll();
        exemplarRepository.deleteAll();
        livroRepository.deleteAll();
        userRepository.deleteAll();
    }

    private Roles getOrCreateRole(String nome) {
        return roleRepository.findByRole(nome).orElseGet(() -> {
            Roles role = new Roles();
            role.setRole(nome);
            return roleRepository.save(role);
        });
    }

    @Test
    void deveRegistrarUsuarioComSucesso() throws BusinessRuleException {
        getOrCreateRole("ROLE_ALUNO");

        UserRequest request = new UserRequest();
        request.setName("Test User");
        request.setEmail("test@test.com");
        request.setPassword("senha123");
        request.setRole("ROLE_ALUNO");

        UserResponse response = userService.registrar(request);

        assertNotNull(response);
        assertEquals("Test User", response.getName());
        assertEquals("test@test.com", response.getEmail());
    }

    @Test
    void deveLancarExcecaoParaEmailDuplicado() throws BusinessRuleException {
        getOrCreateRole("ROLE_ALUNO");

        UserRequest request = new UserRequest();
        request.setName("Test User");
        request.setEmail("test@test.com");
        request.setPassword("senha123");
        request.setRole("ROLE_ALUNO");

        userService.registrar(request);

        UserRequest duplicado = new UserRequest();
        duplicado.setName("Outro User");
        duplicado.setEmail("test@test.com");
        duplicado.setPassword("senha456");
        duplicado.setRole("ROLE_ALUNO");

        assertThrows(BusinessRuleException.class, () -> userService.registrar(duplicado));
    }

    @Test
    void deveBuscarUsuariosPorNome() throws BusinessRuleException {
        getOrCreateRole("ROLE_ALUNO");

        UserRequest request = new UserRequest();
        request.setName("Joao Silva");
        request.setEmail("joao@test.com");
        request.setPassword("senha123");
        request.setRole("ROLE_ALUNO");

        userService.registrar(request);

        var resultados = userService.buscarUserName("Joao");
        assertFalse(resultados.isEmpty());
    }
}