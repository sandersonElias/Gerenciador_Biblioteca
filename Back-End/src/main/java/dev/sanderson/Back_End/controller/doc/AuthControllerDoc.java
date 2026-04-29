package dev.sanderson.Back_End.controller.doc;

import dev.sanderson.Back_End.dto.UserDtos.LoginResponse;
import dev.sanderson.Back_End.dto.UserDtos.UserLoginDto;
import dev.sanderson.Back_End.dto.UserDtos.UserRequest;
import dev.sanderson.Back_End.dto.UserDtos.UserResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;

public interface AuthControllerDoc {

    @Operation(
            summary = "Realizar login de usuário",
            description = "Realiza autenticação e retorna o token JWT junto com a flag senhaAlterada. " +
                    "Se senhaAlterada for false, o front deve exibir banner solicitando a troca de senha."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Autenticado com sucesso, token e status retornados"),
            @ApiResponse(responseCode = "400", description = "Login ou senha incorretos"),
            @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
    })
    public ResponseEntity<LoginResponse> auth(@Valid UserLoginDto userLoginDto) throws Exception;

    @Operation(summary = "Registrar um novo usuário", description = "Registra um novo usuário no sistema com as informações fornecidas")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Usuário registrado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos para registro"),
            @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
    })
    public ResponseEntity<UserResponse> registrar(@Valid UserRequest userRequest) throws Exception;
}