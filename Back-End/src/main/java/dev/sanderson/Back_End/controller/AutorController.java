package dev.sanderson.Back_End.controller;

import dev.sanderson.Back_End.dto.AutorDtos.AutorRequest;
import dev.sanderson.Back_End.dto.AutorDtos.AutorResponse;
import dev.sanderson.Back_End.service.AutorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "https://biblioteca-monsa.vercel.app/")
@RequestMapping("/autor")
@RequiredArgsConstructor
public class AutorController {

    private final AutorService autorService;

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<AutorResponse> criarAutor(@RequestBody AutorRequest autorDto){
        AutorResponse autor = autorService.insertAutor(autorDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(autor);
    }

    @GetMapping("/buscar/{autor}")
    public ResponseEntity<List<AutorResponse>> buscarAutor(@PathVariable String autor){
        List<AutorResponse> autorDto = autorService.buscarAutor(autor);
        return ResponseEntity.ok(autorDto);
    }
}
