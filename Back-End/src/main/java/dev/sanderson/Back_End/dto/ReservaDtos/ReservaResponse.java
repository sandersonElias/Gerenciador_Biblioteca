package dev.sanderson.Back_End.dto.ReservaDtos;

import dev.sanderson.Back_End.dto.LivroDtos.LivroMinDto;
import dev.sanderson.Back_End.dto.UserDtos.UserMinDto;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class ReservaResponse {
    private Long id;
    private LocalDate dataReserva;
    private LocalDate dataExpiracao;
    private LocalDate dataDisponivel;
    private String status;
    private LivroMinDto livro;
    private UserMinDto user;
}
