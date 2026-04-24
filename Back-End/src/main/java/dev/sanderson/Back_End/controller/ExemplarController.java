package dev.sanderson.Back_End.controller;

import dev.sanderson.Back_End.dto.ExemplarDtos.ExemplarResponse;
import dev.sanderson.Back_End.service.ExemplarService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/exemplar")
@RequiredArgsConstructor
public class ExemplarController {

    private final ExemplarService exemplarService;

    // GET /exemplar/livro/{livroId} — todos os exemplares do livro
    @GetMapping("/livro/{livroId}")
    public ResponseEntity<List<ExemplarResponse>> listarPorLivro(@PathVariable Long livroId) {
        return ResponseEntity.ok(exemplarService.listarPorLivro(livroId));
    }

    // GET /exemplar/livro/{livroId}/disponiveis — só os disponíveis
    @GetMapping("/livro/{livroId}/disponiveis")
    public ResponseEntity<List<ExemplarResponse>> listarDisponiveisPorLivro(@PathVariable Long livroId) {
        return ResponseEntity.ok(exemplarService.listarDisponiveisPorLivro(livroId));
    }

    // GET /exemplar/livro/{livroId}/sugestao — primeiro disponível (para autocomplete)
    @GetMapping("/livro/{livroId}/sugestao")
    public ResponseEntity<ExemplarResponse> sugerirExemplar(@PathVariable Long livroId) {
        return ResponseEntity.ok(exemplarService.sugerirExemplar(livroId));
    }

    // POST /exemplar/livro/{livroId}/adicionar — adiciona mais exemplares manualmente
    @PostMapping("/livro/{livroId}/adicionar")
    public ResponseEntity<List<ExemplarResponse>> adicionarExemplares(
            @PathVariable Long livroId,
            @RequestBody Map<String, Integer> body) {
        int quantidade = body.getOrDefault("quantidade", 1);
        return ResponseEntity.ok(exemplarService.adicionarExemplares(livroId, quantidade));
    }
}
