package dev.sanderson.Back_End.controller;

import dev.sanderson.Back_End.dto.ReservaDtos.ReservaRequest;
import dev.sanderson.Back_End.dto.ReservaDtos.ReservaResponse;
import dev.sanderson.Back_End.service.ReservaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reserva")
@RequiredArgsConstructor
public class ReservaController {

    private final ReservaService reservaService;

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ReservaResponse> reservarLivro(@Valid @RequestBody ReservaRequest reserva) {
        ReservaResponse dto = reservaService.reservarLivro(reserva);
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    @DeleteMapping("/{reservaId}")
    public ResponseEntity<Void> cancelarReserva(@PathVariable Long reservaId) {
        reservaService.cancelarReserva(reservaId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/username/{name}")
    public ResponseEntity<List<ReservaResponse>> buscarUserName (@PathVariable String name){
        return ResponseEntity.ok(reservaService.buscarPorUser(name));
    }

    @GetMapping("/useremail/{email}")
    public ResponseEntity<List<ReservaResponse>> buscarUserEmail (@PathVariable String email){
        return ResponseEntity.ok(reservaService.buscaPorUserEmail(email));
    }

    @GetMapping("/livro/{livroId}")
    public ResponseEntity<List<ReservaResponse>> reservasLivro(@PathVariable Long livroId) {
        return ResponseEntity.ok(reservaService.buscarReservasLivro(livroId));
    }

    @GetMapping("/todos")
    public ResponseEntity<List<ReservaResponse>> listarReservas() {
        List<ReservaResponse> reserva = reservaService.listarReservas();
        return ResponseEntity.ok(reserva);
    }
}