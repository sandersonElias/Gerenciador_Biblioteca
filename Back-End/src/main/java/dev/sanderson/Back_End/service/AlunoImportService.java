package dev.sanderson.Back_End.service;

import dev.sanderson.Back_End.dto.UserDtos.ImportAlunoItem;
import dev.sanderson.Back_End.dto.UserDtos.ImportAlunosRequest;
import dev.sanderson.Back_End.dto.UserDtos.ImportAlunosResponse;
import dev.sanderson.Back_End.entity.Aluno;
import dev.sanderson.Back_End.entity.Roles;
import dev.sanderson.Back_End.exception.BusinessRuleException;
import dev.sanderson.Back_End.repository.AlunoRepository;
import dev.sanderson.Back_End.repository.RoleRepository;
import dev.sanderson.Back_End.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Importacao em lote de alunos (export da SEE-MG).
 * Extraido do UserService para separar responsabilidades.
 */
@Service
@RequiredArgsConstructor
public class AlunoImportService {

    private static final String ROLE_ALUNO = "ROLE_ALUNO";

    private final UserRepository userRepository;
    private final AlunoRepository alunoRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public ImportAlunosResponse importarAlunos(ImportAlunosRequest request) {

        List<ImportAlunoItem> alunos = request.getAlunos();
        int totalEnviado = alunos.size();

        Roles roleAluno = roleRepository.findByRole(ROLE_ALUNO)
                .orElseThrow(() -> new BusinessRuleException("Role nao existe: " + ROLE_ALUNO));

        Set<String> matriculasEnviadas = new HashSet<>();
        Set<String> emailsEnviados = new HashSet<>();
        for (ImportAlunoItem item : alunos) {
            matriculasEnviadas.add(item.getMatricula());
            emailsEnviados.add(item.getEmail().toLowerCase());
        }

        Set<String> matriculasExistentes = userRepository.findMatriculasExistentes(matriculasEnviadas);
        Set<String> emailsExistentes = userRepository.findEmailsExistentes(emailsEnviados);

        List<String> matriculasPuladas = new ArrayList<>();
        List<String> emailsPulados = new ArrayList<>();
        int totalCadastrados = 0;

        List<Aluno> alunosParaSalvar = new ArrayList<>();

        for (ImportAlunoItem item : alunos) {
            String emailLower = item.getEmail().toLowerCase();

            if (matriculasExistentes.contains(item.getMatricula())) {
                matriculasPuladas.add(item.getMatricula());
                continue;
            }
            if (emailsExistentes.contains(emailLower)) {
                emailsPulados.add(emailLower);
                continue;
            }

            Aluno aluno = new Aluno();
            aluno.setName(item.getNome());
            aluno.setEmail(emailLower);
            aluno.setMatricula(item.getMatricula());
            aluno.setPassword(passwordEncoder.encode(item.getMatricula()));
            aluno.setRole(roleAluno);
            aluno.setSenhaAlterada(false);
            aluno.setSala(item.getSala());
            aluno.setAno(item.getAno());

            alunosParaSalvar.add(aluno);
            totalCadastrados++;
        }

        alunoRepository.saveAll(alunosParaSalvar);

        return new ImportAlunosResponse(
                totalEnviado,
                totalCadastrados,
                matriculasPuladas.size() + emailsPulados.size(),
                matriculasPuladas,
                emailsPulados
        );
    }
}
