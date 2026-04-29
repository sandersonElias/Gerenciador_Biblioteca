package dev.sanderson.Back_End.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Configurações de regras de empréstimo carregadas de application.properties.
 *
 * <p>Prefixo: <code>biblioteca.emprestimo</code></p>
 *
 * <p>Exemplo:</p>
 * <pre>
 * biblioteca.emprestimo.prazo-dias=7
 * biblioteca.emprestimo.max-renovacoes=3
 * biblioteca.emprestimo.limite.aluno=2
 * biblioteca.emprestimo.limite.professor=5
 * biblioteca.emprestimo.limite.funcionario=10
 * biblioteca.emprestimo.limite.admin=10
 * </pre>
 */
@Configuration
@ConfigurationProperties(prefix = "biblioteca.emprestimo")
@Getter
@Setter
public class EmprestimoConfig {

    /** Prazo padrão de devolução (dias). */
    private int prazoDias = 7;

    /** Máximo de renovações por empréstimo. */
    private int maxRenovacoes = 3;

    /** Limites por perfil. */
    private Limite limite = new Limite();

    @Getter
    @Setter
    public static class Limite {
        private int aluno = 2;
        private int professor = 5;
        private int funcionario = 10;
        private int admin = 10;
    }

    /**
     * Resolve o limite de empréstimos simultâneos para uma determinada role.
     * Se a role for desconhecida, retorna 0 (mais seguro: bloqueia).
     *
     * @param role nome da role do usuário (ex: "ROLE_ALUNO", "ROLE_PROFESSOR")
     */
    public int limitePorRole(String role) {
        if (role == null) return 0;
        return switch (role) {
            case "ROLE_ALUNO"        -> limite.getAluno();
            case "ROLE_PROFESSOR"    -> limite.getProfessor();
            case "ROLE_FUNCIONARIO"  -> limite.getFuncionario();
            case "ROLE_ADMIN"        -> limite.getAdmin();
            default -> 0;
        };
    }
}