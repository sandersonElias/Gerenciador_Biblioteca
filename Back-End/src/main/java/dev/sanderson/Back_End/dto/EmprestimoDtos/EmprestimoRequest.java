package dev.sanderson.Back_End.dto.EmprestimoDtos;

import dev.sanderson.Back_End.entity.type.StatusEmprestimo;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmprestimoRequest {
    private Long id;
    private LocalDate dataEmprestimo;
    private LocalDate dataDevolucao;
    private LocalDate dataDevolvido;
    private Integer renovacoes;
    private StatusEmprestimo status;
    private Long livroId;
    private Long userId;
    private Long exemplarId;
}
