package dev.sanderson.Back_End.dto.EmprestimoDtos;

import dev.sanderson.Back_End.dto.LivroDtos.LivroMinDto;
import dev.sanderson.Back_End.dto.UserDtos.UserMinDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmprestimoResponse {
    private Long id;
    private LocalDate dataEmprestimo;
    private LocalDate dataDevolucao;
    private LocalDate dataDevolvido;
    private Integer renovacoes;
    private String status;
    private LivroMinDto livro;
    private UserMinDto user;
}
