package dev.sanderson.Back_End.dto.UserDtos;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class UserLoginDto {

    @Schema(description = "Email do usuário", example = "admin@gmail.com", required = true)
    @NotEmpty(message = "Email não pode ser vazio")
    private String email;

    @Schema(description = "Senha do usuário", example = "123", required = true)
    @NotEmpty(message = "Senha não pode ser vazio")
    private String senha;
}
