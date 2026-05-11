package dev.sanderson.Back_End.repository;

import dev.sanderson.Back_End.entity.Livro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LivroRepository extends JpaRepository<Livro, Long> {

    List<Livro> findAll();

    @Query("SELECT l FROM Livro l WHERE LOWER(l.titulo) LIKE LOWER(CONCAT('%', :titulo, '%'))")
    List<Livro> buscarTitulo(@Param("titulo") String titulo);

    @Query("SELECT I FROM Livro I JOIN I.genero g WHERE LOWER(g.genero) LIKE LOWER(CONCAT('%',:nomeGenero,'%'))")
    List<Livro> buscarGenero(@Param("nomeGenero") String nomeGenero);

    @Query("SELECT I FROM Livro I JOIN I.catalogacao c WHERE LOWER(c.catalogacao) LIKE LOWER(CONCAT('%',:nomeCatalogacao,'%'))")
    List<Livro> buscarCatalogacao(@Param("nomeCatalogacao") String nomeCatalogacao);

    @Query("SELECT I FROM Livro I JOIN I.autor a WHERE LOWER(a.autor) LIKE LOWER(CONCAT('%',:nomeAutor,'%'))")
    List<Livro> buscarAutor(@Param("nomeAutor") String nomeAutor);

    @Query("SELECT l FROM Livro l ORDER BY l.contadorEmprestimos DESC")
    List<Livro> listarMaisPopulares(Pageable pageable);

    @Query("SELECT l FROM Livro l WHERE LOWER(l.titulo) = LOWER(:titulo) AND l.autor.id = :autorId")
    Optional<Livro> findByTituloAndAutorId(
            @Param("titulo") String titulo,
            @Param("autorId") Long autorId
    );
}