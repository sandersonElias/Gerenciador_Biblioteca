package dev.sanderson.Back_End.dto.UserDtos;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CadastrarProfessorRequest {

    @Schema(description = "Matrícula do professor (será também a senha padrão)", example = "12345")
    @NotBlank(message = "Matrícula é obrigatória")
    private String matricula;

    @Schema(description = "Nome completo do professor", example = "Maria das Dores Silva")
    @NotBlank(message = "Nome é obrigatório")
    private String nome;

    @Schema(description = "Email do professor", example = "maria.silva@professor.mg.gov.br")
    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email inválido")
    private String email;
}