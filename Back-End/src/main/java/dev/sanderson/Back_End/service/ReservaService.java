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
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservaService {

    private final LivroRepository livroRepository;
    private final UserRepository userRepository;
    private final ReservaRepository reservaRepository;
    private final ObjectMapper objectMapper;

    private ReservaResponse toResponse(Reserva r) {

        ReservaResponse dto = new ReservaResponse();

        dto.setId(r.getId());
        dto.setDataReserva(r.getDataReserva());
        dto.setDataDisponivel(r.getDataDisponivel());
        dto.setDataExpiracao(r.getDataExpiracao());
        dto.setStatus(r.getStatus().name());

        // USER
        if (r.getUser() != null) {
            UserMinDto userDto = new UserMinDto();
            userDto.setName(r.getUser().getName());
            userDto.setEmail(r.getUser().getEmail());
            dto.setUser(userDto);
        }

        // LIVRO
        if (r.getLivro() != null) {
            LivroMinDto livroDto = new LivroMinDto();
            livroDto.setId(r.getLivro().getId());
            livroDto.setTitulo(r.getLivro().getTitulo());
            livroDto.setUrlImg(r.getLivro().getUrlImg());
            dto.setLivro(livroDto);
        }

        return dto;
    }

    private ReservaRequest toReservaMinDto(Reserva reserva){
        ReservaRequest dto = new ReservaRequest();
        dto.setId(reserva.getId());
        dto.setDataReserva(reserva.getDataReserva());
        dto.setDataDisponivel(reserva.getDataDisponivel());
        dto.setDataExpiracao(reserva.getDataExpiracao());
        dto.setStatus(reserva.getStatus());
        dto.setLivroId(reserva.getLivro().getId());
        dto.setUserId(reserva.getUser().getId());

        return dto;
    }

    //reservar livro
    public ReservaResponse reservarLivro(ReservaRequest dto) {

        Livro livro = livroRepository.findById(dto.getLivroId())
                .orElseThrow(() -> new EntityNotFoundException("Livro não encontrado"));

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));

        boolean jaReservou = reservaRepository
                .existsByLivroAndUserAndStatus(livro, user, StatusReserva.ATIVA);

        if (jaReservou) {
            throw new RuntimeException("Usuário já possui reserva ativa");
        }

        Reserva reserva = new Reserva();

        reserva.setLivro(livro);
        reserva.setUser(user);
        reserva.setDataReserva(LocalDate.now());

        if (livro.getQuantidadeDisponivel() > 0) {
            reserva.setStatus(StatusReserva.DISPONIVEL);
            reserva.setDataDisponivel(LocalDate.now());
            reserva.setDataExpiracao(LocalDate.now().plusDays(1));
        } else {
            reserva.setStatus(StatusReserva.ATIVA);
        }

        Reserva salva = reservaRepository.save(reserva);

        return objectMapper.convertValue(salva, ReservaResponse.class);
    }

    //Cancelar reserva
    public void cancelarReserva(Long reservaId) {

        Reserva reserva = reservaRepository.findById(reservaId)
                .orElseThrow(() -> new EntityNotFoundException("Reserva não encontrado"));
        reserva.setStatus(StatusReserva.CANCELADA);
        reservaRepository.save(reserva);
    }

    // EXPIRAR (JOB)
    @Scheduled(cron = "0 0 * * * *")
    public void expirarReservas() {

        List<Reserva> reservas =
                reservaRepository.findByStatus(StatusReserva.DISPONIVEL);

        for (Reserva r : reservas) {

            if (r.getDataExpiracao() != null &&
                    LocalDate.now().isAfter(r.getDataExpiracao())) {

                r.setStatus(StatusReserva.EXPIRADA);

            }

        }
    }

    //Buscar por nome do usuario
    public List<ReservaResponse> buscarPorUser(String name){
        return reservaRepository.buscarUser(name)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    //Buscar por email do usuario
    public List<ReservaResponse> buscaPorUserEmail(String email){
        return  reservaRepository.buscarUserEmail(email)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    //Buscar por Livro (Id)
    public List<ReservaResponse> buscarReservasLivro(Long id) {
        return reservaRepository.buscarReservasPorLivro(id)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<ReservaResponse> listarReservas() {
        return reservaRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }
}