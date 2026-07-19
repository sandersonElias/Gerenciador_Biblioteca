package dev.sanderson.Back_End.dto.ReservaDtos;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ReservaRequest {

    private Long id;
    private LocalDate dataReserva;
    private LocalDate dataExpiracao;
    private LocalDate dataDisponivel;
    private String status;

    @NotNull(message = "ID do livro e obrigatorio")
    private Long livroId;

    @NotNull(message = "ID do usuario e obrigatorio")
    private Long userId;
}