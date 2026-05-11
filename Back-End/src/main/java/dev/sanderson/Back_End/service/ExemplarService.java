package dev.sanderson.Back_End.service;

import dev.sanderson.Back_End.dto.ExemplarDtos.ExemplarResponse;
import dev.sanderson.Back_End.entity.Exemplar;
import dev.sanderson.Back_End.entity.Livro;
import dev.sanderson.Back_End.entity.type.StatusExemplar;
import dev.sanderson.Back_End.repository.ExemplarRepository;
import dev.sanderson.Back_End.repository.LivroRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExemplarService {

    private final ExemplarRepository exemplarRepository;
    private final LivroRepository livroRepository;

    // ── Mapper ────────────────────────────────────────────────────────────────

    private ExemplarResponse toResponse(Exemplar ex) {
        ExemplarResponse dto = new ExemplarResponse();
        dto.setId(ex.getId());
        dto.setCodigo(ex.getCodigo());
        dto.setStatus(ex.getStatus().name());
        if (ex.getLivro() != null) {
            dto.setLivroId(ex.getLivro().getId());
            dto.setLivroTitulo(ex.getLivro().getTitulo());
        }
        return dto;
    }

    // ── Gerar próximo código (001, 002, ...) ──────────────────────────────────

    private String gerarProximoCodigo(Long livroId) {
        int proximo = exemplarRepository.findMaxCodigoByLivroId(livroId)
                .map(max -> max + 1)
                .orElse(1);
        return String.format("%03d", proximo);
    }

    // ── Criar exemplares ao cadastrar livro ───────────────────────────────────

    @Transactional
    public void criarExemplaresParaLivro(Livro livro) {
        int total = livro.getTotalExemplares() != null ? livro.getTotalExemplares() : 0;
        List<Exemplar> exemplares = new ArrayList<>();
        for (int i = 1; i <= total; i++) {
            Exemplar ex = new Exemplar();
            ex.setCodigo(String.format("%03d", i));
            ex.setStatus(StatusExemplar.DISPONIVEL);
            ex.setLivro(livro);
            exemplares.add(ex);
        }
        exemplarRepository.saveAll(exemplares);
    }

    // ── Adicionar mais exemplares (quando totalExemplares aumenta) ────────────

    @Transactional
    public List<ExemplarResponse> adicionarExemplares(Long livroId, int quantidade) {
        Livro livro = livroRepository.findById(livroId)
                .orElseThrow(() -> new EntityNotFoundException("Livro não encontrado"));

        List<Exemplar> novos = new ArrayList<>();
        for (int i = 0; i < quantidade; i++) {
            Exemplar ex = new Exemplar();
            ex.setCodigo(gerarProximoCodigo(livroId));
            ex.setStatus(StatusExemplar.DISPONIVEL);
            ex.setLivro(livro);
            novos.add(exemplarRepository.save(ex));
        }
        return novos.stream().map(this::toResponse).toList();
    }

    // ── Ajustar exemplares ao atualizar livro (se total aumentou) ────────────

    @Transactional
    public void ajustarExemplares(Livro livro, int totalAnterior) {
        int novoTotal = livro.getTotalExemplares() != null ? livro.getTotalExemplares() : 0;
        int diferenca = novoTotal - totalAnterior;
        if (diferenca > 0) {
            adicionarExemplares(livro.getId(), diferenca);
        }
    }

    @Transactional
    public void deletarTodosExemplaresDoLivro(Long livroId) {
        exemplarRepository.deleteAllByLivroId(livroId);
    }

    // ── Listagens ─────────────────────────────────────────────────────────────

    public List<ExemplarResponse> listarPorLivro(Long livroId) {
        return exemplarRepository.findByLivroIdOrderByCodigo(livroId)
                .stream().map(this::toResponse).toList();
    }

    public List<ExemplarResponse> listarDisponiveisPorLivro(Long livroId) {
        return exemplarRepository.findByLivroIdAndStatusOrderByCodigo(livroId, StatusExemplar.DISPONIVEL)
                .stream().map(this::toResponse).toList();
    }

    public ExemplarResponse sugerirExemplar(Long livroId) {
        return exemplarRepository.findFirstByLivroIdAndStatusOrderByCodigo(livroId, StatusExemplar.DISPONIVEL)
                .map(this::toResponse)
                .orElseThrow(() -> new IllegalStateException("Nenhum exemplar disponível para este livro"));
    }
}