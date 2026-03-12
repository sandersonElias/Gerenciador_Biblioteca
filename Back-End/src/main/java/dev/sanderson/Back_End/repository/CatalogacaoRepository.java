package dev.sanderson.Back_End.repository;

import dev.sanderson.Back_End.entity.Catalogacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CatalogacaoRepository  extends JpaRepository<Catalogacao, Long> {

    Optional<Catalogacao> findByCatalogacao(String catalogacao);
}
