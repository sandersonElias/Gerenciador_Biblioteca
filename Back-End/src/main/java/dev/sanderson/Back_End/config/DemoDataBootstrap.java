package dev.sanderson.Back_End.config;

import dev.sanderson.Back_End.entity.Aluno;
import dev.sanderson.Back_End.entity.Autor;
import dev.sanderson.Back_End.entity.Catalogacao;
import dev.sanderson.Back_End.entity.Emprestimo;
import dev.sanderson.Back_End.entity.Exemplar;
import dev.sanderson.Back_End.entity.Genero;
import dev.sanderson.Back_End.entity.Livro;
import dev.sanderson.Back_End.entity.Reserva;
import dev.sanderson.Back_End.entity.Roles;
import dev.sanderson.Back_End.entity.SolicitacaoRenovacao;
import dev.sanderson.Back_End.entity.User;
import dev.sanderson.Back_End.entity.type.StatusEmprestimo;
import dev.sanderson.Back_End.entity.type.StatusExemplar;
import dev.sanderson.Back_End.entity.type.StatusReserva;
import dev.sanderson.Back_End.entity.type.StatusSolicitacao;
import dev.sanderson.Back_End.repository.AlunoRepository;
import dev.sanderson.Back_End.repository.AutorRepository;
import dev.sanderson.Back_End.repository.CatalogacaoRepository;
import dev.sanderson.Back_End.repository.EmprestimoRepository;
import dev.sanderson.Back_End.repository.ExemplarRepository;
import dev.sanderson.Back_End.repository.GeneroRepository;
import dev.sanderson.Back_End.repository.LivroRepository;
import dev.sanderson.Back_End.repository.ReservaRepository;
import dev.sanderson.Back_End.repository.RoleRepository;
import dev.sanderson.Back_End.repository.SolicitacaoRenovacaoRepository;
import dev.sanderson.Back_End.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
@Order(2)
@RequiredArgsConstructor
public class DemoDataBootstrap implements ApplicationRunner {

    private static final String FUNCIONARIO_EMAIL = "funcionario@biblioteca-demo.com";
    private static final String ALUNO_ANA_EMAIL = "ana.aluna@biblioteca-demo.com";
    private static final String ALUNO_BRUNO_EMAIL = "bruno.aluno@biblioteca-demo.com";
    private static final String ALUNO_CARLA_EMAIL = "carla.aluna@biblioteca-demo.com";

    private final UserRepository userRepository;
    private final AlunoRepository alunoRepository;
    private final RoleRepository roleRepository;
    private final AutorRepository autorRepository;
    private final GeneroRepository generoRepository;
    private final CatalogacaoRepository catalogacaoRepository;
    private final LivroRepository livroRepository;
    private final ExemplarRepository exemplarRepository;
    private final EmprestimoRepository emprestimoRepository;
    private final ReservaRepository reservaRepository;
    private final SolicitacaoRenovacaoRepository solicitacaoRenovacaoRepository;
    private final PasswordEncoder passwordEncoder;
    private final PlatformTransactionManager transactionManager;

    @Value("${demo.data.enabled:false}")
    private boolean demoDataEnabled;

    @Value("${demo.data.password:}")
    private String demoPassword;

    @Override
    public void run(ApplicationArguments args) {
        if (!demoDataEnabled) {
            return;
        }

        if (demoPassword == null || demoPassword.isBlank()) {
            log.warn("DEMO_DATA_ENABLED=true, mas DEMO_PASSWORD nao foi definido; dados demo nao criados.");
            return;
        }

        boolean jaExiste = livroRepository.count() > 0
                || userRepository.findByEmail(FUNCIONARIO_EMAIL).isPresent();

        if (jaExiste) {
            log.info("Banco ja possui dados; seed de demonstracao ignorado.");
            return;
        }

        try {
            new TransactionTemplate(transactionManager).executeWithoutResult(status -> seed());
        } catch (Exception exception) {
            log.error("Falha ao criar dados de demonstracao: {}", exception.getMessage(), exception);
        }
    }

