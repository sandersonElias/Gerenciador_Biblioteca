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

    // ═══════════════════════════════════════════════════════════════
    //  CRIAR NOVO LIVRO (com validação de duplicidade)
    // ═══════════════════════════════════════════════════════════════
    @Transactional
    public LivroResponse insertLivro(LivroRequest dto) throws BusinessRuleException {

        Autor autor = autorRepository.findById(dto.getAutorId())
                .orElseThrow(() -> new RuntimeException("Autor não encontrado"));

        // ✅ Validação de duplicidade (título + autor)
        Optional<Livro> existente = livroRepository.findByTituloAndAutorId(
                dto.getTitulo().trim(),
                autor.getId()
        );

        if (existente.isPresent()) {
            throw new BusinessRuleException(
                    "Livro já cadastrado: \"" + dto.getTitulo() +
                            "\" do autor " + autor.getAutor()
            );
        }

        Genero genero = generoRepository.findById(dto.getGeneroId())
                .orElseThrow(() -> new RuntimeException("Genero não encontrado"));

        Catalogacao catalogacao = catalogacaoRepository.findById(dto.getCatalogacaoId())
                .orElseThrow(() -> new RuntimeException("Catalogacao não encontrada"));

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

    // ═══════════════════════════════════════════════════════════════
    //  ATUALIZAR LIVRO
    // ═══════════════════════════════════════════════════════════════
    @Transactional
    public LivroResponse updateLivro(Long id, LivroRequest dto) throws BusinessRuleException {
        Livro livroExistente = livroRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Livro não encontrado com id: " + id));

        Autor autor = autorRepository.findById(dto.getAutorId())
                .orElseThrow(() -> new RuntimeException("Autor não encontrado"));

        // ✅ Valida duplicidade no UPDATE também (mas ignora o próprio livro)
        Optional<Livro> existente = livroRepository.findByTituloAndAutorId(
                dto.getTitulo().trim(),
                autor.getId()
        );

        if (existente.isPresent() && !existente.get().getId().equals(id)) {
            throw new BusinessRuleException(
                    "Já existe outro livro cadastrado com este título e autor"
            );
        }

        Genero genero = generoRepository.findById(dto.getGeneroId())
                .orElseThrow(() -> new RuntimeException("Genero não encontrado"));

        Catalogacao catalogacao = catalogacaoRepository.findById(dto.getCatalogacaoId())
                .orElseThrow(() -> new RuntimeException("Catalogacao não encontrada"));

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

    // ═══════════════════════════════════════════════════════════════
    //  DELETAR LIVRO (com validação)
    // ═══════════════════════════════════════════════════════════════
    @Transactional
    public void deleteLivro(Long id) throws BusinessRuleException {
        Livro livro = livroRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Livro não encontrado"));

        // ✅ NOVO: Valida se há QUALQUER empréstimo (histórico inclusive)
        long totalEmprestimos = emprestimoRepository.countByLivroId(id);

        if (totalEmprestimos > 0) {
            throw new BusinessRuleException(
                    "Não é possível excluir o livro \"" + livro.getTitulo() +
                            "\" pois possui histórico de " + totalEmprestimos +
                            " empréstimo(s). Para preservar os registros, este livro não pode ser excluído."
            );
        }

        // ✅ Valida reservas (qualquer status)
        long totalReservas = reservaRepository.countByLivroId(id);

        if (totalReservas > 0) {
            throw new BusinessRuleException(
                    "Não é possível excluir o livro \"" + livro.getTitulo() +
                            "\" pois possui histórico de " + totalReservas +
                            " reserva(s). Para preservar os registros, este livro não pode ser excluído."
            );
        }

        // ✅ Sem histórico → pode deletar exemplares + livro
        exemplarService.deletarTodosExemplaresDoLivro(id);
        livroRepository.delete(livro);
    }

    // ═══════════════════════════════════════════════════════════════
    //  CONSULTAS (sem alteração)
    // ═══════════════════════════════════════════════════════════════
    public List<LivroResponse> listarTodos() {
        return livroRepository.findAll()
                .stream()
                .map(livro -> objectMapper.convertValue(livro, LivroResponse.class))
                .toList();
    }

    public LivroResponse buscarPorId(Long id) {
        Livro livro = livroRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Livro não encontrado"));
        return objectMapper.convertValue(livro, LivroResponse.class);
    }

    public List<LivroResponse> buscarPorTitulo(String titulo) {
        return livroRepository.buscarTitulo(titulo)
                .stream()
                .map(livro -> objectMapper.convertValue(livro, LivroResponse.class))
                .toList();
    }

    public List<LivroResponse> buscarPorAutor(String autor) {
        return livroRepository.buscarAutor(autor)
                .stream()
                .map(livro -> objectMapper.convertValue(livro, LivroResponse.class))
                .toList();
    }

    public List<LivroResponse> buscarPorGenero(String genero) {
        return livroRepository.buscarGenero(genero)
                .stream()
                .map(livro -> objectMapper.convertValue(livro, LivroResponse.class))
                .toList();
    }

    public List<LivroResponse> buscarPorCatalogacao(String catalogacao) {
        return livroRepository.buscarCatalogacao(catalogacao)
                .stream()
                .map(livro -> objectMapper.convertValue(livro, LivroResponse.class))
                .toList();
    }

    public List<LivroResponse> listarMaisPopulares(int limite) {
        return livroRepository.listarMaisPopulares(PageRequest.of(0, Math.max(1, limite)))
                .stream()
                .map(livro -> objectMapper.convertValue(livro, LivroResponse.class))
                .toList();
    }
}