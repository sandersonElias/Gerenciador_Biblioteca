package dev.sanderson.Back_End.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.sanderson.Back_End.dto.GeneroDtos.GeneroRequest;
import dev.sanderson.Back_End.dto.GeneroDtos.GeneroResponse;
import dev.sanderson.Back_End.entity.Genero;
import dev.sanderson.Back_End.repository.GeneroRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GeneroService {

    private final GeneroRepository generoRepository;
    private final ObjectMapper objectMapper;

    public GeneroResponse insertGenero(GeneroRequest dto){
        Genero genero = new Genero();
        genero.setGenero(dto.getGenero());

        Genero salvo = generoRepository.save(genero);

        return objectMapper.convertValue(salvo, GeneroResponse.class);
    }

    public List<GeneroResponse> buscarGenero (String genero){
        return generoRepository.buscarGenero(genero)
                .stream()
                .map(e -> objectMapper.convertValue(e, GeneroResponse.class))
                .toList();
    }
}