    private void seed() {
        Roles funcionarioRole = buscarRole("ROLE_FUNCIONARIO");
        Roles alunoRole = buscarRole("ROLE_ALUNO");

        User funcionario = criarFuncionario(funcionarioRole);
        Aluno ana = criarAluno("Ana Souza", ALUNO_ANA_EMAIL, "2026001", "3º Ano A", 2026, alunoRole);
        Aluno bruno = criarAluno("Bruno Lima", ALUNO_BRUNO_EMAIL, "2026002", "2º Ano B", 2026, alunoRole);
        Aluno carla = criarAluno("Carla Mendes", ALUNO_CARLA_EMAIL, "2026003", "1º Ano C", 2026, alunoRole);

        Autor machado = criarAutor("Machado de Assis");
        Autor orwell = criarAutor("George Orwell");
        Autor rowling = criarAutor("J. K. Rowling");
        Autor saintExupery = criarAutor("Antoine de Saint-Exupéry");
        Autor shelley = criarAutor("Mary Shelley");
        Autor alencar = criarAutor("José de Alencar");
        Autor amado = criarAutor("Jorge Amado");

        Genero romance = criarGenero("Romance");
        Genero ficcao = criarGenero("Ficção Científica");
        Genero fantasia = criarGenero("Fantasia");
        Genero infantojuvenil = criarGenero("Infantojuvenil");
        Genero terror = criarGenero("Terror");
        Genero brasileira = criarGenero("Literatura Brasileira");

        Catalogacao catalogacaoBrasileira = criarCatalogacao("Literatura Brasileira");
        Catalogacao catalogacaoEstrangeira = criarCatalogacao("Literatura Estrangeira");
        Catalogacao catalogacaoInfantojuvenil = criarCatalogacao("Infantojuvenil");

        Livro domCasmurro = criarLivro(
                "Dom Casmurro",
                "Companhia das Letras",
                3,
                "869.3",
                "A1-01",
                "Um dos maiores clássicos da literatura brasileira, narrado por Bento Santiago.",
                "https://covers.openlibrary.org/b/isbn/9788535910663-L.jpg",
                romance,
                catalogacaoBrasileira,
                machado,
                42
        );
        List<Exemplar> domCasmurroExemplares = criarExemplares(domCasmurro, 3);

        Livro milNovecentosEOitentaEQuatro = criarLivro(
                "1984",
                "Companhia das Letras",
                1,
                "823.912",
                "B2-04",
                "Distopia sobre vigilância, controle e o poder do Estado.",
                "https://covers.openlibrary.org/b/isbn/9788535914849-L.jpg",
                ficcao,
                catalogacaoEstrangeira,
                orwell,
                38
        );
        List<Exemplar> milNovecentosEOitentaEQuatroExemplares = criarExemplares(milNovecentosEOitentaEQuatro, 1);

        Livro harryPotter = criarLivro(
                "Harry Potter e a Pedra Filosofal",
                "Rocco",
                4,
                "823.92",
                "C1-02",
                "O primeiro ano de Harry Potter na Escola de Magia e Bruxaria de Hogwarts.",
                "https://covers.openlibrary.org/b/isbn/9788532511010-L.jpg",
                fantasia,
                catalogacaoEstrangeira,
                rowling,
                51
        );
        List<Exemplar> harryPotterExemplares = criarExemplares(harryPotter, 4);

        Livro pequenoPrincipe = criarLivro(
                "O Pequeno Príncipe",
                "Agir",
                2,
                "843.912",
                "D1-03",
                "Uma história poética sobre amizade, afeto e o que realmente importa.",
                "https://covers.openlibrary.org/b/isbn/9788595081512-L.jpg",
                infantojuvenil,
                catalogacaoInfantojuvenil,
                saintExupery,
                29
        );
        List<Exemplar> pequenoPrincipeExemplares = criarExemplares(pequenoPrincipe, 2);

        Livro frankenstein = criarLivro(
                "Frankenstein",
                "Companhia das Letras",
                2,
                "823.7",
                "B3-05",
                "O clássico da literatura gótica sobre criação, solidão e responsabilidade.",
                "https://covers.openlibrary.org/b/isbn/9788535909453-L.jpg",
                terror,
                catalogacaoEstrangeira,
                shelley,
                17
        );
        List<Exemplar> frankensteinExemplares = criarExemplares(frankenstein, 2);

        Livro revolucaoDosBichos = criarLivro(
                "A Revolução dos Bichos",
                "Companhia das Letras",
                1,
                "823.912",
                "B2-05",
                "Uma fábula sobre poder, desigualdade e manipulação política.",
                "https://covers.openlibrary.org/b/isbn/9788535909555-L.jpg",
                ficcao,
                catalogacaoEstrangeira,
                orwell,
                22
        );
        List<Exemplar> revolucaoDosBichosExemplares = criarExemplares(revolucaoDosBichos, 1);

        Livro oGuarani = criarLivro(
                "O Guarani",
                "Martin Claret",
                3,
                "869.3",
                "A2-02",
                "Romance indianista que marcou o romantismo brasileiro.",
                "https://covers.openlibrary.org/b/isbn/9788508040744-L.jpg",
                brasileira,
                catalogacaoBrasileira,
                alencar,
                14
        );
        List<Exemplar> oGuaraniExemplares = criarExemplares(oGuarani, 3);

        Livro capitaesDaAreia = criarLivro(
                "Capitães da Areia",
                "Companhia das Letras",
                3,
                "869.3",
                "A1-04",
                "A vida de um grupo de meninos de rua em Salvador.",
                "https://covers.openlibrary.org/b/isbn/9788535911691-L.jpg",
                brasileira,
                catalogacaoBrasileira,
                amado,
                19
        );
        List<Exemplar> capitaesDaAreiaExemplares = criarExemplares(capitaesDaAreia, 3);

        LocalDate hoje = LocalDate.now();

        Emprestimo emprestimoDomCasmurro = criarEmprestimo(
                ana,
                domCasmurro,
                domCasmurroExemplares.get(0),
                hoje.minusDays(2),
                hoje.plusDays(5),
                null,
                StatusEmprestimo.ATIVO,
                1
        );

        Emprestimo emprestimoMilNovecentos = criarEmprestimo(
                bruno,
                milNovecentosEOitentaEQuatro,
                milNovecentosEOitentaEQuatroExemplares.get(0),
                hoje.minusDays(18),
                hoje.minusDays(11),
                null,
                StatusEmprestimo.ATRASADO,
                0
        );

        Emprestimo emprestimoHarryPotter = criarEmprestimo(
                carla,
                harryPotter,
                harryPotterExemplares.get(0),
                hoje.minusDays(4),
                hoje.plusDays(3),
                null,
                StatusEmprestimo.ATIVO,
                2
        );

        criarEmprestimo(
                ana,
                pequenoPrincipe,
                pequenoPrincipeExemplares.get(0),
                hoje.minusDays(30),
                hoje.minusDays(23),
                hoje.minusDays(24),
                StatusEmprestimo.DEVOLVIDO,
                0
        );

        Emprestimo emprestimoFrankenstein = criarEmprestimo(
                ana,
                frankenstein,
                frankensteinExemplares.get(0),
                hoje.minusDays(1),
                hoje.plusDays(6),
                null,
                StatusEmprestimo.ATIVO,
                0
        );

        criarEmprestimo(
                bruno,
                oGuarani,
                oGuaraniExemplares.get(0),
                hoje.minusDays(45),
                hoje.minusDays(38),
                hoje.minusDays(39),
                StatusEmprestimo.DEVOLVIDO,
                0
        );

        criarEmprestimo(
                carla,
                capitaesDaAreia,
                capitaesDaAreiaExemplares.get(0),
                hoje.minusDays(60),
                hoje.minusDays(53),
                hoje.minusDays(55),
                StatusEmprestimo.DEVOLVIDO,
                0
        );

        criarReserva(
                carla,
                milNovecentosEOitentaEQuatro,
                hoje.minusDays(1),
                hoje.plusDays(7),
                null,
                StatusReserva.ATIVA
        );

        Exemplar exemplarReservado = revolucaoDosBichosExemplares.get(0);
        exemplarReservado.setStatus(StatusExemplar.RESERVADO);
        exemplarRepository.save(exemplarReservado);

        criarReserva(
                bruno,
                revolucaoDosBichos,
                hoje.minusDays(3),
                hoje.plusDays(1),
                hoje.minusDays(1),
                StatusReserva.DISPONIVEL
        );

        criarSolicitacao(
                emprestimoDomCasmurro,
                ana,
                LocalDateTime.now().minusDays(1),
                StatusSolicitacao.PENDENTE,
                "Gostaria de renovar o empréstimo por mais sete dias.",
                null,
                null
        );

        criarSolicitacao(
                emprestimoHarryPotter,
                carla,
                LocalDateTime.now().minusDays(2),
                StatusSolicitacao.APROVADA,
                "Renovação aprovada pela equipe da biblioteca.",
                funcionario,
                LocalDateTime.now().minusDays(1)
        );

        criarSolicitacao(
                emprestimoMilNovecentos,
                bruno,
                LocalDateTime.now().minusDays(10),
                StatusSolicitacao.REJEITADA,
                "Empréstimo em atraso; é necessário regularizar a devolução.",
                funcionario,
                LocalDateTime.now().minusDays(9)
        );

        atualizarDisponibilidade(domCasmurro, domCasmurroExemplares);
        atualizarDisponibilidade(milNovecentosEOitentaEQuatro, milNovecentosEOitentaEQuatroExemplares);
        atualizarDisponibilidade(harryPotter, harryPotterExemplares);
        atualizarDisponibilidade(pequenoPrincipe, pequenoPrincipeExemplares);
        atualizarDisponibilidade(frankenstein, frankensteinExemplares);
        atualizarDisponibilidade(revolucaoDosBichos, revolucaoDosBichosExemplares);
        atualizarDisponibilidade(oGuarani, oGuaraniExemplares);
        atualizarDisponibilidade(capitaesDaAreia, capitaesDaAreiaExemplares);

        log.info("Dados de demonstração criados: {} livros, {} usuários e {} empréstimos.",
                livroRepository.count(), userRepository.count(), emprestimoRepository.count());
    }

