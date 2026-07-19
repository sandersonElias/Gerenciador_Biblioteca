package dev.sanderson.Back_End.controller;

import dev.sanderson.Back_End.dto.CatalogacaoDtos.CatalogacaoRequest;
import dev.sanderson.Back_End.dto.CatalogacaoDtos.CatalogacaoResponse;
import dev.sanderson.Back_End.service.CatalogacaoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/catalogacao")
@RequiredArgsConstructor
public class CatalogacaoController {

    private final CatalogacaoService catalogacaoService;

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CatalogacaoResponse> criarCatalogacao(@Valid @RequestBody CatalogacaoRequest catalogacaoDto){
        CatalogacaoResponse catalogacao = catalogacaoService.insertCatalogacao(catalogacaoDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(catalogacao);
    }

    @GetMapping("/buscar/{catalogacao}")
    public ResponseEntity<List<CatalogacaoResponse>> buscarCatalogacao(@PathVariable String catalogacao){
        List<CatalogacaoResponse> catalogacaoDto = catalogacaoService.buscarCatalogacao(catalogacao);
        return ResponseEntity.ok(catalogacaoDto);
    }
}