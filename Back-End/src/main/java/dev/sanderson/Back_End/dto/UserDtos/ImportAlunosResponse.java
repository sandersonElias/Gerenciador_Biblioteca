package dev.sanderson.Back_End.dto.UserDtos;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ImportAlunosResponse {

    @Schema(description = "Total de alunos enviados na requisição")
    private int totalEnviado;

    @Schema(description = "Quantidade de alunos cadastrados com sucesso")
    private int totalCadastrados;

    @Schema(description = "Quantidade de alunos pulados (já existiam)")
    private int totalPulados;

    @Schema(description = "Lista de matrículas que já existiam e foram puladas")
    private List<String> matriculasPuladas;

    @Schema(description = "Lista de e-mails que já existiam e foram pulados")
    private List<String> emailsPulados;
}