    private Roles buscarRole(String nome) {
        return roleRepository.findByRole(nome)
                .orElseThrow(() -> new IllegalStateException("Role " + nome + " não encontrada."));
    }

    private User criarFuncionario(Roles role) {
        User user = new User();
        user.setName("Marina Costa");
        user.setEmail(FUNCIONARIO_EMAIL);
        user.setPassword(passwordEncoder.encode(demoPassword));
        user.setRole(role);
        user.setMatricula("FUNC-001");
        user.setSenhaAlterada(true);
        return userRepository.save(user);
    }

    private Aluno criarAluno(String nome, String email, String matricula, String sala, Integer ano, Roles role) {
        Aluno aluno = new Aluno();
        aluno.setName(nome);
        aluno.setEmail(email);
        aluno.setPassword(passwordEncoder.encode(demoPassword));
        aluno.setRole(role);
        aluno.setMatricula(matricula);
        aluno.setSala(sala);
        aluno.setAno(ano);
        aluno.setSenhaAlterada(true);
        return alunoRepository.save(aluno);
    }

    private Autor criarAutor(String nome) {
        Autor autor = new Autor();
        autor.setAutor(nome);
        return autorRepository.save(autor);
    }

    private Genero criarGenero(String nome) {
        Genero genero = new Genero();
        genero.setGenero(nome);
        return generoRepository.save(genero);
    }

