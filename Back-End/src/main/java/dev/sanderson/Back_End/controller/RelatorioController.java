package dev.sanderson.Back_End.controller;

import dev.sanderson.Back_End.service.ExportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/relatorios")
@RequiredArgsConstructor
public class RelatorioController {

    private final ExportService exportService;

    // ── Emprestimos PDF ────────────────────────────────────────────────────

    @GetMapping("/emprestimos/pdf")
    public ResponseEntity<byte[]> exportarEmprestimosPdf() {
        byte[] pdf = exportService.exportarEmprestimosPdf();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=emprestimos.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    // ── Emprestimos Excel ──────────────────────────────────────────────────

    @GetMapping("/emprestimos/excel")
    public ResponseEntity<byte[]> exportarEmprestimosExcel() {
        byte[] excel = exportService.exportarEmprestimosExcel();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=emprestimos.xlsx")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(excel);
    }

    // ── Reservas PDF ───────────────────────────────────────────────────────

    @GetMapping("/reservas/pdf")
    public ResponseEntity<byte[]> exportarReservasPdf() {
        byte[] pdf = exportService.exportarReservasPdf();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=reservas.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    // ── Reservas Excel ─────────────────────────────────────────────────────

    @GetMapping("/reservas/excel")
    public ResponseEntity<byte[]> exportarReservasExcel() {
        byte[] excel = exportService.exportarReservasExcel();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=reservas.xlsx")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(excel);
    }
}