package dev.sanderson.Back_End.controller;

import dev.sanderson.Back_End.dto.LivroDtos.FiltroLivroRequest;
import dev.sanderson.Back_End.dto.LivroDtos.LivroRequest;
import dev.sanderson.Back_End.dto.LivroDtos.LivroResponse;
import dev.sanderson.Back_End.exception.BusinessRuleException;
import dev.sanderson.Back_End.service.LivroService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RestController
@RequestMapping("/livro")
@RequiredArgsConstructor
public class LivroController {

    private final LivroService livroService;

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<LivroResponse> criarLivro(@Valid @RequestBody LivroRequest livroDto)
            throws BusinessRuleException {
        LivroResponse criado = livroService.insertLivro(livroDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(criado);
    }

    @GetMapping("/buscar/{filtro}/{termo}")
    public ResponseEntity<List<LivroResponse>> buscarPorFiltro(
            @PathVariable String filtro,
            @PathVariable String termo)
    {
        List<LivroResponse> livroDto;

        switch (filtro.toLowerCase()) {
            case "titulo":
                livroDto = livroService.buscarPorTitulo(termo);
                break;
            case "genero":
                livroDto = livroService.buscarPorGenero(termo);
                break;
            case "autor":
                livroDto = livroService.buscarPorAutor(termo);
                break;
            case "catalogacao":
                livroDto = livroService.buscarPorCatalogacao(termo);
                break;
            default:
                return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(livroDto);
    }

    @GetMapping("/buscar")
    public ResponseEntity<Page<LivroResponse>> buscarComFiltros(FiltroLivroRequest filtros) {
        Page<LivroResponse> resultado = livroService.buscarComFiltros(filtros);
        return ResponseEntity.ok(resultado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LivroResponse> update(@PathVariable Long id, @Valid @RequestBody LivroRequest dto)
            throws BusinessRuleException {
        LivroResponse updated = livroService.updateLivro(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarLivro(@PathVariable Long id)
            throws BusinessRuleException {
        livroService.deleteLivro(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/todos")
    public ResponseEntity<List<LivroResponse>> todosLivros(){
        List<LivroResponse> livroDto = livroService.listarTodos();
        return ResponseEntity.ok(livroDto);
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<LivroResponse> buscarLivro(@PathVariable Long id){
        LivroResponse livroDto = livroService.buscarPorId(id);
        return ResponseEntity.ok(livroDto);
    }

    @GetMapping("/populares")
    public ResponseEntity<List<LivroResponse>> listarPopulares(@RequestParam(required = false, defaultValue = "5") int limite){
        List<LivroResponse> livros = livroService.listarMaisPopulares(limite);
        return ResponseEntity.ok(livros);
    }
}