package dev.sanderson.Back_End.service;

import dev.sanderson.Back_End.dto.LivroDtos.LivroRequest;
import dev.sanderson.Back_End.dto.LivroDtos.LivroResponse;
import dev.sanderson.Back_End.entity.Autor;
import dev.sanderson.Back_End.entity.Catalogacao;
import dev.sanderson.Back_End.entity.Genero;
import dev.sanderson.Back_End.entity.Livro;
import dev.sanderson.Back_End.exception.BusinessRuleException;
import dev.sanderson.Back_End.repository.AutorRepository;
import dev.sanderson.Back_End.repository.CatalogacaoRepository;
import dev.sanderson.Back_End.repository.EmprestimoRepository;
import dev.sanderson.Back_End.repository.GeneroRepository;
import dev.sanderson.Back_End.repository.LivroRepository;
import dev.sanderson.Back_End.repository.ReservaRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.PageRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LivroService {

    private final LivroRepository livroRepository;
    private final AutorRepository autorRepository;
    private final CatalogacaoRepository catalogacaoRepository;
    private final GeneroRepository generoRepository;
    private final EmprestimoRepository emprestimoRepository;
    private final ReservaRepository reservaRepository;
    private final ExemplarService exemplarService;
    private final ObjectMapper objectMapper;

    @Transactional
    @CacheEvict(value = "livros", allEntries = true)
    public LivroResponse insertLivro(LivroRequest dto) throws BusinessRuleException {

        Autor autor = autorRepository.findById(dto.getAutorId())
                .orElseThrow(() -> new EntityNotFoundException("Autor nao encontrado"));

        Optional<Livro> existente = livroRepository.findByTituloAndAutorId(
                dto.getTitulo().trim(),
                autor.getId()
        );

        if (existente.isPresent()) {
            throw new BusinessRuleException(
                    "Livro ja cadastrado: \"" + dto.getTitulo() +
                            "\" do autor " + autor.getAutor()
            );
        }

        Genero genero = generoRepository.findById(dto.getGeneroId())
                .orElseThrow(() -> new EntityNotFoundException("Genero nao encontrado"));

        Catalogacao catalogacao = catalogacaoRepository.findById(dto.getCatalogacaoId())
                .orElseThrow(() -> new EntityNotFoundException("Catalogacao nao encontrada"));

        Livro livro = new Livro();
        livro.setId(dto.getId());
        livro.setTitulo(dto.getTitulo().trim());
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

        exemplarService.criarExemplaresParaLivro(salvo);

        return objectMapper.convertValue(salvo, LivroResponse.class);
    }

    @Transactional
    @CacheEvict(value = "livros", allEntries = true)
    public LivroResponse updateLivro(Long id, LivroRequest dto) throws BusinessRuleException {
        Livro livroExistente = livroRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Livro nao encontrado com id: " + id));

        Autor autor = autorRepository.findById(dto.getAutorId())
                .orElseThrow(() -> new EntityNotFoundException("Autor nao encontrado"));

        Optional<Livro> existente = livroRepository.findByTituloAndAutorId(
                dto.getTitulo().trim(),
                autor.getId()
        );

        if (existente.isPresent() && !existente.get().getId().equals(id)) {
            throw new BusinessRuleException(
                    "Ja existe outro livro cadastrado com este titulo e autor"
            );
        }

        Genero genero = generoRepository.findById(dto.getGeneroId())
                .orElseThrow(() -> new EntityNotFoundException("Genero nao encontrado"));

        Catalogacao catalogacao = catalogacaoRepository.findById(dto.getCatalogacaoId())
                .orElseThrow(() -> new EntityNotFoundException("Catalogacao nao encontrada"));

        livroExistente.setTitulo(dto.getTitulo().trim());
        livroExistente.setEditora(dto.getEditora());
        livroExistente.setCdd(dto.getCdd());
        livroExistente.setLocalizacao(dto.getLocalizacao());
        livroExistente.setDescricao(dto.getDescricao());
        livroExistente.setUrlImg(dto.getUrlImg());

        livroExistente.setAutor(autor);
        livroExistente.setGenero(genero);
        livroExistente.setCatalogacao(catalogacao);

        int totalAnterior = livroExistente.getTotalExemplares() != null
                ? livroExistente.getTotalExemplares() : 0;

        livroExistente.setTotalExemplares(
                dto.getTotalExemplares() != null ? dto.getTotalExemplares() : totalAnterior
        );
        livroExistente.setQuantidadeDisponivel(
                dto.getQuantidadeDisponivel() != null
                        ? dto.getQuantidadeDisponivel()
                        : livroExistente.getQuantidadeDisponivel()
        );

        Livro salvo = livroRepository.save(livroExistente);

        exemplarService.ajustarExemplares(salvo, totalAnterior);

        return objectMapper.convertValue(salvo, LivroResponse.class);
    }

    @Transactional
    @CacheEvict(value = "livros", allEntries = true)
    public void deleteLivro(Long id) throws BusinessRuleException {
        Livro livro = livroRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Livro nao encontrado"));

        long totalEmprestimos = emprestimoRepository.countByLivroId(id);

        if (totalEmprestimos > 0) {
            throw new BusinessRuleException(
                    "Nao e possivel excluir o livro \"" + livro.getTitulo() +
                            "\" pois possui historico de " + totalEmprestimos +
                            " emprestimo(s). Para preservar os registros, este livro nao pode ser excluido."
            );
        }

        long totalReservas = reservaRepository.countByLivroId(id);

        if (totalReservas > 0) {
            throw new BusinessRuleException(
                    "Nao e possivel excluir o livro \"" + livro.getTitulo() +
                            "\" pois possui historico de " + totalReservas +
                            " reserva(s). Para preservar os registros, este livro nao pode ser excluido."
            );
        }

        exemplarService.deletarTodosExemplaresDoLivro(id);
        livroRepository.delete(livro);
    }

    @Cacheable(value = "livros", key = "'todos'")
    public List<LivroResponse> listarTodos() {
        return livroRepository.findAll()
                .stream()
                .map(livro -> objectMapper.convertValue(livro, LivroResponse.class))
                .toList();
    }

    @Cacheable(value = "livros", key = "#id")
    public LivroResponse buscarPorId(Long id) {
        Livro livro = livroRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Livro nao encontrado"));
        return objectMapper.convertValue(livro, LivroResponse.class);
    }

    @Cacheable(value = "livros", key = "'titulo_' + #titulo")
    public List<LivroResponse> buscarPorTitulo(String titulo) {
        return livroRepository.buscarTitulo(titulo)
                .stream()
                .map(livro -> objectMapper.convertValue(livro, LivroResponse.class))
                .toList();
    }

    @Cacheable(value = "livros", key = "'autor_' + #autor")
    public List<LivroResponse> buscarPorAutor(String autor) {
        return livroRepository.buscarAutor(autor)
                .stream()
                .map(livro -> objectMapper.convertValue(livro, LivroResponse.class))
                .toList();
    }

    @Cacheable(value = "livros", key = "'genero_' + #genero")
    public List<LivroResponse> buscarPorGenero(String genero) {
        return livroRepository.buscarGenero(genero)
                .stream()
                .map(livro -> objectMapper.convertValue(livro, LivroResponse.class))
                .toList();
    }

    @Cacheable(value = "livros", key = "'catalogacao_' + #catalogacao")
    public List<LivroResponse> buscarPorCatalogacao(String catalogacao) {
        return livroRepository.buscarCatalogacao(catalogacao)
                .stream()
                .map(livro -> objectMapper.convertValue(livro, LivroResponse.class))
                .toList();
    }

    @Cacheable(value = "livros", key = "'populares_' + #limite")
    public List<LivroResponse> listarMaisPopulares(int limite) {
        return livroRepository.listarMaisPopulares(PageRequest.of(0, Math.max(1, limite)))
                .stream()
                .map(livro -> objectMapper.convertValue(livro, LivroResponse.class))
                .toList();
    }

    @Cacheable(value = "livros", key = "'busca_' + #filtros.hashCode()")
    public org.springframework.data.domain.Page<LivroResponse> buscarComFiltros(dev.sanderson.Back_End.dto.LivroDtos.FiltroLivroRequest filtros) {
        dev.sanderson.Back_End.specification.LivroSpecification spec = new dev.sanderson.Back_End.specification.LivroSpecification(filtros);
        int pagina = filtros.getPagina() != null ? filtros.getPagina() : 0;
        int tamanhoPagina = filtros.getTamanhoPagina() != null ? filtros.getTamanhoPagina() : 20;
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(pagina, tamanhoPagina);

        return livroRepository.findAll(spec, pageable)
                .map(livro -> objectMapper.convertValue(livro, LivroResponse.class));
    }
}