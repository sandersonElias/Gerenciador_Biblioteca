package dev.sanderson.Back_End.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.sanderson.Back_End.dto.LivroDtos.LivroMinDto;
import dev.sanderson.Back_End.dto.ReservaDtos.ReservaRequest;
import dev.sanderson.Back_End.dto.ReservaDtos.ReservaResponse;
import dev.sanderson.Back_End.dto.UserDtos.UserMinDto;
import dev.sanderson.Back_End.entity.Livro;
import dev.sanderson.Back_End.entity.Reserva;
import dev.sanderson.Back_End.entity.User;
import dev.sanderson.Back_End.entity.type.StatusReserva;
import dev.sanderson.Back_End.repository.LivroRepository;
import dev.sanderson.Back_End.repository.ReservaRepository;
import dev.sanderson.Back_End.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservaService {

    private final LivroRepository livroRepository;
    private final UserRepository userRepository;
    private final ReservaRepository reservaRepository;
    private final ObjectMapper objectMapper;

    // ── Mapper ────────────────────────────────────────────────────────────────

    private ReservaResponse toResponse(Reserva r) {
        ReservaResponse dto = new ReservaResponse();
        dto.setId(r.getId());
        dto.setDataReserva(r.getDataReserva());
        dto.setDataDisponivel(r.getDataDisponivel());
        dto.setDataExpiracao(r.getDataExpiracao());
        dto.setStatus(r.getStatus().name());

        if (r.getUser() != null) {
            UserMinDto userDto = new UserMinDto();
            userDto.setName(r.getUser().getName());
            userDto.setEmail(r.getUser().getEmail());
            dto.setUser(userDto);
        }

        if (r.getLivro() != null) {
            LivroMinDto livroDto = new LivroMinDto();
            livroDto.setId(r.getLivro().getId());
            livroDto.setTitulo(r.getLivro().getTitulo());
            livroDto.setUrlImg(r.getLivro().getUrlImg());
            dto.setLivro(livroDto);
        }

        return dto;
    }

    // ── Reservar livro ────────────────────────────────────────────────────────

    @Transactional
    public ReservaResponse reservarLivro(ReservaRequest dto) {
        Livro livro = livroRepository.findById(dto.getLivroId())
                .orElseThrow(() -> new EntityNotFoundException("Livro não encontrado"));
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));

        boolean jaReservou = reservaRepository
                .existsByLivroAndUserAndStatus(livro, user, StatusReserva.ATIVA);
        if (jaReservou) {
            throw new RuntimeException("Usuário já possui reserva ativa para este livro");
        }

        Reserva reserva = new Reserva();
        reserva.setLivro(livro);
        reserva.setUser(user);
        reserva.setDataReserva(LocalDate.now());

        int disponiveis = livro.getQuantidadeDisponivel() != null ? livro.getQuantidadeDisponivel() : 0;

        if (disponiveis > 0) {
            // Livro disponível: reserva já fica DISPONIVEL para retirada imediata
            reserva.setStatus(StatusReserva.DISPONIVEL);
            reserva.setDataDisponivel(LocalDate.now());
            reserva.setDataExpiracao(LocalDate.now().plusDays(1));

            // ✅ Decrementa quantidade disponível ao reservar um exemplar disponível
            livro.setQuantidadeDisponivel(disponiveis - 1);
            livroRepository.save(livro);
        } else {
            // Livro sem exemplares: entra na fila de espera
            reserva.setStatus(StatusReserva.ATIVA);
        }

        return toResponse(reservaRepository.save(reserva));
    }

    // ── Cancelar reserva ──────────────────────────────────────────────────────

    @Transactional
    public void cancelarReserva(Long reservaId) {
        Reserva reserva = reservaRepository.findById(reservaId)
                .orElseThrow(() -> new EntityNotFoundException("Reserva não encontrada"));

        // ✅ Se a reserva estava DISPONIVEL (exemplar separado), devolve ao estoque
        if (reserva.getStatus() == StatusReserva.DISPONIVEL) {
            Livro livro = reserva.getLivro();
            livro.setQuantidadeDisponivel(
                    (livro.getQuantidadeDisponivel() != null ? livro.getQuantidadeDisponivel() : 0) + 1
            );
            livroRepository.save(livro);
        }

        reserva.setStatus(StatusReserva.CANCELADA);
        reservaRepository.save(reserva);
    }

    // ── JOB: expirar reservas DISPONIVEL não retiradas (roda a cada hora) ────

    @Scheduled(cron = "0 0 * * * *")
    @Transactional
    public void expirarReservas() {
        List<Reserva> disponiveis = reservaRepository.findByStatus(StatusReserva.DISPONIVEL);

        List<Reserva> expiradas = disponiveis.stream()
                .filter(r -> r.getDataExpiracao() != null
                        && LocalDate.now().isAfter(r.getDataExpiracao()))
                .toList();

        expiradas.forEach(r -> {
            r.setStatus(StatusReserva.EXPIRADA);

            // ✅ Devolve o exemplar ao estoque quando a reserva expira
            Livro livro = r.getLivro();
            livro.setQuantidadeDisponivel(
                    (livro.getQuantidadeDisponivel() != null ? livro.getQuantidadeDisponivel() : 0) + 1
            );
            livroRepository.save(livro);
        });

        // ✅ Salva as reservas expiradas (estava faltando o saveAll)
        reservaRepository.saveAll(expiradas);
    }

    // ── Buscas ────────────────────────────────────────────────────────────────

    public List<ReservaResponse> buscarPorUser(String name) {
        return reservaRepository.buscarUser(name).stream().map(this::toResponse).toList();
    }

    public List<ReservaResponse> buscaPorUserEmail(String email) {
        return reservaRepository.buscarUserEmail(email).stream().map(this::toResponse).toList();
    }

    public List<ReservaResponse> buscarReservasLivro(Long id) {
        return reservaRepository.buscarReservasPorLivro(id).stream().map(this::toResponse).toList();
    }

    public List<ReservaResponse> listarReservas() {
        return reservaRepository.findAll().stream().map(this::toResponse).toList();
    }
}