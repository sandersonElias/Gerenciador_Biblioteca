package dev.sanderson.Back_End.dto.UserDtos;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class LoginResponse {

    @Schema(description = "Token JWT no formato 'Bearer <token>'")
    private String token;

    @Schema(description = "Indica se o usuário já trocou a senha padrão. " +
            "Se false, o front deve exibir banner solicitando a troca.")
    private boolean senhaAlterada;

    public LoginResponse(String token, boolean senhaAlterada) {
        this.token = token;
        this.senhaAlterada = senhaAlterada;
    }
}