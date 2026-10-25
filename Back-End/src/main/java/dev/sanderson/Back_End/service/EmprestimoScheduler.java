package dev.sanderson.Back_End.service;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Jobs agendados relacionados a emprestimos.
 * Separado do EmprestimoService para manter o servico focado nas regras de negocio.
 */
@Component
@RequiredArgsConstructor
public class EmprestimoScheduler {

    private final EmprestimoService emprestimoService;

    @Scheduled(cron = "0 0 0 * * *")
    public void marcarEmprestimosAtrasados() {
        emprestimoService.marcarEmprestimosAtrasados();
    }
}
