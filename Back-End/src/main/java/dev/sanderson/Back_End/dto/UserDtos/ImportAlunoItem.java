package dev.sanderson.Back_End.dto.UserDtos;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class ImportAlunoItem {

    @Schema(description = "ID do aluno na SEE-MG (será também a senha padrão)", example = "7363945")
    @NotBlank(message = "Matrícula é obrigatória")
    private String matricula;

    @Schema(description = "Nome completo do aluno", example = "Sophia Gonçalves Amancio")
    @NotBlank(message = "Nome é obrigatório")
    private String nome;

    @Schema(description = "Email do aluno", example = "sophia.7363945@aluno.mg.gov.br")
    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email inválido")
    private String email;

    @Schema(description = "Sala/turma do aluno", example = "DESENV DE SISTEMAS EM INT 1")
    @NotBlank(message = "Sala é obrigatória")
    private String sala;

    @Schema(description = "Ano escolar (1, 2 ou 3)", example = "3")
    @NotNull(message = "Ano é obrigatório")
    @Positive(message = "Ano deve ser positivo")
    private Integer ano;
}