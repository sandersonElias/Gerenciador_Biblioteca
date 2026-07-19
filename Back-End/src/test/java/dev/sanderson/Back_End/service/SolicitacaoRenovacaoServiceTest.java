package dev.sanderson.Back_End.service;

import dev.sanderson.Back_End.entity.*;
import dev.sanderson.Back_End.entity.type.StatusEmprestimo;
import dev.sanderson.Back_End.entity.type.StatusSolicitacao;
import dev.sanderson.Back_End.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class SolicitacaoRenovacaoServiceTest {

    @Autowired private SolicitacaoRenovacaoService solicitacaoService;
    @Autowired private EmprestimoRepository emprestimoRepository;
    @Autowired private SolicitacaoRenovacaoRepository solicitacaoRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private LivroRepository livroRepository;
    @Autowired private RoleRepository roleRepository;
    @Autowired private AutorRepository autorRepository;
    @Autowired private GeneroRepository generoRepository;
    @Autowired private CatalogacaoRepository catalogacaoRepository;
    @Autowired private ExemplarRepository exemplarRepository;
    @Autowired private ReservaRepository reservaRepository;

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

    private User criarUsuario(String email, String roleNome) {
        Roles role = roleRepository.findByRole(roleNome)
                .orElseGet(() -> criarRole(roleNome));
        User user = new User();
        user.setName("Test User");
        user.setEmail(email);
        user.setPassword("senha123");
        user.setRole(role);
        user.setSenhaAlterada(true);
        return userRepository.save(user);
    }

    private Livro criarLivro(String titulo) {
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
        livro.setTotalExemplares(1);
        livro.setQuantidadeDisponivel(0);
        livro.setContadorEmprestimos(1);
        livro.setAutor(autor);
        livro.setGenero(genero);
        livro.setCatalogacao(catalogacao);
        return livroRepository.save(livro);
    }

    private Emprestimo criarEmprestimo(User user, Livro livro) {
        Emprestimo emprestimo = new Emprestimo();
        emprestimo.setUser(user);
        emprestimo.setLivro(livro);
        emprestimo.setDataEmprestimo(LocalDate.now().minusDays(10));
        emprestimo.setDataDevolucao(LocalDate.now().plusDays(3));
        emprestimo.setRenovacoes(0);
        emprestimo.setStatus(StatusEmprestimo.ATIVO);
        return emprestimoRepository.save(emprestimo);
    }

    @Test
    void deveCriarSolicitacaoRenovacao() {
        User user = criarUsuario("aluno@test.com", "ROLE_ALUNO");
        Livro livro = criarLivro("Java Basico");
        Emprestimo emprestimo = criarEmprestimo(user, livro);

        var response = solicitacaoService.solicitarRenovacao(emprestimo.getId(), "aluno@test.com");

        assertNotNull(response);
        assertEquals("PENDENTE", response.getStatus());
    }

    @Test
    void deveListarSolicitacoesPendentes() {
        User user = criarUsuario("aluno@test.com", "ROLE_ALUNO");
        Livro livro = criarLivro("Java Basico");
        Emprestimo emprestimo = criarEmprestimo(user, livro);

        solicitacaoService.solicitarRenovacao(emprestimo.getId(), "aluno@test.com");

        List<SolicitacaoRenovacao> pendentes = solicitacaoRepository
                .findByStatusOrderByDataSolicitacaoAsc(StatusSolicitacao.PENDENTE);
        assertFalse(pendentes.isEmpty());
    }

    @Test
    void deveAprovarSolicitacao() {
        User aluno = criarUsuario("aluno@test.com", "ROLE_ALUNO");
        User funcionario = criarUsuario("func@test.com", "ROLE_FUNCIONARIO");
        Livro livro = criarLivro("Java Basico");
        Emprestimo emprestimo = criarEmprestimo(aluno, livro);

        var solicitacao = solicitacaoService.solicitarRenovacao(emprestimo.getId(), "aluno@test.com");

        solicitacaoService.aprovarSolicitacao(solicitacao.getId(), "func@test.com");

        var aprovada = solicitacaoRepository.findById(solicitacao.getId()).get();
        assertEquals(StatusSolicitacao.APROVADA, aprovada.getStatus());
    }
}