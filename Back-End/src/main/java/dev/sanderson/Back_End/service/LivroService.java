package dev.sanderson.Back_End.service;

import dev.sanderson.Back_End.dto.LivroDtos.LivroRequest;
import dev.sanderson.Back_End.dto.LivroDtos.LivroResponse;
import dev.sanderson.Back_End.entity.Autor;
import dev.sanderson.Back_End.entity.Catalogacao;
import dev.sanderson.Back_End.entity.Genero;
import dev.sanderson.Back_End.entity.Livro;
import dev.sanderson.Back_End.repository.AutorRepository;
import dev.sanderson.Back_End.repository.CatalogacaoRepository;
import dev.sanderson.Back_End.repository.GeneroRepository;
import dev.sanderson.Back_End.repository.LivroRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.PageRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LivroService {

    private final LivroRepository livroRepository;
    private final AutorRepository autorRepository;
    private final CatalogacaoRepository catalogacaoRepository;
    private final GeneroRepository generoRepository;
    private final ExemplarService exemplarService;
    private final ObjectMapper objectMapper;


    // Criar novo livro
    @Transactional
    public LivroResponse insertLivro(LivroRequest dto) {

        Autor autor = autorRepository.findById(dto.getAutorId())
                .orElseThrow(() -> new RuntimeException("Autor não encontrado"));

        Genero genero = generoRepository.findById(dto.getGeneroId())
                .orElseThrow(() -> new RuntimeException("Genero não encontrado"));

        Catalogacao catalogacao = catalogacaoRepository.findById(dto.getCatalogacaoId())
                .orElseThrow(() -> new RuntimeException("Catalogacao não encontrada"));


        Livro livro = new Livro();
        livro.setId(dto.getId());

        livro.setTitulo(dto.getTitulo());
        livro.setEditora(dto.getEditora());
        livro.setCdd(dto.getCdd());
        livro.setLocalizacao(dto.getLocalizacao());
        livro.setDescricao(dto.getDescricao());
        livro.setUrlImg(dto.getUrlImg());

        livro.setTotalExemplares(
                dto.getTotalExemplares() != null ? dto.getTotalExemplares() : 0
        );

        livro.setQuantidadeDisponivel(dto.getQuantidadeDisponivel());

        livro.setContadorEmprestimos(0);


        livro.setAutor(autor);
        livro.setGenero(genero);
        livro.setCatalogacao(catalogacao);

        Livro salvo = livroRepository.save(livro);

        // ✅ Cria os exemplares físicos correspondentes ao totalExemplares
        exemplarService.criarExemplaresParaLivro(salvo);

        return objectMapper.convertValue(salvo, LivroResponse.class);
    }

    @Transactional
    public LivroResponse updateLivro(Long id, LivroRequest dto) {
        // 1) buscar livro existente
        Livro livroExistente = livroRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Livro não encontrado com id: " + id));

        // 2) validar e buscar entidades relacionadas (autor/genero/catalogacao)
        Autor autor = autorRepository.findById(dto.getAutorId())
                .orElseThrow(() -> new RuntimeException("Autor não encontrado"));

        Genero genero = generoRepository.findById(dto.getGeneroId())
                .orElseThrow(() -> new RuntimeException("Genero não encontrado"));

        Catalogacao catalogacao = catalogacaoRepository.findById(dto.getCatalogacaoId())
                .orElseThrow(() -> new RuntimeException("Catalogacao não encontrada"));

        // 3) atualizar campos
        livroExistente.setTitulo(dto.getTitulo());
        livroExistente.setEditora(dto.getEditora());
        livroExistente.setCdd(dto.getCdd());
        livroExistente.setLocalizacao(dto.getLocalizacao());
        livroExistente.setDescricao(dto.getDescricao());
        livroExistente.setUrlImg(dto.getUrlImg());

        // Atualizar relacionamentos
        livroExistente.setAutor(autor);
        livroExistente.setGenero(genero);
        livroExistente.setCatalogacao(catalogacao);

        // 4) salvar e retornar — captura o total anterior ANTES de sobrescrever
        int totalAnterior = livroExistente.getTotalExemplares() != null ? livroExistente.getTotalExemplares() : 0;

        livroExistente.setTotalExemplares(dto.getTotalExemplares() != null ? dto.getTotalExemplares() : totalAnterior);
        livroExistente.setQuantidadeDisponivel(dto.getQuantidadeDisponivel() != null ? dto.getQuantidadeDisponivel() : livroExistente.getQuantidadeDisponivel());

        Livro salvo = livroRepository.save(livroExistente);

        // ✅ Se total de exemplares aumentou, cria os novos exemplares físicos
        exemplarService.ajustarExemplares(salvo, totalAnterior);

        return objectMapper.convertValue(salvo, LivroResponse.class);
    }

    // Buscar todos os livros
    public List<LivroResponse> listarTodos() {
        return livroRepository.findAll()
                .stream()
                .map(livro -> objectMapper.convertValue(livro, LivroResponse.class))
                .toList();
    }

    // Buscar por ID
    public LivroResponse buscarPorId(Long id) {
        Livro livro = livroRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Livro não encontrado"));
        return objectMapper.convertValue(livro, LivroResponse.class);
    }

    // Buscar por título
    public List<LivroResponse> buscarPorTitulo(String titulo) {
        return livroRepository.buscarTitulo(titulo)
                .stream()
                .map(livro -> objectMapper.convertValue(livro, LivroResponse.class))
                .toList();
    }

    // Buscar por autor
    public List<LivroResponse> buscarPorAutor(String autor) {
        return livroRepository.buscarAutor(autor)
                .stream()
                .map(livro -> objectMapper.convertValue(livro, LivroResponse.class))
                .toList();
    }

    // Buscar por gênero
    public List<LivroResponse> buscarPorGenero(String genero) {
        return livroRepository.buscarGenero(genero)
                .stream()
                .map(livro -> objectMapper.convertValue(livro, LivroResponse.class))
                .toList();
    }

    // Buscar por catalogação
    public List<LivroResponse> buscarPorCatalogacao(String catalogacao) {
        return livroRepository.buscarCatalogacao(catalogacao)
                .stream()
                .map(livro -> objectMapper.convertValue(livro, LivroResponse.class))
                .toList();
    }

    // Listar livros mais populares
    public List<LivroResponse> listarMaisPopulares(int limite) {
        return livroRepository.listarMaisPopulares(PageRequest.of(0, Math.max(1, limite)))
                .stream()
                .map(livro -> objectMapper.convertValue(livro, LivroResponse.class))
                .toList();
    }
}