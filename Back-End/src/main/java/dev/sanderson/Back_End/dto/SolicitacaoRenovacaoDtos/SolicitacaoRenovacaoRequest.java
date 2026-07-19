package dev.sanderson.Back_End.dto.SolicitacaoRenovacaoDtos;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SolicitacaoRenovacaoRequest {
    @NotNull(message = "ID do emprestimo e obrigatorio")
    private Long emprestimoId;
}