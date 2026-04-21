package dev.sanderson.Back_End.service;

import dev.sanderson.Back_End.dto.SolicitacaoRenovacaoDtos.SolicitacaoRenovacaoResponse;
import dev.sanderson.Back_End.dto.SolicitacaoRenovacaoDtos.SolicitacaoPendenteDto;
import dev.sanderson.Back_End.entity.Emprestimo;
import dev.sanderson.Back_End.entity.SolicitacaoRenovacao;
import dev.sanderson.Back_End.entity.User;
import dev.sanderson.Back_End.entity.type.StatusEmprestimo;
import dev.sanderson.Back_End.entity.type.StatusSolicitacao;
import dev.sanderson.Back_End.repository.EmprestimoRepository;
import dev.sanderson.Back_End.repository.SolicitacaoRenovacaoRepository;
import dev.sanderson.Back_End.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class SolicitacaoRenovacaoService {

    private final SolicitacaoRenovacaoRepository solicitacaoRepository;
    private final EmprestimoRepository emprestimoRepository;
    private final UserRepository userRepository;

    @Transactional
    public SolicitacaoRenovacaoResponse solicitarRenovacao(Long emprestimoId, String userEmail) {
        Emprestimo emprestimo = emprestimoRepository.findById(emprestimoId)
                .orElseThrow(() -> new EntityNotFoundException("Empréstimo não encontrado"));

        if (!emprestimo.getUser().getEmail().equals(userEmail)) {
            throw new IllegalStateException("Este empréstimo não pertence a você");
        }

        validarSolicitacao(emprestimo);

        SolicitacaoRenovacao solicitacao = new SolicitacaoRenovacao();
        solicitacao.setEmprestimo(emprestimo);
        solicitacao.setSolicitante(emprestimo.getUser());
        solicitacao.setStatus(StatusSolicitacao.PENDENTE);

        SolicitacaoRenovacao salva = solicitacaoRepository.save(solicitacao);

        return converterParaResponse(salva);
    }

    public List<SolicitacaoPendenteDto> listarSolicitacoesPendentes() {
        List<SolicitacaoRenovacao> pendentes = solicitacaoRepository
                .findByStatusOrderByDataSolicitacaoAsc(StatusSolicitacao.PENDENTE);

        return pendentes.stream()
                .map(this::converterParaPendenteDto)
                .toList();
    }

    @Transactional
    public void aprovarSolicitacao(Long solicitacaoId, String funcionarioEmail) {
        SolicitacaoRenovacao solicitacao = solicitacaoRepository.findById(solicitacaoId)
                .orElseThrow(() -> new EntityNotFoundException("Solicitação não encontrada"));

        if (solicitacao.getStatus() != StatusSolicitacao.PENDENTE) {
            throw new IllegalStateException("Esta solicitação já foi processada");
        }

        User funcionario = userRepository.findByEmail(funcionarioEmail)
                .orElseThrow(() -> new EntityNotFoundException("Funcionário não encontrado"));

        Emprestimo emprestimo = solicitacao.getEmprestimo();
        emprestimo.setRenovacoes(Objects.requireNonNullElse(emprestimo.getRenovacoes(), 0) + 1);
        emprestimo.setDataDevolucao(Objects.requireNonNullElse(emprestimo.getDataDevolucao(), LocalDateTime.now().toLocalDate()).plusDays(7));
        emprestimo.setStatus(StatusEmprestimo.ATIVO);

        emprestimoRepository.save(emprestimo);

        solicitacao.setStatus(StatusSolicitacao.APROVADA);
        solicitacao.setFuncionarioResponsavel(funcionario);

        solicitacaoRepository.save(solicitacao);
    }

    @Transactional
    public void rejeitarSolicitacao(Long solicitacaoId, String funcionarioEmail, String observacao) {
        SolicitacaoRenovacao solicitacao = solicitacaoRepository.findById(solicitacaoId)
                .orElseThrow(() -> new EntityNotFoundException("Solicitação não encontrada"));

        if (solicitacao.getStatus() != StatusSolicitacao.PENDENTE) {
            throw new IllegalStateException("Esta solicitação já foi processada");
        }

        User funcionario = userRepository.findByEmail(funcionarioEmail)
                .orElseThrow(() -> new EntityNotFoundException("Funcionário não encontrado"));

        solicitacao.setStatus(StatusSolicitacao.REJEITADA);
        solicitacao.setFuncionarioResponsavel(funcionario);
        solicitacao.setObservacao(observacao);

        solicitacaoRepository.save(solicitacao);
    }

    private void validarSolicitacao(Emprestimo emprestimo) {
        if (emprestimo.getStatus() != StatusEmprestimo.ATIVO) {
            throw new IllegalStateException("Este empréstimo não está ativo");
        }

        Integer renovacoes = Objects.requireNonNullElse(emprestimo.getRenovacoes(), 0);
        if (renovacoes >= 3) {
            throw new IllegalStateException("Limite de renovações atingido (3/3)");
        }

        if (emprestimo.getDataDevolucao() != null &&
                emprestimo.getDataDevolucao().isBefore(java.time.LocalDate.now())) {
            throw new IllegalStateException("Não é possível renovar empréstimos atrasados");
        }

        if (solicitacaoRepository.existsByEmprestimoIdAndStatus(emprestimo.getId(), StatusSolicitacao.PENDENTE)) {
            throw new IllegalStateException("Já existe uma solicitação pendente para este empréstimo");
        }
    }

    private SolicitacaoRenovacaoResponse converterParaResponse(SolicitacaoRenovacao s) {
        SolicitacaoRenovacaoResponse dto = new SolicitacaoRenovacaoResponse();
        dto.setId(s.getId());
        dto.setEmprestimoId(s.getEmprestimo().getId());
        dto.setLivroTitulo(s.getEmprestimo().getLivro().getTitulo());
        dto.setStatus(s.getStatus().name());
        dto.setDataSolicitacao(s.getDataSolicitacao());
        return dto;
    }

    private SolicitacaoPendenteDto converterParaPendenteDto(SolicitacaoRenovacao s) {
        SolicitacaoPendenteDto dto = new SolicitacaoPendenteDto();
        dto.setId(s.getId());
        dto.setEmprestimoId(s.getEmprestimo().getId());
        dto.setLivroTitulo(s.getEmprestimo().getLivro().getTitulo());
        dto.setSolicitanteNome(s.getSolicitante().getName());
        dto.setSolicitanteEmail(s.getSolicitante().getEmail());
        dto.setDataEmprestimo(s.getEmprestimo().getDataEmprestimo());
        dto.setDataDevolucaoPrevista(s.getEmprestimo().getDataDevolucao());
        dto.setRenovacoesRealizadas(Objects.requireNonNullElse(s.getEmprestimo().getRenovacoes(), 0));
        dto.setDataSolicitacao(s.getDataSolicitacao());
        return dto;
    }
}
