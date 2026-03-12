package dev.sanderson.Back_End.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.sanderson.Back_End.dto.EmprestimoDtos.EmprestimoRequest;
import dev.sanderson.Back_End.dto.EmprestimoDtos.EmprestimoResponse;
import dev.sanderson.Back_End.entity.Emprestimo;
import dev.sanderson.Back_End.entity.Livro;
import dev.sanderson.Back_End.entity.User;
import dev.sanderson.Back_End.repository.EmprestimoRepository;
import dev.sanderson.Back_End.repository.LivroRepository;
import dev.sanderson.Back_End.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class EmprestimoService {

    private final EmprestimoRepository emprestimoRepository;
    private final UserRepository userRepository;
    private final LivroRepository livroRepository;
    private final ObjectMapper objectMapper;

    // Criar novo empréstimo
    public EmprestimoResponse insertEmprestimo(EmprestimoRequest dto) {
        Livro livro = livroRepository.findById(dto.getLivroId())
                .orElseThrow(() -> new EntityNotFoundException("Livro não encontrado"));
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));

        int totalExemplares = livro.getTotalExemplares() != null ? livro.getTotalExemplares() : 0;

        Integer emprestadosInteger = emprestimoRepository.contarEmprestimosPendentes(livro.getId());
        int emprestadosCount = emprestadosInteger != null ? emprestadosInteger : 0;
        if (emprestadosCount >= totalExemplares) {
            throw new IllegalStateException("Todos os exemplares deste livro estão emprestados.");
        }

        Emprestimo emp = new Emprestimo();
        emp.setId(dto.getId());

        emp.setUserId(user);
        emp.setLivro(livro);

        LocalDate hoje = dto.getDataEmprestimo() != null ? dto.getDataEmprestimo() : LocalDate.now();
        emp.setDataEmprestimo(hoje);

        LocalDate devolucao = dto.getDataDevolucao() != null ? dto.getDataDevolucao() : hoje.plusDays(7);
        emp.setDataDevolucao(devolucao);

        emp.setStatus(dto.getStatus() != null ? dto.getStatus() : "Pendente");
        emp.setRenovacoes(dto.getRenovacoes() != null ? dto.getRenovacoes() : 0);

        int contador = livro.getContadorEmprestimos() != null ? livro.getContadorEmprestimos() : 0;
        livro.setContadorEmprestimos(contador + 1);

        livroRepository.save(livro);
        Emprestimo salvo = emprestimoRepository.save(emp);

        return objectMapper.convertValue(salvo, EmprestimoResponse.class);
    }

    // Devolver empréstimo
    public void devolverEmprestimo(Long id) {
        Emprestimo emp = emprestimoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Empréstimo não encontrado"));

        emp.setStatus("Devolvido");
        emp.setDataDevolvido(LocalDate.now());
        emprestimoRepository.save(emp);
    }

    // Renovar empréstimo
    public EmprestimoResponse renovarEmprestimo(Long id) {
        Emprestimo emp = emprestimoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Empréstimo não encontrado"));

        if ("Devolvido".equalsIgnoreCase(emp.getStatus())) {
            throw new IllegalStateException("Empréstimo já devolvido; renovação não permitida");
        }

        emp.setRenovacoes(Objects.requireNonNullElse(emp.getRenovacoes(), 0) + 1);
        LocalDate novaDevolucao = Objects.requireNonNullElse(emp.getDataDevolucao(), LocalDate.now()).plusDays(7);
        emp.setDataDevolucao(novaDevolucao);
        emp.setStatus("Emprestado");

        Emprestimo atualizado = emprestimoRepository.save(emp);
        return objectMapper.convertValue(atualizado, EmprestimoResponse.class);
    }

    // Listar todos
    public List<EmprestimoResponse> todosEmprestimos() {
        return emprestimoRepository.findAll()
                .stream()
                .map(e -> objectMapper.convertValue(e, EmprestimoResponse.class))
                .toList();
    }

    // Buscar por ID
    public EmprestimoResponse buscarId(Long id) {
        Emprestimo emp = emprestimoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Empréstimo não encontrado"));
        return objectMapper.convertValue(emp, EmprestimoResponse.class);
    }

    // Buscar por nome do aluno
    public List<EmprestimoResponse> buscarPorAluno(String nome) {
        return emprestimoRepository.buscarAluno(nome).stream()
                .map(e -> objectMapper.convertValue(e, EmprestimoResponse.class))
                .toList();
    }

    // Buscar por título do livro
    public List<EmprestimoResponse> buscarPorLivro(String titulo) {
        return emprestimoRepository.buscarLivro(titulo)
                .stream()
                .map(e -> objectMapper.convertValue(e, EmprestimoResponse.class))
                .toList();
    }

    // Buscar por título do livro para renovação
    public List<EmprestimoResponse> buscarPorLivroRenovacao(String titulo) {
        return emprestimoRepository.buscarRenovacaoLivro(titulo).stream()
                .map(e -> objectMapper.convertValue(e, EmprestimoResponse.class))
                .toList();
    }

    // Buscar por nome do aluno para renovação
    public List<EmprestimoResponse> buscarPorAlunoRenovacao(String nome) {
        return emprestimoRepository.buscarRenovacaoAluno(nome).stream()
                .map(e -> objectMapper.convertValue(e, EmprestimoResponse.class))
                .toList();
    }

    // Buscar por status
    public List<EmprestimoResponse> buscarPorStatus(String status) {
        return emprestimoRepository.buscarStatus(status).stream()
                .map(e -> objectMapper.convertValue(e, EmprestimoResponse.class))
                .toList();
    }

    // Buscar devoluções do dia
    public List<EmprestimoResponse> buscarDevolucaoDoDia(LocalDate hoje) {
        return emprestimoRepository.buscarDevolucaoDoDia(hoje).stream()
                .map(e -> objectMapper.convertValue(e, EmprestimoResponse.class))
                .toList();
    }
}
