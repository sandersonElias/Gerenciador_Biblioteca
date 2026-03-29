package dev.sanderson.Back_End.repository;

import dev.sanderson.Back_End.entity.Catalogacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CatalogacaoRepository  extends JpaRepository<Catalogacao, Long> {

    Optional<Catalogacao> findByCatalogacao(String catalogacao);

    @Query("SELECT c FROM Catalogacao c WHERE LOWER(c.catalogacao) LIKE LOWER(CONCAT('%', :catalogacao, '%'))")
    List<Catalogacao> buscarCatalogacao(@Param("catalogacao") String catalogacao);
}
