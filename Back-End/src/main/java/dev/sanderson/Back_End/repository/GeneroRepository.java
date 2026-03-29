package dev.sanderson.Back_End.repository;

import dev.sanderson.Back_End.entity.Genero;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GeneroRepository extends JpaRepository<Genero, Long> {

    Optional<Genero> findByGenero(String genero);

    @Query("SELECT g FROM Genero g WHERE LOWER(g.genero) LIKE LOWER(CONCAT('%', :genero, '%'))")
    List<Genero> buscarGenero(@Param("genero") String genero);
}
