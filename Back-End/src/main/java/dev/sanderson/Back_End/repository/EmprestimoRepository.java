package dev.sanderson.Back_End.repository;

import dev.sanderson.Back_End.entity.Emprestimo;
import dev.sanderson.Back_End.entity.type.StatusEmprestimo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmprestimoRepository extends JpaRepository<Emprestimo, Long> {

    List<Emprestimo> findAll();

    @Query("""
        SELECT e FROM Emprestimo e
        WHERE LOWER(e.user.name) LIKE LOWER(CONCAT('%', :name, '%'))
    """)
    List<Emprestimo> buscarUser(@Param("name") String name);

    @Query("""
        SELECT e FROM Emprestimo e
        WHERE LOWER(e.livro.titulo) LIKE LOWER(CONCAT('%', :titulo, '%'))
    """)
    List<Emprestimo> buscarLivro(@Param("titulo") String titulo);

    @Query("""
        SELECT e FROM Emprestimo e
        WHERE e.status = :status
    """)
    List<Emprestimo> buscarStatus(@Param("status") StatusEmprestimo status);

    @Query("""
        SELECT e FROM Emprestimo e
        WHERE e.dataDevolucao = :data
    """)
    List<Emprestimo> buscarDevolucaoDoDia(@Param("data") LocalDate data);

    @Query("""
        SELECT e FROM Emprestimo e
        WHERE LOWER(e.livro.titulo) LIKE LOWER(CONCAT('%', :titulo, '%'))
        AND e.status <> 'DEVOLVIDO'
    """)
    List<Emprestimo> buscarRenovacaoLivro(@Param("titulo") String titulo);

    @Query("""
        SELECT e FROM Emprestimo e
        WHERE LOWER(e.user.name) LIKE LOWER(CONCAT('%', :name, '%'))
        AND e.status <> 'DEVOLVIDO'
    """)
    List<Emprestimo> buscarRenovacaoUser(@Param("name") String name);

    // ✅ Busca empréstimo em curso (ATIVO ou ATRASADO) por email
    @Query("""
        SELECT e FROM Emprestimo e
        WHERE e.user.email = :email
        AND e.status IN :statuses
    """)
    Optional<Emprestimo> findByUserEmailAndStatusIn(
            @Param("email") String email,
            @Param("statuses") List<StatusEmprestimo> statuses
    );

    // Buscar últimos 4 empréstimos devolvidos por email
    @Query("""
        SELECT e FROM Emprestimo e
        WHERE e.user.email = :email
        AND e.status = :status
        ORDER BY e.dataDevolvido DESC
        LIMIT 4
    """)
    List<Emprestimo> findTop4ByUserEmailAndStatusOrderByDataDevolvidoDesc(
            @Param("email") String email,
            @Param("status") StatusEmprestimo status
    );
}