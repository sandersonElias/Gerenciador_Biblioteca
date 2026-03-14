package dev.sanderson.Back_End.repository;

import dev.sanderson.Back_End.entity.Livro;
import dev.sanderson.Back_End.entity.Reserva;
import dev.sanderson.Back_End.entity.User;
import dev.sanderson.Back_End.entity.type.StatusReserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    @Query("""
        SELECT r
        FROM Reserva r
        WHERE r.livro = :livro
        AND r.status = :status
        ORDER BY r.dataReserva ASC
    """)
    Optional<Reserva> buscarPrimeiraReserva(
            @Param("livro") Livro livro,
            @Param("status") StatusReserva status
    );

    List<Reserva> findByStatus(StatusReserva status);

    List<Reserva> findByUser(User user);

    boolean existsByLivroAndUserAndStatus(
            Livro livro,
            User user,
            StatusReserva status
    );

    @Query("""
       SELECT r
       FROM Reserva r
       WHERE r.livro.id = :livroId
       ORDER BY r.dataReserva ASC
       """)
    List<Reserva> buscarReservasPorLivro(@Param("livroId") Long livroId);
}
