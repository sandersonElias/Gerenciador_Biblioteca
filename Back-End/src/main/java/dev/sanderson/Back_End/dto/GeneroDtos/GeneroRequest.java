package dev.sanderson.Back_End.dto.GeneroDtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class GeneroRequest {
    @NotBlank(message = "Nome do genero e obrigatorio")
    private String genero;
}