package dev.sanderson.Back_End.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.sanderson.Back_End.dto.EmprestimoDtos.EmprestimoRequest;
import dev.sanderson.Back_End.dto.EmprestimoDtos.EmprestimoResponse;
import dev.sanderson.Back_End.dto.LivroDtos.LivroMinDto;
import dev.sanderson.Back_End.dto.UserDtos.UserMinDto;
import dev.sanderson.Back_End.entity.Emprestimo;
import dev.sanderson.Back_End.entity.Livro;
import dev.sanderson.Back_End.entity.User;
import dev.sanderson.Back_End.entity.type.StatusEmprestimo;
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

    private EmprestimoResponse toResponse(Emprestimo e) {
        EmprestimoResponse dto = new EmprestimoResponse();

        dto.setId(e.getId());
        dto.setDataEmprestimo(e.getDataEmprestimo());
        dto.setDataDevolucao(e.getDataDevolucao());
        dto.setDataDevolvido(e.getDataDevolvido());
        dto.setRenovacoes(e.getRenovacoes());
        dto.setStatus(e.getStatus().name());

        // USER
        if (e.getUser() != null) {
            UserMinDto userDto = new UserMinDto();
            userDto.setName(e.getUser().getName());
            userDto.setEmail(e.getUser().getEmail());
            dto.setUser(userDto);
        }

        // LIVRO
        if (e.getLivro() != null) {
            LivroMinDto livroDto = new LivroMinDto();
            livroDto.setId(e.getLivro().getId());
            livroDto.setTitulo(e.getLivro().getTitulo());
            dto.setLivro(livroDto);
        }

        return dto;
    }

    private EmprestimoRequest toEmprestimoMinDto(Emprestimo emprestimo) {
        EmprestimoRequest dto = new EmprestimoRequest();
        dto.setId(emprestimo.getId());
        dto.setDataEmprestimo(emprestimo.getDataEmprestimo());
        dto.setDataDevolucao(emprestimo.getDataDevolucao());
        dto.setDataDevolvido(emprestimo.getDataDevolvido());
        dto.setRenovacoes(emprestimo.getRenovacoes());
        dto.setStatus(emprestimo.getStatus());
        dto.setLivroId(emprestimo.getLivro().getId());
        dto.setUserId(emprestimo.getUser().getId());

        return dto;
    }

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

        emp.setUser(user);
        emp.setLivro(livro);

        LocalDate hoje = dto.getDataEmprestimo() != null ? dto.getDataEmprestimo() : LocalDate.now();
        emp.setDataEmprestimo(hoje);

        LocalDate devolucao = dto.getDataDevolucao() != null ? dto.getDataDevolucao() : hoje.plusDays(7);
        emp.setDataDevolucao(devolucao);

        if (dto.getStatus() != null) {
            emp.setStatus(dto.getStatus());
        } else {
            emp.setStatus(StatusEmprestimo.ATIVO);
        }

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

        emp.setStatus(StatusEmprestimo.DEVOLVIDO);
        emp.setDataDevolvido(LocalDate.now());
        emprestimoRepository.save(emp);
    }

    // Renovar empréstimo
    public EmprestimoResponse renovarEmprestimo(Long id) {
        Emprestimo emp = emprestimoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Empréstimo não encontrado"));

        if (emp.getStatus() == StatusEmprestimo.DEVOLVIDO) {
            throw new IllegalStateException("Empréstimo já devolvido; renovação não permitida");
        }

        emp.setRenovacoes(Objects.requireNonNullElse(emp.getRenovacoes(), 0) + 1);
        LocalDate novaDevolucao = Objects.requireNonNullElse(emp.getDataDevolucao(), LocalDate.now()).plusDays(7);
        emp.setDataDevolucao(novaDevolucao);
        emp.setStatus(StatusEmprestimo.ATIVO);

        Emprestimo atualizado = emprestimoRepository.save(emp);
        return objectMapper.convertValue(atualizado, EmprestimoResponse.class);
    }

    // Listar todos
    public List<EmprestimoResponse> todosEmprestimos() {
        return emprestimoRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // Buscar por ID
    public EmprestimoResponse buscarId(Long id) {
        Emprestimo emp = emprestimoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Empréstimo não encontrado"));
        return objectMapper.convertValue(emp, EmprestimoResponse.class);
    }

    // Buscar por nome do aluno
    public List<EmprestimoResponse> buscarPorUser(String nome) {
        return emprestimoRepository.buscarUser(nome).stream()
                .map(this::toResponse)
                .toList();
    }

    // Buscar por título do livro
    public List<EmprestimoResponse> buscarPorLivro(String titulo) {
        return emprestimoRepository.buscarLivro(titulo)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // Buscar por título do livro para renovação
    public List<EmprestimoResponse> buscarPorLivroRenovacao(String titulo) {
        return emprestimoRepository.buscarRenovacaoLivro(titulo).stream()
                .map(this::toResponse)
                .toList();
    }

    // Buscar por nome do aluno para renovação
    public List<EmprestimoResponse> buscarPorUserRenovacao(String nome) {
        return emprestimoRepository.buscarRenovacaoUser(nome).stream()
                .map(this::toResponse)
                .toList();
    }

    // Buscar por status
    public List<EmprestimoResponse> buscarPorStatus(StatusEmprestimo status) {
        return emprestimoRepository.buscarStatus(status).stream()
                .map(this::toResponse)
                .toList();
    }

    // Buscar devoluções do dia
    public List<EmprestimoResponse> buscarDevolucaoDoDia(LocalDate hoje) {
        return emprestimoRepository.buscarDevolucaoDoDia(hoje).stream()
                .map(this::toResponse)
                .toList();
    }

}
