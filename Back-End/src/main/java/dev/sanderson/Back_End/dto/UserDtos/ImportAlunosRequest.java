package dev.sanderson.Back_End.dto.UserDtos;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class ImportAlunosRequest {

    @Schema(description = "Lista de alunos a serem importados")
    @NotEmpty(message = "A lista de alunos não pode estar vazia")
    @Valid
    private List<ImportAlunoItem> alunos;
}