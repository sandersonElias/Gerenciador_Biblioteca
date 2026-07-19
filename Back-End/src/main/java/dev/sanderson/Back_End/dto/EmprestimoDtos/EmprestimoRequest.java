package dev.sanderson.Back_End.dto.EmprestimoDtos;

import jakarta.validation.constraints.NotNull;
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
    private String status;

    @NotNull(message = "ID do livro e obrigatorio")
    private Long livroId;

    @NotNull(message = "ID do usuario e obrigatorio")
    private Long userId;

    private Long exemplarId;
}