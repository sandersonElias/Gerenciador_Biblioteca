package dev.sanderson.Back_End.service;

import dev.sanderson.Back_End.entity.Livro;
import dev.sanderson.Back_End.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificacaoService {

    private final org.springframework.mail.javamail.JavaMailSender mailSender;

    @Value("${biblioteca.email.remetente}")
    private String remetente;

    private static final DateTimeFormatter FORMATO_DATA = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    @Async
    public void enviarEmprestimoAtrasado(User user, Livro livro, LocalDate dataDevolucao) {
        String assunto = "Empréstimo atrasado - Biblioteca Monsa";
        String corpo = String.format(
                "Olá %s,\n\n" +
                "Seu empréstimo do livro \"%s\" está atrasado desde %s.\n" +
                "Por favor, devolva o livro o mais breve possível para evitar multas.\n\n" +
                "Atenciosamente,\n" +
                "Biblioteca Monsa",
                user.getName(),
                livro.getTitulo(),
                dataDevolucao.format(FORMATO_DATA)
        );
        enviar(user.getEmail(), assunto, corpo);
    }

    @Async
    public void enviarReservaDisponivel(User user, Livro livro) {
        String assunto = "Reserva disponível para retirada - Biblioteca Monsa";
        String corpo = String.format(
                "Olá %s,\n\n" +
                "O livro \"%s\" que você reservou está disponível para retirada!\n" +
                "Você tem até 24 horas para retirá-lo na biblioteca.\n\n" +
                "Atenciosamente,\n" +
                "Biblioteca Monsa",
                user.getName(),
                livro.getTitulo()
        );
        enviar(user.getEmail(), assunto, corpo);
    }

    @Async
    public void enviarLembreteDevolucao(User user, Livro livro, LocalDate dataDevolucao) {
        String assunto = "Lembrete de devolução - Biblioteca Monsa";
        String corpo = String.format(
                "Olá %s,\n\n" +
                "Lembre-se de devolver o livro \"%s\" até %s.\n" +
                "Após esta data, o empréstimo será considerado em atraso.\n\n" +
                "Atenciosamente,\n" +
                "Biblioteca Monsa",
                user.getName(),
                livro.getTitulo(),
                dataDevolucao.format(FORMATO_DATA)
        );
        enviar(user.getEmail(), assunto, corpo);
    }

    @Async
    public void enviarReservaCancelada(User user, Livro livro) {
        String assunto = "Reserva cancelada - Biblioteca Monsa";
        String corpo = String.format(
                "Olá %s,\n\n" +
                "Sua reserva do livro \"%s\" foi cancelada com sucesso.\n\n" +
                "Atenciosamente,\n" +
                "Biblioteca Monsa",
                user.getName(),
                livro.getTitulo()
        );
        enviar(user.getEmail(), assunto, corpo);
    }

    @Async
    public void enviarRenovacaoAprovada(User user, Livro livro, LocalDate novaDataDevolucao) {
        String assunto = "Renovação aprovada - Biblioteca Monsa";
        String corpo = String.format(
                "Olá %s,\n\n" +
                "Sua renovação para o livro \"%s\" foi aprovada!\n" +
                "Nova data de devolução: %s\n\n" +
                "Atenciosamente,\n" +
                "Biblioteca Monsa",
                user.getName(),
                livro.getTitulo(),
                novaDataDevolucao.format(FORMATO_DATA)
        );
        enviar(user.getEmail(), assunto, corpo);
    }

    @Async
    public void enviarRenovacaoRejeitada(User user, Livro livro, String observacao) {
        String assunto = "Renovação rejeitada - Biblioteca Monsa";
        String corpo = String.format(
                "Olá %s,\n\n" +
                "Sua renovação para o livro \"%s\" foi rejeitada.\n" +
                "%s\n\n" +
                "Atenciosamente,\n" +
                "Biblioteca Monsa",
                user.getName(),
                livro.getTitulo(),
                observacao != null ? "Motivo: " + observacao : ""
        );
        enviar(user.getEmail(), assunto, corpo);
    }

    private void enviar(String para, String assunto, String corpo) {
        try {
            org.springframework.mail.SimpleMailMessage message = new org.springframework.mail.SimpleMailMessage();
            message.setFrom(remetente);
            message.setTo(para);
            message.setSubject(assunto);
            message.setText(corpo);
            mailSender.send(message);
            log.info("Email enviado para {} - Assunto: {}", para, assunto);
        } catch (Exception e) {
            log.error("Erro ao enviar email para {}: {}", para, e.getMessage());
        }
    }
}