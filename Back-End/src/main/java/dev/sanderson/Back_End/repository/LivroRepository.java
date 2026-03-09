package dev.sanderson.Back_End.repository;

import dev.sanderson.Back_End.entity.Livro;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LivroRepository extends JpaRepository<Livro, Long> {
}
