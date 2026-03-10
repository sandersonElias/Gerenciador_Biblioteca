package dev.sanderson.Back_End.repository;

import dev.sanderson.Back_End.entity.Catalogacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CatalogacaoRepository  extends JpaRepository<Catalogacao, Long> {

    Optional<Catalogacao> findByCatalogacao(String catalogacao);
}
