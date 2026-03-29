package dev.sanderson.Back_End.repository;

import dev.sanderson.Back_End.entity.Autor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AutorRepository  extends JpaRepository<Autor, Long> {

    Optional<Autor> findByAutor(String autor);

    @Query("SELECT a FROM Autor a WHERE LOWER(a.autor) LIKE LOWER(CONCAT('%', :autor, '%'))")
    List<Autor> buscarAutor(@Param("autor") String autor);
}
