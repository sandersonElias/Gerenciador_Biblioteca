package dev.sanderson.Back_End.service;

import dev.sanderson.Back_End.dto.LivroDtos.LivroRequest;
import dev.sanderson.Back_End.dto.LivroDtos.LivroResponse;
import dev.sanderson.Back_End.entity.*;
import dev.sanderson.Back_End.exception.BusinessRuleException;
import dev.sanderson.Back_End.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class LivroServiceTest {

    @Autowired private LivroService livroService;
    @Autowired private LivroRepository livroRepository;
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
        catalogacaoRepository.deleteAll();
        generoRepository.deleteAll();
        autorRepository.deleteAll();
    }

    private Autor criarAutor(String nome) {
        Autor autor = new Autor();
        autor.setAutor(nome);
        return autorRepository.save(autor);
    }

    private Genero criarGenero(String nome) {
        Genero genero = new Genero();
        genero.setGenero(nome);
        return generoRepository.save(genero);
    }

    private Catalogacao criarCatalogacao(String nome) {
        Catalogacao catalogacao = new Catalogacao();
        catalogacao.setCatalogacao(nome);
        return catalogacaoRepository.save(catalogacao);
    }

    @Test
    void deveCriarLivroComSucesso() throws BusinessRuleException {
        Autor autor = criarAutor("Autor Teste");
        Genero genero = criarGenero("Genero Teste");
        Catalogacao catalogacao = criarCatalogacao("Catalogacao Teste");

        LivroRequest request = new LivroRequest();
        request.setTitulo("Java Basico");
        request.setTotalExemplares(3);
        request.setQuantidadeDisponivel(3);
        request.setAutorId(autor.getId());
        request.setGeneroId(genero.getId());
        request.setCatalogacaoId(catalogacao.getId());

        LivroResponse response = livroService.insertLivro(request);

        assertNotNull(response);
        assertEquals("Java Basico", response.getTitulo());
        assertEquals(3, response.getTotalExemplares());
    }

    @Test
    void deveBuscarLivroPorTitulo() {
        Autor autor = criarAutor("Autor Teste");
        Genero genero = criarGenero("Genero Teste");
        Catalogacao catalogacao = criarCatalogacao("Catalogacao Teste");

        Livro livro = new Livro();
        livro.setTitulo("Spring Framework");
        livro.setTotalExemplares(2);
        livro.setQuantidadeDisponivel(2);
        livro.setContadorEmprestimos(0);
        livro.setAutor(autor);
        livro.setGenero(genero);
        livro.setCatalogacao(catalogacao);
        livroRepository.save(livro);

        var resultados = livroService.buscarPorTitulo("Spring");
        assertFalse(resultados.isEmpty());
        assertEquals("Spring Framework", resultados.get(0).getTitulo());
    }

    @Test
    void deveListarTodosLivros() {
        Autor autor = criarAutor("Autor Teste");
        Genero genero = criarGenero("Genero Teste");
        Catalogacao catalogacao = criarCatalogacao("Catalogacao Teste");

        Livro livro = new Livro();
        livro.setTitulo("Livro Teste");
        livro.setTotalExemplares(1);
        livro.setQuantidadeDisponivel(1);
        livro.setContadorEmprestimos(0);
        livro.setAutor(autor);
        livro.setGenero(genero);
        livro.setCatalogacao(catalogacao);
        livroRepository.save(livro);

        var todos = livroService.listarTodos();
        assertFalse(todos.isEmpty());
    }
}