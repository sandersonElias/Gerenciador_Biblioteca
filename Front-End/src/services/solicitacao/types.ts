export interface SolicitacaoRenovacaoResponse {
  id: number;
  emprestimoId: number;
  livroTitulo: string;
  status: string;
  dataSolicitacao: string;
}

export interface SolicitacaoPendenteDto {
  id: number;
  emprestimoId: number;
  livroTitulo: string;
  solicitanteNome: string;
  solicitanteEmail: string;
  dataEmprestimo: string;
  dataDevolucaoPrevista: string;
  renovacoesRealizadas: number;
  dataSolicitacao: string;
}
