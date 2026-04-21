package dev.sanderson.Back_End.dto.SolicitacaoRenovacaoDtos;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class SolicitacaoPendenteDto {
    private Long id;
    private Long emprestimoId;
    private String livroTitulo;
    private String solicitanteNome;
    private String solicitanteEmail;
    private LocalDate dataEmprestimo;
    private LocalDate dataDevolucaoPrevista;
    private Integer renovacoesRealizadas;
    private LocalDateTime dataSolicitacao;
}
