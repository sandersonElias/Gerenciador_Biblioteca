package dev.sanderson.Back_End.service;

import dev.sanderson.Back_End.dto.EmprestimoDtos.EmprestimoRequest;
import dev.sanderson.Back_End.dto.EmprestimoDtos.EmprestimoResponse;
import dev.sanderson.Back_End.entity.*;
import dev.sanderson.Back_End.entity.type.StatusEmprestimo;
import dev.sanderson.Back_End.entity.type.StatusExemplar;
import dev.sanderson.Back_End.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class EmprestimoServiceTest {

    @Autowired private EmprestimoService emprestimoService;
    @Autowired private UserRepository userRepository;
    @Autowired private LivroRepository livroRepository;
    @Autowired private RoleRepository roleRepository;
    @Autowired private AutorRepository autorRepository;
    @Autowired private GeneroRepository generoRepository;
    @Autowired private CatalogacaoRepository catalogacaoRepository;
    @Autowired private ExemplarRepository exemplarRepository;
    @Autowired private EmprestimoRepository emprestimoRepository;
    @Autowired private ReservaRepository reservaRepository;
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
        livro.setTotalExemplares(2);
        livro.setQuantidadeDisponivel(2);
        livro.setContadorEmprestimos(0);
        livro.setAutor(autor);
        livro.setGenero(genero);
        livro.setCatalogacao(catalogacao);
        livro = livroRepository.save(livro);

        Exemplar exemplar = new Exemplar();
        exemplar.setCodigo("001");
        exemplar.setStatus(StatusExemplar.DISPONIVEL);
        exemplar.setLivro(livro);
        exemplarRepository.save(exemplar);

        return livro;
    }

    @Test
    void deveCriarEmprestimoComSucesso() {
        User user = criarUsuario("aluno@test.com", "ROLE_ALUNO");
        Livro livro = criarLivro("Java Basico");

        EmprestimoRequest request = new EmprestimoRequest();
        request.setLivroId(livro.getId());
        request.setUserId(user.getId());

        EmprestimoResponse response = emprestimoService.insertEmprestimo(request);

        assertNotNull(response);
        assertEquals("ATIVO", response.getStatus());
        assertEquals("Java Basico", response.getLivro().getTitulo());
    }

    @Test
    void deveDevolverEmprestimo() {
        User user = criarUsuario("aluno@test.com", "ROLE_ALUNO");
        Livro livro = criarLivro("Java Basico");

        EmprestimoRequest request = new EmprestimoRequest();
        request.setLivroId(livro.getId());
        request.setUserId(user.getId());

        EmprestimoResponse emprestimo = emprestimoService.insertEmprestimo(request);

        emprestimoService.devolverEmprestimo(emprestimo.getId());

        Emprestimo devolvido = emprestimoRepository.findById(emprestimo.getId()).get();
        assertEquals(StatusEmprestimo.DEVOLVIDO, devolvido.getStatus());
        assertNotNull(devolvido.getDataDevolvido());
    }

    @Test
    void deveListarTodosEmprestimos() {
        User user = criarUsuario("aluno@test.com", "ROLE_ALUNO");
        Livro livro = criarLivro("Java Basico");

        EmprestimoRequest request = new EmprestimoRequest();
        request.setLivroId(livro.getId());
        request.setUserId(user.getId());

        emprestimoService.insertEmprestimo(request);

        var todos = emprestimoService.todosEmprestimos();
        assertFalse(todos.isEmpty());
    }
}