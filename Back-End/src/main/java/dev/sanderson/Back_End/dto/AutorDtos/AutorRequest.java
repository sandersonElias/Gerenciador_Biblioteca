package dev.sanderson.Back_End.dto.AutorDtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class AutorRequest {
    @NotBlank(message = "Nome do autor e obrigatorio")
    private String autor;
}