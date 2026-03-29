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

import java.util.List;

@Service
@RequiredArgsConstructor
public class LivroService {

    private final LivroRepository livroRepository;
    private final AutorRepository autorRepository;
    private final CatalogacaoRepository catalogacaoRepository;
    private final GeneroRepository generoRepository;
    private final ObjectMapper objectMapper;

    // Criar novo livro
    public LivroResponse insertLivro(LivroRequest dto) {

        Livro livro = new Livro();

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

        Autor autor = autorRepository.findById(dto.getAutorId())
                .orElseThrow(() -> new RuntimeException("Autor não encontrado"));

        Genero genero = generoRepository.findById(dto.getGeneroId())
                .orElseThrow(() -> new RuntimeException("Genero não encontrado"));

        Catalogacao catalogacao = catalogacaoRepository.findById(dto.getCatalogacaoId())
                .orElseThrow(() -> new RuntimeException("Catalogacao não encontrada"));

        livro.setAutor(autor);
        livro.setGenero(genero);
        livro.setCatalogacao(catalogacao);

        Livro salvo = livroRepository.save(livro);

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