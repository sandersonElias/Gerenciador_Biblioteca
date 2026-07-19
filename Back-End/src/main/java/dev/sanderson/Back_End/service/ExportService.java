package dev.sanderson.Back_End.service;

import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import dev.sanderson.Back_End.entity.Emprestimo;
import dev.sanderson.Back_End.entity.Reserva;
import dev.sanderson.Back_End.repository.EmprestimoRepository;
import dev.sanderson.Back_End.repository.ReservaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExportService {

    private final EmprestimoRepository emprestimoRepository;
    private final ReservaRepository reservaRepository;

    private static final DateTimeFormatter FORMATO_DATA = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    // ═══════════════════════════════════════════════════════════════
    //  EMPRESTIMOS - PDF
    // ═══════════════════════════════════════════════════════════════

    public byte[] exportarEmprestimosPdf() {
        List<Emprestimo> emprestimos = emprestimoRepository.findAll();
        return gerarPdfEmprestimos(emprestimos);
    }

    public byte[] exportarEmprestimosPdf(List<Emprestimo> emprestimos) {
        return gerarPdfEmprestimos(emprestimos);
    }

    private byte[] gerarPdfEmprestimos(List<Emprestimo> emprestimos) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter writer = new PdfWriter(out);
            PdfDocument pdfDoc = new PdfDocument(writer);
            Document doc = new Document(pdfDoc);

            PdfFont font = PdfFontFactory.createFont();
            DeviceRgb headerBg = new DeviceRgb(41, 128, 185);
            DeviceRgb headerText = new DeviceRgb(255, 255, 255);

            doc.add(new Paragraph("Relatorio de Emprestimos - Biblioteca Monsa")
                    .setFont(font)
                    .setFontSize(18)
                    .setBold()
                    .setTextAlignment(TextAlignment.CENTER));
            doc.add(new Paragraph("Data: " + LocalDate.now().format(FORMATO_DATA))
                    .setFont(font)
                    .setFontSize(10)
                    .setTextAlignment(TextAlignment.CENTER));
            doc.add(new Paragraph(" "));

            Table tabela = new Table(UnitValue.createPercentArray(new float[]{3, 2.5f, 2, 2, 1.5f}))
                    .useAllAvailableWidth();

            String[] headers = {"Livro", "Usuario", "Data Emprestimo", "Data Devolucao", "Status"};
            for (String header : headers) {
                com.itextpdf.layout.element.Cell cell = new com.itextpdf.layout.element.Cell()
                        .add(new Paragraph(header).setFont(font).setFontSize(10).setBold().setFontColor(headerText))
                        .setBackgroundColor(headerBg)
                        .setTextAlignment(TextAlignment.CENTER);
                tabela.addHeaderCell(cell);
            }

            for (Emprestimo e : emprestimos) {
                tabela.addCell(new com.itextpdf.layout.element.Cell().add(new Paragraph(e.getLivro().getTitulo()).setFont(font).setFontSize(9)));
                tabela.addCell(new com.itextpdf.layout.element.Cell().add(new Paragraph(e.getUser().getName()).setFont(font).setFontSize(9)));
                tabela.addCell(new com.itextpdf.layout.element.Cell().add(new Paragraph(
                        e.getDataEmprestimo() != null ? e.getDataEmprestimo().format(FORMATO_DATA) : "-")
                        .setFont(font).setFontSize(9)));
                tabela.addCell(new com.itextpdf.layout.element.Cell().add(new Paragraph(
                        e.getDataDevolucao() != null ? e.getDataDevolucao().format(FORMATO_DATA) : "-")
                        .setFont(font).setFontSize(9)));
                tabela.addCell(new com.itextpdf.layout.element.Cell().add(new Paragraph(e.getStatus().name()).setFont(font).setFontSize(9)));
            }

            doc.add(tabela);
            doc.close();

        } catch (IOException e) {
            log.error("Erro ao gerar PDF de emprestimos: {}", e.getMessage());
            throw new RuntimeException("Erro ao gerar PDF", e);
        }

        return out.toByteArray();
    }

    // ═══════════════════════════════════════════════════════════════
    //  EMPRESTIMOS - EXCEL
    // ═══════════════════════════════════════════════════════════════

    public byte[] exportarEmprestimosExcel() {
        List<Emprestimo> emprestimos = emprestimoRepository.findAll();
        return gerarExcelEmprestimos(emprestimos);
    }

    private byte[] gerarExcelEmprestimos(List<Emprestimo> emprestimos) {
        try (Workbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            Sheet sheet = workbook.createSheet("Emprestimos");

            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.WHITE.getIndex());
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);

            Row header = sheet.createRow(0);
            String[] headers = {"Livro", "Usuario", "Data Emprestimo", "Data Devolucao", "Data Devolvido", "Renovacoes", "Status"};
            for (int i = 0; i < headers.length; i++) {
                org.apache.poi.ss.usermodel.Cell cell = header.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowNum = 1;
            for (Emprestimo e : emprestimos) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(e.getLivro().getTitulo());
                row.createCell(1).setCellValue(e.getUser().getName());
                row.createCell(2).setCellValue(e.getDataEmprestimo() != null ? e.getDataEmprestimo().format(FORMATO_DATA) : "-");
                row.createCell(3).setCellValue(e.getDataDevolucao() != null ? e.getDataDevolucao().format(FORMATO_DATA) : "-");
                row.createCell(4).setCellValue(e.getDataDevolvido() != null ? e.getDataDevolvido().format(FORMATO_DATA) : "-");
                row.createCell(5).setCellValue(e.getRenovacoes() != null ? e.getRenovacoes() : 0);
                row.createCell(6).setCellValue(e.getStatus().name());
            }

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out.toByteArray();

        } catch (IOException e) {
            log.error("Erro ao gerar Excel de emprestimos: {}", e.getMessage());
            throw new RuntimeException("Erro ao gerar Excel", e);
        }
    }

    // ═══════════════════════════════════════════════════════════════
    //  RESERVAS - PDF
    // ═══════════════════════════════════════════════════════════════

    public byte[] exportarReservasPdf() {
        List<Reserva> reservas = reservaRepository.findAll();
        return gerarPdfReservas(reservas);
    }

    private byte[] gerarPdfReservas(List<Reserva> reservas) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter writer = new PdfWriter(out);
            PdfDocument pdfDoc = new PdfDocument(writer);
            Document doc = new Document(pdfDoc);

            PdfFont font = PdfFontFactory.createFont();
            DeviceRgb headerBg = new DeviceRgb(39, 174, 96);
            DeviceRgb headerText = new DeviceRgb(255, 255, 255);

            doc.add(new Paragraph("Relatorio de Reservas - Biblioteca Monsa")
                    .setFont(font)
                    .setFontSize(18)
                    .setBold()
                    .setTextAlignment(TextAlignment.CENTER));
            doc.add(new Paragraph("Data: " + LocalDate.now().format(FORMATO_DATA))
                    .setFont(font)
                    .setFontSize(10)
                    .setTextAlignment(TextAlignment.CENTER));
            doc.add(new Paragraph(" "));

            Table tabela = new Table(UnitValue.createPercentArray(new float[]{3, 2.5f, 2, 2, 1.5f}))
                    .useAllAvailableWidth();

            String[] headers = {"Livro", "Usuario", "Data Reserva", "Data Expiracao", "Status"};
            for (String header : headers) {
                com.itextpdf.layout.element.Cell cell = new com.itextpdf.layout.element.Cell()
                        .add(new Paragraph(header).setFont(font).setFontSize(10).setBold().setFontColor(headerText))
                        .setBackgroundColor(headerBg)
                        .setTextAlignment(TextAlignment.CENTER);
                tabela.addHeaderCell(cell);
            }

            for (Reserva r : reservas) {
                tabela.addCell(new com.itextpdf.layout.element.Cell().add(new Paragraph(r.getLivro().getTitulo()).setFont(font).setFontSize(9)));
                tabela.addCell(new com.itextpdf.layout.element.Cell().add(new Paragraph(r.getUser().getName()).setFont(font).setFontSize(9)));
                tabela.addCell(new com.itextpdf.layout.element.Cell().add(new Paragraph(
                        r.getDataReserva() != null ? r.getDataReserva().format(FORMATO_DATA) : "-")
                        .setFont(font).setFontSize(9)));
                tabela.addCell(new com.itextpdf.layout.element.Cell().add(new Paragraph(
                        r.getDataExpiracao() != null ? r.getDataExpiracao().format(FORMATO_DATA) : "-")
                        .setFont(font).setFontSize(9)));
                tabela.addCell(new com.itextpdf.layout.element.Cell().add(new Paragraph(r.getStatus().name()).setFont(font).setFontSize(9)));
            }

            doc.add(tabela);
            doc.close();

        } catch (IOException e) {
            log.error("Erro ao gerar PDF de reservas: {}", e.getMessage());
            throw new RuntimeException("Erro ao gerar PDF", e);
        }

        return out.toByteArray();
    }

    // ═══════════════════════════════════════════════════════════════
    //  RESERVAS - EXCEL
    // ═══════════════════════════════════════════════════════════════

    public byte[] exportarReservasExcel() {
        List<Reserva> reservas = reservaRepository.findAll();
        return gerarExcelReservas(reservas);
    }

    private byte[] gerarExcelReservas(List<Reserva> reservas) {
        try (Workbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            Sheet sheet = workbook.createSheet("Reservas");

            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.WHITE.getIndex());
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.DARK_GREEN.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);

            Row header = sheet.createRow(0);
            String[] headers = {"Livro", "Usuario", "Data Reserva", "Data Disponivel", "Data Expiracao", "Status"};
            for (int i = 0; i < headers.length; i++) {
                org.apache.poi.ss.usermodel.Cell cell = header.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowNum = 1;
            for (Reserva r : reservas) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(r.getLivro().getTitulo());
                row.createCell(1).setCellValue(r.getUser().getName());
                row.createCell(2).setCellValue(r.getDataReserva() != null ? r.getDataReserva().format(FORMATO_DATA) : "-");
                row.createCell(3).setCellValue(r.getDataDisponivel() != null ? r.getDataDisponivel().format(FORMATO_DATA) : "-");
                row.createCell(4).setCellValue(r.getDataExpiracao() != null ? r.getDataExpiracao().format(FORMATO_DATA) : "-");
                row.createCell(5).setCellValue(r.getStatus().name());
            }

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out.toByteArray();

        } catch (IOException e) {
            log.error("Erro ao gerar Excel de reservas: {}", e.getMessage());
            throw new RuntimeException("Erro ao gerar Excel", e);
        }
    }
}