package dev.sanderson.Back_End.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.sanderson.Back_End.dto.EmprestimoDtos.EmprestimoHistoricoDto;
import dev.sanderson.Back_End.dto.EmprestimoDtos.EmprestimoRequest;
import dev.sanderson.Back_End.dto.EmprestimoDtos.EmprestimoResponse;
import dev.sanderson.Back_End.dto.EmprestimoDtos.EmprestimosAtivoDto;
import dev.sanderson.Back_End.dto.EmprestimoDtos.MeusEmprestimosResponse;
import dev.sanderson.Back_End.dto.LivroDtos.LivroMinDto;
import dev.sanderson.Back_End.dto.UserDtos.UserMinDto;
import dev.sanderson.Back_End.entity.Emprestimo;
import dev.sanderson.Back_End.entity.Livro;
import dev.sanderson.Back_End.entity.User;
import dev.sanderson.Back_End.entity.type.StatusEmprestimo;
import dev.sanderson.Back_End.repository.EmprestimoRepository;
import dev.sanderson.Back_End.repository.LivroRepository;
import dev.sanderson.Back_End.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EmprestimoService {

    private final EmprestimoRepository emprestimoRepository;
    private final UserRepository userRepository;
    private final LivroRepository livroRepository;
    private final ObjectMapper objectMapper;

    // ── Mapper ────────────────────────────────────────────────────────────────

    private EmprestimoResponse toResponse(Emprestimo e) {
        EmprestimoResponse dto = new EmprestimoResponse();
        dto.setId(e.getId());
        dto.setDataEmprestimo(e.getDataEmprestimo());
        dto.setDataDevolucao(e.getDataDevolucao());
        dto.setDataDevolvido(e.getDataDevolvido());
        dto.setRenovacoes(e.getRenovacoes());
        dto.setStatus(e.getStatus().name());

        if (e.getUser() != null) {
            UserMinDto userDto = new UserMinDto();
            userDto.setName(e.getUser().getName());
            userDto.setEmail(e.getUser().getEmail());
            dto.setUser(userDto);
        }

        if (e.getLivro() != null) {
            LivroMinDto livroDto = new LivroMinDto();
            livroDto.setId(e.getLivro().getId());
            livroDto.setTitulo(e.getLivro().getTitulo());
            dto.setLivro(livroDto);
        }

        return dto;
    }

    // ── Criar empréstimo ──────────────────────────────────────────────────────

    @Transactional
    public EmprestimoResponse insertEmprestimo(EmprestimoRequest dto) {
        Livro livro = livroRepository.findById(dto.getLivroId())
                .orElseThrow(() -> new EntityNotFoundException("Livro não encontrado"));
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));

        // ✅ Verifica quantidadeDisponivel — campo correto (era contarEmprestimosPendentes com status 'PENDENTE' que nunca existe)
        int disponiveis = livro.getQuantidadeDisponivel() != null ? livro.getQuantidadeDisponivel() : 0;
        if (disponiveis < 1) {
            throw new IllegalStateException("Não há exemplares disponíveis para empréstimo.");
        }

        Emprestimo emp = new Emprestimo();
        emp.setUser(user);
        emp.setLivro(livro);

        LocalDate hoje = dto.getDataEmprestimo() != null ? dto.getDataEmprestimo() : LocalDate.now();
        emp.setDataEmprestimo(hoje);

        LocalDate devolucao = dto.getDataDevolucao() != null ? dto.getDataDevolucao() : hoje.plusDays(7);
        emp.setDataDevolucao(devolucao);

        // Status sempre ATIVO ao criar — nunca deixar o front-end definir o status
        emp.setStatus(StatusEmprestimo.ATIVO);
        emp.setRenovacoes(0);

        // ✅ Decrementa quantidade disponível e incrementa contador ao emprestar
        livro.setQuantidadeDisponivel(disponiveis - 1);
        livro.setContadorEmprestimos(
                Objects.requireNonNullElse(livro.getContadorEmprestimos(), 0) + 1
        );

        livroRepository.save(livro);
        return toResponse(emprestimoRepository.save(emp));
    }

    // ── Devolver empréstimo ───────────────────────────────────────────────────

    @Transactional
    public void devolverEmprestimo(Long id) {
        Emprestimo emp = emprestimoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Empréstimo não encontrado"));

        if (emp.getStatus() == StatusEmprestimo.DEVOLVIDO) {
            throw new IllegalStateException("Empréstimo já foi devolvido.");
        }

        emp.setStatus(StatusEmprestimo.DEVOLVIDO);
        emp.setDataDevolvido(LocalDate.now());

        // ✅ Incrementa quantidade disponível ao devolver
        Livro livro = emp.getLivro();
        livro.setQuantidadeDisponivel(
                Objects.requireNonNullElse(livro.getQuantidadeDisponivel(), 0) + 1
        );

        livroRepository.save(livro);
        emprestimoRepository.save(emp);
    }

    // ── Renovar empréstimo ────────────────────────────────────────────────────

    @Transactional
    public EmprestimoResponse renovarEmprestimo(Long id) {
        Emprestimo emp = emprestimoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Empréstimo não encontrado"));

        if (emp.getStatus() == StatusEmprestimo.DEVOLVIDO) {
            throw new IllegalStateException("Empréstimo já devolvido; renovação não permitida.");
        }

        emp.setRenovacoes(Objects.requireNonNullElse(emp.getRenovacoes(), 0) + 1);
        emp.setDataDevolucao(
                Objects.requireNonNullElse(emp.getDataDevolucao(), LocalDate.now()).plusDays(7)
        );
        emp.setStatus(StatusEmprestimo.ATIVO);

        return toResponse(emprestimoRepository.save(emp));
    }

    // ── JOB: marcar ATRASADO (roda todo dia à meia-noite) ────────────────────

    // ✅ Job novo — varre todos ATIVO e marca ATRASADO quando passa da data de devolução
    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void marcarEmprestimosAtrasados() {
        List<Emprestimo> ativos = emprestimoRepository.buscarStatus(StatusEmprestimo.ATIVO);

        List<Emprestimo> atrasados = ativos.stream()
                .filter(e -> e.getDataDevolucao() != null
                        && e.getDataDevolucao().isBefore(LocalDate.now()))
                .toList();

        atrasados.forEach(e -> e.setStatus(StatusEmprestimo.ATRASADO));
        emprestimoRepository.saveAll(atrasados);
    }

    // ── Listagens e buscas ────────────────────────────────────────────────────

    public List<EmprestimoResponse> todosEmprestimos() {
        return emprestimoRepository.findAll().stream().map(this::toResponse).toList();
    }

    public EmprestimoResponse buscarId(Long id) {
        return toResponse(emprestimoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Empréstimo não encontrado")));
    }

    public List<EmprestimoResponse> buscarPorUser(String nome) {
        return emprestimoRepository.buscarUser(nome).stream().map(this::toResponse).toList();
    }

    public List<EmprestimoResponse> buscarPorLivro(String titulo) {
        return emprestimoRepository.buscarLivro(titulo).stream().map(this::toResponse).toList();
    }

    public List<EmprestimoResponse> buscarPorLivroRenovacao(String titulo) {
        return emprestimoRepository.buscarRenovacaoLivro(titulo).stream().map(this::toResponse).toList();
    }

    public List<EmprestimoResponse> buscarPorUserRenovacao(String nome) {
        return emprestimoRepository.buscarRenovacaoUser(nome).stream().map(this::toResponse).toList();
    }

    public List<EmprestimoResponse> buscarPorStatus(StatusEmprestimo status) {
        return emprestimoRepository.buscarStatus(status).stream().map(this::toResponse).toList();
    }

    public List<EmprestimoResponse> buscarDevolucaoDoDia(LocalDate hoje) {
        return emprestimoRepository.buscarDevolucaoDoDia(hoje).stream().map(this::toResponse).toList();
    }

    // ── Minha conta (aluno logado) ────────────────────────────────────────────

    public MeusEmprestimosResponse obterMeusEmprestimos(String email) {
        MeusEmprestimosResponse response = new MeusEmprestimosResponse();

        // ✅ Busca ATIVO **ou** ATRASADO — os dois são "empréstimo em curso"
        Optional<Emprestimo> ativoOpt = emprestimoRepository
                .findByUserEmailAndStatusIn(email,
                        List.of(StatusEmprestimo.ATIVO, StatusEmprestimo.ATRASADO));

        response.setEmprestimosAtivo(ativoOpt.map(this::converterParaAtivoDto).orElse(null));

        response.setHistorico(
                emprestimoRepository
                        .findTop4ByUserEmailAndStatusOrderByDataDevolvidoDesc(email, StatusEmprestimo.DEVOLVIDO)
                        .stream().map(this::converterParaHistoricoDto).toList()
        );

        return response;
    }

    // ── Conversores privados ──────────────────────────────────────────────────

    private EmprestimosAtivoDto converterParaAtivoDto(Emprestimo e) {
        EmprestimosAtivoDto dto = new EmprestimosAtivoDto();
        dto.setId(e.getId());
        dto.setDataEmprestimo(e.getDataEmprestimo());
        dto.setDataDevolucao(e.getDataDevolucao());
        dto.setRenovacoes(e.getRenovacoes());
        dto.setStatus(e.getStatus().name());
        dto.setDiasRestantes(calcularDiasRestantes(e.getDataDevolucao()));
        dto.setPodeRenovar(podeRenovar(e));

        if (e.getLivro() != null) {
            LivroMinDto livroDto = new LivroMinDto();
            livroDto.setId(e.getLivro().getId());
            livroDto.setTitulo(e.getLivro().getTitulo());
            livroDto.setUrlImg(e.getLivro().getUrlImg());
            dto.setLivro(livroDto);
        }
        return dto;
    }

    private EmprestimoHistoricoDto converterParaHistoricoDto(Emprestimo e) {
        EmprestimoHistoricoDto dto = new EmprestimoHistoricoDto();
        dto.setId(e.getId());
        dto.setDataEmprestimo(e.getDataEmprestimo());
        dto.setDataDevolvido(e.getDataDevolvido());
        dto.setRenovacoes(e.getRenovacoes());
        dto.setStatus(e.getStatus().name());

        if (e.getLivro() != null) {
            LivroMinDto livroDto = new LivroMinDto();
            livroDto.setId(e.getLivro().getId());
            livroDto.setTitulo(e.getLivro().getTitulo());
            livroDto.setUrlImg(e.getLivro().getUrlImg());
            dto.setLivro(livroDto);
        }
        return dto;
    }

    private Long calcularDiasRestantes(LocalDate dataDevolucao) {
        if (dataDevolucao == null) return 0L;
        long dias = ChronoUnit.DAYS.between(LocalDate.now(), dataDevolucao);
        return dias > 0 ? dias : 0;
    }

    private Boolean podeRenovar(Emprestimo e) {
        if (e == null) return false;
        if (Objects.requireNonNullElse(e.getRenovacoes(), 0) >= 3) return false;
        // ATRASADO nunca pode renovar
        if (e.getStatus() == StatusEmprestimo.ATRASADO) return false;
        if (e.getStatus() != StatusEmprestimo.ATIVO) return false;
        if (e.getDataDevolucao() != null && e.getDataDevolucao().isBefore(LocalDate.now())) return false;
        return true;
    }
}