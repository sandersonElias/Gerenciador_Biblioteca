package dev.sanderson.Back_End.dto.EmprestimoDtos;

import dev.sanderson.Back_End.dto.LivroDtos.LivroMinDto;
import lombok.Data;

import java.time.LocalDate;

@Data
public class EmprestimosAtivoDto {
    private Long id;
    private LivroMinDto livro;
    private LocalDate dataEmprestimo;
    private LocalDate dataDevolucao;
    private Integer renovacoes;
    private String status;
    private Long diasRestantes;
    private Boolean podeRenovar;
}
