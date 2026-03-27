package dev.sanderson.Back_End.dto.ReservaDtos;

import dev.sanderson.Back_End.entity.type.StatusReserva;
import lombok.Data;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Data
public class ReservaRequest {

    private Long id;
    private LocalDate dataReserva;
    private LocalDate dataExpiracao;
    private LocalDate dataDisponivel;
    private StatusReserva status;
    private Long livroId;
    private Long userId;
}
