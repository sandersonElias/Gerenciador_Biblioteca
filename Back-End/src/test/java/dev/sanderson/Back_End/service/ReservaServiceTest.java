package dev.sanderson.Back_End.service;

import dev.sanderson.Back_End.dto.ReservaDtos.ReservaRequest;
import dev.sanderson.Back_End.dto.ReservaDtos.ReservaResponse;
import dev.sanderson.Back_End.entity.*;
import dev.sanderson.Back_End.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class ReservaServiceTest {

    @Autowired private ReservaService reservaService;
    @Autowired private UserRepository userRepository;
    @Autowired private LivroRepository livroRepository;
    @Autowired private RoleRepository roleRepository;
    @Autowired private AutorRepository autorRepository;
    @Autowired private GeneroRepository generoRepository;
    @Autowired private CatalogacaoRepository catalogacaoRepository;
    @Autowired private ReservaRepository reservaRepository;
    @Autowired private EmprestimoRepository emprestimoRepository;
    @Autowired private ExemplarRepository exemplarRepository;
    @Autowired private SolicitacaoRenovacaoRepository solicitacaoRepository;

    @BeforeEach
    void setUp() {
        solicitacaoRepository.deleteAll();
        emprestimoRepository.deleteAll();
        reservaRepository.deleteAll();
        exemplarRepository.deleteAll();
        livroRepository.deleteAll();
        userRepository.deleteAll();
        catalogacaoRepository.deleteAll();
        generoRepository.deleteAll();
        autorRepository.deleteAll();
        roleRepository.deleteAll();
    }

    private Roles criarRole(String nome) {
        Roles role = new Roles();
        role.setRole(nome);
        return roleRepository.save(role);
    }

    private User criarUsuario(String email) {
        Roles role = roleRepository.findByRole("ROLE_ALUNO")
                .orElseGet(() -> criarRole("ROLE_ALUNO"));
        User user = new User();
        user.setName("Test User");
        user.setEmail(email);
        user.setPassword("senha123");
        user.setRole(role);
        user.setSenhaAlterada(true);
        return userRepository.save(user);
    }

    private Livro criarLivro(String titulo, int quantidadeDisponivel) {
        Autor autor = new Autor();
        autor.setAutor("Autor Teste");
        autor = autorRepository.save(autor);

        Genero genero = new Genero();
        genero.setGenero("Genero Teste");
        genero = generoRepository.save(genero);

        Catalogacao catalogacao = new Catalogacao();
        catalogacao.setCatalogacao("Catalogacao Teste");
        catalogacao = catalogacaoRepository.save(catalogacao);

        Livro livro = new Livro();
        livro.setTitulo(titulo);
        livro.setTotalExemplares(quantidadeDisponivel);
        livro.setQuantidadeDisponivel(quantidadeDisponivel);
        livro.setContadorEmprestimos(0);
        livro.setAutor(autor);
        livro.setGenero(genero);
        livro.setCatalogacao(catalogacao);
        return livroRepository.save(livro);
    }

    @Test
    void deveCriarReservaComSucesso() {
        User user = criarUsuario("aluno@test.com");
        Livro livro = criarLivro("Java Basico", 2);

        ReservaRequest request = new ReservaRequest();
        request.setLivroId(livro.getId());
        request.setUserId(user.getId());

        ReservaResponse response = reservaService.reservarLivro(request);

        assertNotNull(response);
        assertEquals("DISPONIVEL", response.getStatus());
    }

    @Test
    void deveCancelarReserva() {
        User user = criarUsuario("aluno@test.com");
        Livro livro = criarLivro("Java Basico", 2);

        ReservaRequest request = new ReservaRequest();
        request.setLivroId(livro.getId());
        request.setUserId(user.getId());

        ReservaResponse reserva = reservaService.reservarLivro(request);

        reservaService.cancelarReserva(reserva.getId());

        var cancelada = reservaRepository.findById(reserva.getId()).get();
        assertEquals("CANCELADA", cancelada.getStatus().name());
    }

    @Test
    void deveListarReservas() {
        User user = criarUsuario("aluno@test.com");
        Livro livro = criarLivro("Java Basico", 2);

        ReservaRequest request = new ReservaRequest();
        request.setLivroId(livro.getId());
        request.setUserId(user.getId());

        reservaService.reservarLivro(request);

        var todas = reservaService.listarReservas();
        assertFalse(todas.isEmpty());
    }
}