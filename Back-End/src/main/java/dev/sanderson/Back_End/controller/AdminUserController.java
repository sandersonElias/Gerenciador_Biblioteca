package dev.sanderson.Back_End.controller;

import dev.sanderson.Back_End.dto.UserDtos.CadastrarProfessorRequest;
import dev.sanderson.Back_End.dto.UserDtos.ImportAlunosRequest;
import dev.sanderson.Back_End.dto.UserDtos.ImportAlunosResponse;
import dev.sanderson.Back_End.dto.UserDtos.UserResponse;
import dev.sanderson.Back_End.exception.BusinessRuleException;
import dev.sanderson.Back_End.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/usuarios")
@RequiredArgsConstructor
public class AdminUserController {

    private final UserService userService;

    /**
     * Cadastra alunos em lote a partir do export da SEE-MG.
     * Apenas Admin (ver SecurityConfiguration: /admin/** → hasRole ADMIN).
     */
    @PostMapping(
            value = "/import-alunos",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<ImportAlunosResponse> importarAlunos(
            @RequestBody @Valid ImportAlunosRequest request
    ) throws BusinessRuleException {

        ImportAlunosResponse response = userService.importarAlunos(request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * Cadastra um professor manualmente.
     * Senha padrão = matrícula (aluno precisa trocar no primeiro login).
     */
    @PostMapping(
            value = "/cadastrar-professor",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<UserResponse> cadastrarProfessor(
            @RequestBody @Valid CadastrarProfessorRequest request
    ) throws BusinessRuleException {

        UserResponse response = userService.cadastrarProfessor(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}