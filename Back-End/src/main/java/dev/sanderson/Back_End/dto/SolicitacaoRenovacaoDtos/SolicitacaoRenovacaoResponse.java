package dev.sanderson.Back_End.dto.SolicitacaoRenovacaoDtos;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class SolicitacaoRenovacaoResponse {
    private Long id;
    private Long emprestimoId;
    private String livroTitulo;
    private String status;
    private LocalDateTime dataSolicitacao;
}
