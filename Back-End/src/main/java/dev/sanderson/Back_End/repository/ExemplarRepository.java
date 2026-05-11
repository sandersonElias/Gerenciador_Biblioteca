package dev.sanderson.Back_End.repository;

import dev.sanderson.Back_End.entity.Exemplar;
import dev.sanderson.Back_End.entity.type.StatusExemplar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ExemplarRepository extends JpaRepository<Exemplar, Long> {

    List<Exemplar> findByLivroIdOrderByCodigo(Long livroId);

    List<Exemplar> findByLivroIdAndStatusOrderByCodigo(Long livroId, StatusExemplar status);

    Optional<Exemplar> findFirstByLivroIdAndStatusOrderByCodigo(Long livroId, StatusExemplar status);

    // Retorna o maior código numérico existente para gerar o próximo
    @Query("SELECT MAX(CAST(e.codigo AS integer)) FROM Exemplar e WHERE e.livro.id = :livroId")
    Optional<Integer> findMaxCodigoByLivroId(@Param("livroId") Long livroId);

    @Modifying
    @Query("DELETE FROM Exemplar e WHERE e.livro.id = :livroId")
    void deleteAllByLivroId(@Param("livroId") Long livroId);
}