    private Catalogacao criarCatalogacao(String nome) {
        Catalogacao catalogacao = new Catalogacao();
        catalogacao.setCatalogacao(nome);
        return catalogacaoRepository.save(catalogacao);
    }

    private Livro criarLivro(String titulo, String editora, int totalExemplares, String cdd,
                             String localizacao, String descricao, String urlImg, Genero genero,
                             Catalogacao catalogacao, Autor autor, int contadorEmprestimos) {
        Livro livro = new Livro();
        livro.setTitulo(titulo);
        livro.setEditora(editora);
        livro.setTotalExemplares(totalExemplares);
        livro.setQuantidadeDisponivel(totalExemplares);
        livro.setCdd(cdd);
        livro.setLocalizacao(localizacao);
        livro.setDescricao(descricao);
        livro.setUrlImg(urlImg);
        livro.setGenero(genero);
        livro.setCatalogacao(catalogacao);
        livro.setAutor(autor);
        livro.setContadorEmprestimos(contadorEmprestimos);
        return livroRepository.save(livro);
    }

    private List<Exemplar> criarExemplares(Livro livro, int quantidade) {
        List<Exemplar> exemplares = new ArrayList<>();
        for (int indice = 1; indice <= quantidade; indice++) {
            Exemplar exemplar = new Exemplar();
            exemplar.setLivro(livro);
            exemplar.setCodigo(String.format("%02d", indice));
            exemplar.setStatus(StatusExemplar.DISPONIVEL);
            exemplares.add(exemplarRepository.save(exemplar));
        }
        return exemplares;
    }

