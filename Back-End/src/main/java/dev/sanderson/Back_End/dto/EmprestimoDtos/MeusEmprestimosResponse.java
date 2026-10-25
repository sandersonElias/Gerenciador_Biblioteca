package dev.sanderson.Back_End.dto.EmprestimoDtos;

import lombok.Data;

import java.util.List;

@Data
public class MeusEmprestimosResponse {
    private List<EmprestimosAtivoDto> emprestimosAtivos;
    private List<EmprestimoHistoricoDto> historico;
}
