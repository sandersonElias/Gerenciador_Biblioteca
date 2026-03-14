package dev.sanderson.Back_End.repository;

import dev.sanderson.Back_End.entity.Emprestimo;
import dev.sanderson.Back_End.entity.type.StatusEmprestimo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EmprestimoRepository extends JpaRepository<Emprestimo, Long> {

    List<Emprestimo> findAll();

    @Query("""
        SELECT COUNT(e)
        FROM Emprestimo e
        WHERE e.livro.id = :livroId
        AND e.status = 'PENDENTE'
    """)
    Integer contarEmprestimosPendentes(@Param("livroId") Long livroId);

    @Query("""
        SELECT e
        FROM Emprestimo e
        WHERE LOWER(e.user.name) LIKE LOWER(CONCAT('%', :name, '%'))
    """)
    List<Emprestimo> buscarUser(@Param("name") String name);

    @Query("""
        SELECT e
        FROM Emprestimo e
        WHERE LOWER(e.livro.titulo) LIKE LOWER(CONCAT('%', :titulo, '%'))
    """)
    List<Emprestimo> buscarLivro(@Param("titulo") String titulo);

    @Query("""
        SELECT e
        FROM Emprestimo e
        WHERE e.status = :status
    """)
    List<Emprestimo> buscarStatus(@Param("status") StatusEmprestimo status);

    @Query("""
        SELECT e
        FROM Emprestimo e
        WHERE e.dataDevolucao = :data
    """)
    List<Emprestimo> buscarDevolucaoDoDia(@Param("data") LocalDate data);

    // Buscas para Renovação e Devolução
    @Query("""
        SELECT e
        FROM Emprestimo e
        WHERE LOWER(e.livro.titulo) LIKE LOWER(CONCAT('%', :titulo, '%'))
        AND e.status <> 'DEVOLVIDO'
    """)
    List<Emprestimo> buscarRenovacaoLivro(@Param("titulo") String titulo);

    @Query("""
        SELECT e
        FROM Emprestimo e
        WHERE LOWER(e.user.name) LIKE LOWER(CONCAT('%', :name, '%'))
        AND e.status <> 'DEVOLVIDO'
    """)
    List<Emprestimo> buscarRenovacaoUser(@Param("name") String name);
}
