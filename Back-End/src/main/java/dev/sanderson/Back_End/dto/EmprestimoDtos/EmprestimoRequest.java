package dev.sanderson.Back_End.dto.EmprestimoDtos;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class EmprestimoRequest {
    private Long id;
    private LocalDate dataEmprestimo;
    private LocalDate dataDevolucao;
    private LocalDate dataDevolvido;
    private Integer renovacoes;
    private String status;
    private Long livroId;
    private Long userId;
}
