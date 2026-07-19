package dev.sanderson.Back_End.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.sanderson.Back_End.dto.CatalogacaoDtos.CatalogacaoRequest;
import dev.sanderson.Back_End.dto.CatalogacaoDtos.CatalogacaoResponse;
import dev.sanderson.Back_End.entity.Catalogacao;
import dev.sanderson.Back_End.repository.CatalogacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CatalogacaoService {

    private final CatalogacaoRepository catalogacaoRepository;
    private final ObjectMapper objectMapper;

    @CacheEvict(value = "catalogacoes", allEntries = true)
    public CatalogacaoResponse insertCatalogacao(CatalogacaoRequest dto){
        Catalogacao catalogacao = new Catalogacao();
        catalogacao.setCatalogacao(dto.getCatalogacao());

        Catalogacao salvo = catalogacaoRepository.save(catalogacao);

        return objectMapper.convertValue(salvo, CatalogacaoResponse.class);
    }

    @Cacheable(value = "catalogacoes", key = "#catalogacao")
    public List<CatalogacaoResponse> buscarCatalogacao(String catalogacao){
        return catalogacaoRepository.buscarCatalogacao(catalogacao)
                .stream()
                .map(e -> objectMapper.convertValue(e, CatalogacaoResponse.class))
                .toList();
    }
}