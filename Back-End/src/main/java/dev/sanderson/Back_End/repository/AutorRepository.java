package dev.sanderson.Back_End.repository;

import dev.sanderson.Back_End.entity.Autor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AutorRepository  extends JpaRepository<Autor, Long> {

    Optional<Autor> findByAutor(String autor);
}
