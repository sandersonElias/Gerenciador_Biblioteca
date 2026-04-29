package dev.sanderson.Back_End.repository;

import dev.sanderson.Back_End.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmailAndPassword(String email, String password);

    Optional<User> findByEmail(String email);

    Optional<User> findByMatricula(String matricula);

    @Query("SELECT u.email FROM User u WHERE u.email IN :emails")
    Set<String> findEmailsExistentes(@Param("emails") Set<String> emails);

    @Query("SELECT u.matricula FROM User u WHERE u.matricula IN :matriculas")
    Set<String> findMatriculasExistentes(@Param("matriculas") Set<String> matriculas);

    @Query("SELECT u FROM User u WHERE LOWER(u.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<User> buscarPeloNome(@Param("name") String name);
}