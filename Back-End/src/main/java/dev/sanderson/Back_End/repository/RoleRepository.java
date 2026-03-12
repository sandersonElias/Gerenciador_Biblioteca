package dev.sanderson.Back_End.repository;

import org.springframework.stereotype.Repository;
import dev.sanderson.Back_End.entity.Roles;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Roles, Long> {

    Optional<Roles> findByRole (String role);
}

