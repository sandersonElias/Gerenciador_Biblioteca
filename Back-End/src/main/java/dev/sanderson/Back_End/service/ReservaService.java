package dev.sanderson.Back_End.service;

import dev.sanderson.Back_End.entity.Livro;
import dev.sanderson.Back_End.entity.Reserva;
import dev.sanderson.Back_End.entity.User;
import dev.sanderson.Back_End.entity.type.StatusReserva;
import dev.sanderson.Back_End.repository.LivroRepository;
import dev.sanderson.Back_End.repository.ReservaRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReservaService {

    private final LivroRepository livroRepository;
    private final ReservaRepository reservaRepository;

    @Transactional
    public Reserva reservarLivro(Long livroId, User user) {

        Livro livro = livroRepository.findById(livroId)
                .orElseThrow();

        if (livro.getQuantidadeDisponivel() > 0) {
            throw new RuntimeException("Livro disponível para empréstimo");
        }

        boolean jaReservou = reservaRepository
                .existsByLivroAndUserAndStatus(livro, user, StatusReserva.ATIVA);

        if (jaReservou) {
            throw new RuntimeException("Usuário já possui reserva ativa");
        }

        Reserva reserva = new Reserva();

        reserva.setLivro(livro);
        reserva.setUser(user);
        reserva.setDataReserva(LocalDate.now());
        reserva.setStatus(StatusReserva.ATIVA);

        return reservaRepository.save(reserva);
    }

    @Transactional
    public void processarReserva(Livro livro) {

        reservaRepository.buscarPrimeiraReserva(livro, StatusReserva.ATIVA)
                .ifPresent(reserva -> {

                    reserva.setStatus(StatusReserva.DISPONIVEL);
                    reserva.setDataDisponivel(LocalDate.now());
                    reserva.setDataExpiracao(LocalDate.now().plusDays(1));

                    reservaRepository.save(reserva);

                });

    }

    public void validarReserva(Livro livro, User user) {

        Optional<Reserva> reserva =
                reservaRepository.buscarPrimeiraReserva(
                        livro,
                        StatusReserva.DISPONIVEL
                );

        if (reserva.isPresent()
                && !reserva.get().getUser().getId().equals(user.getId())) {

            throw new RuntimeException("Livro reservado para outro usuário");

        }

    }

    public void concluirReserva(Livro livro, User user) {

        Optional<Reserva> reserva =
                reservaRepository.buscarPrimeiraReserva(
                        livro,
                        StatusReserva.DISPONIVEL
                );

        if (reserva.isPresent()
                && reserva.get().getUser().getId().equals(user.getId())) {

            Reserva r = reserva.get();

            r.setStatus(StatusReserva.CONCLUIDA);

            reservaRepository.save(r);

        }

    }

    @Transactional
    public void cancelarReserva(Long reservaId) {

        Reserva reserva = reservaRepository.findById(reservaId)
                .orElseThrow();

        reserva.setStatus(StatusReserva.CANCELADA);

    }

    @Scheduled(cron = "0 0 * * * *")
    @Transactional
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

    public List<Reserva> buscarReservasUsuario(User user) {

        return reservaRepository.findByUser(user);

    }

    public List<Reserva> buscarReservasLivro(Long livroId) {

        return reservaRepository.buscarReservasPorLivro(livroId);

    }

    public List<Reserva> listarReservas() {

        return reservaRepository.findAll();

    }
}
