package dev.sanderson.Back_End.dto.UserDtos;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TrocarSenhaRequest {

    @Schema(description = "Senha atual do usuário", example = "7363945")
    @NotBlank(message = "Senha atual é obrigatória")
    private String senhaAtual;

    @Schema(description = "Nova senha (mínimo 6 caracteres)", example = "MinhaNovaSenha123")
    @NotBlank(message = "Nova senha é obrigatória")
    @Size(min = 6, message = "A nova senha deve ter no mínimo 6 caracteres")
    private String novaSenha;

    @Schema(description = "Confirmação da nova senha (deve ser igual ao campo novaSenha)")
    @NotBlank(message = "Confirmação da senha é obrigatória")
    private String confirmacaoNovaSenha;
}