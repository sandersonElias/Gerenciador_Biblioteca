package dev.sanderson.Back_End.dto.EmprestimoDtos;

import dev.sanderson.Back_End.dto.LivroDtos.LivroMinDto;
import lombok.Data;

import java.time.LocalDate;

@Data
public class EmprestimoHistoricoDto {
    private Long id;
    private LivroMinDto livro;
    private LocalDate dataEmprestimo;
    private LocalDate dataDevolvido;
    private Integer renovacoes;
    private String status;
}
