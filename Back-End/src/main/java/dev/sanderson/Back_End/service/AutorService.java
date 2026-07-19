package dev.sanderson.Back_End.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.sanderson.Back_End.dto.AutorDtos.AutorRequest;
import dev.sanderson.Back_End.dto.AutorDtos.AutorResponse;
import dev.sanderson.Back_End.entity.Autor;
import dev.sanderson.Back_End.repository.AutorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AutorService {

    private final AutorRepository autorRepository;
    private final ObjectMapper objectMapper;

    @CacheEvict(value = "autores", allEntries = true)
    public AutorResponse insertAutor(AutorRequest dto){
        Autor autor = new Autor();
        autor.setAutor(dto.getAutor());

        Autor salvo = autorRepository.save(autor);

        return objectMapper.convertValue(salvo, AutorResponse.class);
    }

    @Cacheable(value = "autores", key = "#autor")
    public List<AutorResponse> buscarAutor(String autor){
        return autorRepository.buscarAutor(autor)
                .stream()
                .map(e -> objectMapper.convertValue(e, AutorResponse.class))
                .toList();
    }
}