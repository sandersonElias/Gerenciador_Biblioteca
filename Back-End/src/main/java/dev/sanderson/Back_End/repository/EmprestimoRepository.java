package dev.sanderson.Back_End.repository;

import dev.sanderson.Back_End.entity.Emprestimo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EmprestimoRepository extends JpaRepository<Emprestimo, Long> {

    List<Emprestimo> findAll();

    @Query("SELECT COUNT(e) FROM Emprestimo e WHERE e.livro.id = :livroId AND e.status = 'PENDENTE'")
    Integer contarEmprestimosPendentes(@Param("livroId") Long livroId);

    @Query("SELECT e FROM Emprestimo e WHERE LOWER(e.aluno.nome) LIKE LOWER(CONCAT('%', :nome, '%'))")
    List<Emprestimo> buscarAluno(@Param("nome") String nome);

    @Query("SELECT e FROM Emprestimo e WHERE LOWER(e.livro.titulo) LIKE LOWER(CONCAT('%', :titulo, '%'))")
    List<Emprestimo> buscarLivro(@Param("titulo") String titulo);

    @Query("SELECT e FROM Emprestimo e WHERE e.status = :status")
    List<Emprestimo> buscarStatus(@Param("status") String status);

    @Query("SELECT e FROM Emprestimo e WHERE e.dataDevolucao = :data")
    List<Emprestimo> buscarDevolucaoDoDia(@Param("data") LocalDate data);

    // Buscas para Renovação e Devolução
    @Query("SELECT e FROM Emprestimo e WHERE LOWER(e.livro.titulo) LIKE LOWER(CONCAT('%', :titulo, '%')) AND e.status <> 'Devolvido' ")
    List<Emprestimo> buscarRenovacaoLivro(@Param("titulo") String titulo);

    @Query("SELECT e FROM Emprestimo e WHERE LOWER(e.aluno.nome) LIKE LOWER(CONCAT('%', :nome, '%')) AND e.status <> 'Devolvido' ")
    List<Emprestimo> buscarRenovacaoAluno(@Param("nome") String nome);
}
