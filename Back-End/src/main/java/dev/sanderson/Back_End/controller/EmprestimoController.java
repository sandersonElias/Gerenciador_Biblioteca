package dev.sanderson.Back_End.controller;

import dev.sanderson.Back_End.dto.EmprestimoDtos.EmprestimoRequest;
import dev.sanderson.Back_End.dto.EmprestimoDtos.EmprestimoResponse;
import dev.sanderson.Back_End.entity.type.StatusEmprestimo;
import dev.sanderson.Back_End.service.EmprestimoService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/emprestimo")
@RequiredArgsConstructor
public class EmprestimoController {

    private final EmprestimoService emprestimoService;

    // Novo empréstimo
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<EmprestimoResponse> novoEmprestimo(@RequestBody EmprestimoRequest emprestimo) {
        EmprestimoResponse dto = emprestimoService.insertEmprestimo(emprestimo);
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    // Renovar empréstimo
    @PutMapping("/renovar/{id}")
    public ResponseEntity<EmprestimoResponse> renovar(@PathVariable Long id) {
        EmprestimoResponse dto = emprestimoService.renovarEmprestimo(id);
        return ResponseEntity.ok(dto);
    }

    // Devolver empréstimo
    @PutMapping("/devolver/{id}")
    public ResponseEntity<Void> devolver(@PathVariable Long id) {
        emprestimoService.devolverEmprestimo(id);
        return ResponseEntity.noContent().build();
    }

    // Listar todos
    @GetMapping("/todos")
    public ResponseEntity<List<EmprestimoResponse>> listarTodos() {
        return ResponseEntity.ok(emprestimoService.todosEmprestimos());
    }

    // Buscar por ID
    @GetMapping("/id/{id}")
    public ResponseEntity<EmprestimoResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(emprestimoService.buscarId(id));
    }

    // Buscar por nome do usuário
    @GetMapping("/user/{nome}")
    public ResponseEntity<List<EmprestimoResponse>> buscarPorUser(@PathVariable String nome) {
        return ResponseEntity.ok(emprestimoService.buscarPorUser(nome));
    }

    // Buscar por título do livro
    @GetMapping("/livro/{titulo}")
    public ResponseEntity<List<EmprestimoResponse>> buscarPorLivro(@PathVariable String titulo) {
        return ResponseEntity.ok(emprestimoService.buscarPorLivro(titulo));
    }

    @GetMapping("/livro/renovar/{titulo}")
    public ResponseEntity<List<EmprestimoResponse>> buscarPorLivroRenovacao(@PathVariable String titulo) {
        return ResponseEntity.ok(emprestimoService.buscarPorLivroRenovacao(titulo));
    }

    @GetMapping("/user/renovar/{nome}")
    public ResponseEntity<List<EmprestimoResponse>> buscarPorUserRenovacao(@PathVariable String nome) {
        return ResponseEntity.ok(emprestimoService.buscarPorUserRenovacao(nome));
    }

    // Buscar por status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<EmprestimoResponse>> buscarPorStatus(@PathVariable StatusEmprestimo status) {
        return ResponseEntity.ok(emprestimoService.buscarPorStatus(status));
    }

    // Buscar devoluções do dia
    @GetMapping("/devolucao/{data}")
    public ResponseEntity<List<EmprestimoResponse>> buscarDevolucaoDoDia(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data) {
        return ResponseEntity.ok(emprestimoService.buscarDevolucaoDoDia(data));
    }
}
