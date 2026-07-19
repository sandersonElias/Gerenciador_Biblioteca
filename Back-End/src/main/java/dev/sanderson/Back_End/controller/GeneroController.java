package dev.sanderson.Back_End.controller;

import dev.sanderson.Back_End.dto.GeneroDtos.GeneroRequest;
import dev.sanderson.Back_End.dto.GeneroDtos.GeneroResponse;
import dev.sanderson.Back_End.service.GeneroService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/genero")
@RequiredArgsConstructor
public class GeneroController {

    private final GeneroService generoService;

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GeneroResponse> criarGenero(@Valid @RequestBody GeneroRequest generoDto){
        GeneroResponse genero = generoService.insertGenero(generoDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(genero);
    }

    @GetMapping("/buscar/{genero}")
    public ResponseEntity<List<GeneroResponse>> buscaGenero(@PathVariable String genero){
        List<GeneroResponse> generoDto = generoService.buscarGenero(genero);
        return ResponseEntity.ok(generoDto);
    }
}