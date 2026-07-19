package dev.sanderson.Back_End.controller;

import dev.sanderson.Back_End.dto.SolicitacaoRenovacaoDtos.RejeitarSolicitacaoRequest;
import dev.sanderson.Back_End.dto.SolicitacaoRenovacaoDtos.SolicitacaoPendenteDto;
import dev.sanderson.Back_End.dto.SolicitacaoRenovacaoDtos.SolicitacaoRenovacaoRequest;
import dev.sanderson.Back_End.dto.SolicitacaoRenovacaoDtos.SolicitacaoRenovacaoResponse;
import dev.sanderson.Back_End.service.SolicitacaoRenovacaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/solicitacoes-renovacao")
@RequiredArgsConstructor
public class SolicitacaoRenovacaoController {

    private final SolicitacaoRenovacaoService solicitacaoService;

    @PostMapping
    public ResponseEntity<SolicitacaoRenovacaoResponse> solicitarRenovacao(
            Authentication authentication,
            @RequestBody SolicitacaoRenovacaoRequest request) {

        String email = authentication.getName();
        SolicitacaoRenovacaoResponse response = solicitacaoService
                .solicitarRenovacao(request.getEmprestimoId(), email);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/pendentes")
    public ResponseEntity<List<SolicitacaoPendenteDto>> listarPendentes() {
        List<SolicitacaoPendenteDto> pendentes = solicitacaoService.listarSolicitacoesPendentes();
        return ResponseEntity.ok(pendentes);
    }

    @PutMapping("/{id}/aprovar")
    public ResponseEntity<Void> aprovarSolicitacao(
            @PathVariable Long id,
            Authentication authentication) {

        String email = authentication.getName();
        solicitacaoService.aprovarSolicitacao(id, email);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/rejeitar")
    public ResponseEntity<Void> rejeitarSolicitacao(
            @PathVariable Long id,
            Authentication authentication,
            @RequestBody(required = false) RejeitarSolicitacaoRequest request) {

        String email = authentication.getName();
        String observacao = request != null ? request.getObservacao() : null;
        solicitacaoService.rejeitarSolicitacao(id, email, observacao);
        return ResponseEntity.ok().build();
    }
}