package dev.sanderson.Back_End.controller;

import dev.sanderson.Back_End.dto.SolicitacaoRenovacaoDtos.RejeitarSolicitacaoRequest;
import dev.sanderson.Back_End.dto.SolicitacaoRenovacaoDtos.SolicitacaoPendenteDto;
import dev.sanderson.Back_End.dto.SolicitacaoRenovacaoDtos.SolicitacaoRenovacaoRequest;
import dev.sanderson.Back_End.dto.SolicitacaoRenovacaoDtos.SolicitacaoRenovacaoResponse;
import dev.sanderson.Back_End.service.SolicitacaoRenovacaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/solicitacoes-renovacao")
@RequiredArgsConstructor
public class SolicitacaoRenovacaoController {

    private final SolicitacaoRenovacaoService solicitacaoService;

    // Aluno solicita renovação — email do solicitante passado na URL
    // Padrão idêntico ao /reserva/useremail/{email}
    @PostMapping("/{email}")
    public ResponseEntity<SolicitacaoRenovacaoResponse> solicitarRenovacao(
            @PathVariable String email,
            @RequestBody SolicitacaoRenovacaoRequest request) {

        SolicitacaoRenovacaoResponse response = solicitacaoService
                .solicitarRenovacao(request.getEmprestimoId(), email);

        return ResponseEntity.ok(response);
    }

    // Funcionário lista solicitações pendentes
    @GetMapping("/pendentes")
    public ResponseEntity<List<SolicitacaoPendenteDto>> listarPendentes() {
        List<SolicitacaoPendenteDto> pendentes = solicitacaoService.listarSolicitacoesPendentes();
        return ResponseEntity.ok(pendentes);
    }

    // Funcionário aprova solicitação — email do funcionário passado na URL
    @PutMapping("/{id}/aprovar/{email}")
    public ResponseEntity<Void> aprovarSolicitacao(
            @PathVariable Long id,
            @PathVariable String email) {

        solicitacaoService.aprovarSolicitacao(id, email);
        return ResponseEntity.ok().build();
    }

    // Funcionário rejeita solicitação — email do funcionário passado na URL
    @PutMapping("/{id}/rejeitar/{email}")
    public ResponseEntity<Void> rejeitarSolicitacao(
            @PathVariable Long id,
            @PathVariable String email,
            @RequestBody(required = false) RejeitarSolicitacaoRequest request) {

        String observacao = request != null ? request.getObservacao() : null;
        solicitacaoService.rejeitarSolicitacao(id, email, observacao);
        return ResponseEntity.ok().build();
    }
}