    private Emprestimo criarEmprestimo(User user, Livro livro, Exemplar exemplar,
                                       LocalDate dataEmprestimo, LocalDate dataDevolucao,
                                       LocalDate dataDevolvido, StatusEmprestimo status,
                                       int renovacoes) {
        Emprestimo emprestimo = new Emprestimo();
        emprestimo.setUser(user);
        emprestimo.setLivro(livro);
        emprestimo.setExemplar(exemplar);
        emprestimo.setDataEmprestimo(dataEmprestimo);
        emprestimo.setDataDevolucao(dataDevolucao);
        emprestimo.setDataDevolvido(dataDevolvido);
        emprestimo.setStatus(status);
        emprestimo.setRenovacoes(renovacoes);

        if (status != StatusEmprestimo.DEVOLVIDO) {
            exemplar.setStatus(StatusExemplar.EMPRESTADO);
            exemplarRepository.save(exemplar);
        }

        return emprestimoRepository.save(emprestimo);
    }

    private Reserva criarReserva(User user, Livro livro, LocalDate dataReserva,
                                 LocalDate dataExpiracao, LocalDate dataDisponivel,
                                 StatusReserva status) {
        Reserva reserva = new Reserva();
        reserva.setUser(user);
        reserva.setLivro(livro);
        reserva.setDataReserva(dataReserva);
        reserva.setDataExpiracao(dataExpiracao);
        reserva.setDataDisponivel(dataDisponivel);
        reserva.setStatus(status);
        return reservaRepository.save(reserva);
    }

    private SolicitacaoRenovacao criarSolicitacao(Emprestimo emprestimo, User solicitante,
                                                  LocalDateTime dataSolicitacao,
                                                  StatusSolicitacao status, String observacao,
                                                  User funcionarioResponsavel,
                                                  LocalDateTime dataResposta) {
        SolicitacaoRenovacao solicitacao = new SolicitacaoRenovacao();
        solicitacao.setEmprestimo(emprestimo);
        solicitacao.setSolicitante(solicitante);
        solicitacao.setDataSolicitacao(dataSolicitacao);
        solicitacao.setStatus(status);
        solicitacao.setObservacao(observacao);
        solicitacao.setFuncionarioResponsavel(funcionarioResponsavel);
        solicitacao.setDataResposta(dataResposta);
        return solicitacaoRenovacaoRepository.save(solicitacao);
    }

    private void atualizarDisponibilidade(Livro livro, List<Exemplar> exemplares) {
        long indisponiveis = exemplares.stream()
                .filter(exemplar -> exemplar.getStatus() != StatusExemplar.DISPONIVEL)
                .count();

        livro.setQuantidadeDisponivel((int) (exemplares.size() - indisponiveis));
        livroRepository.save(livro);
    }
}
