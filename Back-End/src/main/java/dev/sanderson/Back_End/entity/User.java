package dev.sanderson.Back_End.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "tb_user")
@Inheritance(strategy = InheritanceType.JOINED)
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @ManyToOne
    @JoinColumn(name = "role_id", nullable = false)
    private Roles role;

    /** ID do aluno na SEE-MG. Único e nulo para perfis não-aluno. */
    @Column(unique = true, length = 20)
    private String matricula;

    /**
     * Indica se o usuário já trocou a senha padrão.
     * Default false para alunos novos, true para admins/funcionários
     * (definido na migração V13).
     */
    @Column(name = "senha_alterada", nullable = false)
    private boolean senhaAlterada = false;

    public boolean precisaTrocarSenha() {
        return !senhaAlterada;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.getRole()));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}