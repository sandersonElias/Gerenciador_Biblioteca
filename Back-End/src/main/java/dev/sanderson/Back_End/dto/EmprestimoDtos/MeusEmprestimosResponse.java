package dev.sanderson.Back_End.dto.EmprestimoDtos;

import lombok.Data;

import java.util.List;

@Data
public class MeusEmprestimosResponse {
    private EmprestimosAtivoDto emprestimosAtivo;
    private List<EmprestimoHistoricoDto> historico;
}
