package dev.sanderson.Back_End.repository;

import dev.sanderson.Back_End.entity.Livro;
import dev.sanderson.Back_End.entity.Reserva;
import dev.sanderson.Back_End.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    Optional<Reserva> findFirstByLivroAndStatusOrderByDataReservaAsc(
            Livro livro,
            String staus
    );

    List<Reserva> findByStatus(String status);

    boolean existsByLivroAndUsuarioAndStatus(
            Livro livro,
            User usuario,
            String status
    );
}
