package dev.sanderson.Back_End.dto.UserDtos;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserRequest {

    @NotEmpty(message = "Name não pode ser vazio")
    private String name;

    @NotEmpty(message = "Email não pode ser vazio")
    private String email;

    @Schema(description = "Senha do usuário", example = "123", required = true)
    @NotEmpty(message = "Senha não pode ser vazio")
    private String password;

    @Schema(description = "Role do usuário", example = "ROLE_ADMIN", required = true)
    @NotNull
    private String role;

}
