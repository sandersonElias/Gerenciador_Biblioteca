package dev.sanderson.Back_End.dto.CatalogacaoDtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class CatalogacaoRequest {
    @NotBlank(message = "Nome da catalogacao e obrigatorio")
    private String catalogacao;
}