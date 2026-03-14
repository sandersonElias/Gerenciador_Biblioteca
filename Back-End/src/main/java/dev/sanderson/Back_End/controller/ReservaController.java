package dev.sanderson.Back_End.controller;

import dev.sanderson.Back_End.entity.Reserva;
import dev.sanderson.Back_End.entity.User;
import dev.sanderson.Back_End.service.ReservaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reserva")
@RequiredArgsConstructor
public class ReservaController {

    private final ReservaService reservaService;

    @PostMapping(
            value = "/{livroId}",
            consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE
    )
    public Reserva reservarLivro(
            @PathVariable Long livroId,
            @AuthenticationPrincipal User user
    ) {

        return reservaService.reservarLivro(livroId, user);

    }

    @DeleteMapping("/{reservaId}")
    public void cancelarReserva(@PathVariable Long reservaId) {

        reservaService.cancelarReserva(reservaId);

    }

    @GetMapping("/minhas")
    public List<Reserva> minhasReservas(
            @AuthenticationPrincipal User user
    ) {

        return reservaService.buscarReservasUsuario(user);

    }

    @GetMapping("/livro/{livroId}")
    public List<Reserva> reservasLivro(
            @PathVariable Long livroId
    ) {

        return reservaService.buscarReservasLivro(livroId);

    }

    @GetMapping
    public List<Reserva> listarReservas() {

        return reservaService.listarReservas();

    }
}