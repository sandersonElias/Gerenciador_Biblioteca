import React from "react";
import { SolicitacaoPendenteDto } from "../../../services/solicitacao/types";
import { LoansHelpers } from "../models/LoansModel";

interface SolicitacaoCardProps {
  solicitacao: SolicitacaoPendenteDto;
  onAprovar: (solic: SolicitacaoPendenteDto) => void;
  onRejeitar: (solic: SolicitacaoPendenteDto) => void;
}

export const SolicitacaoCard: React.FC<SolicitacaoCardProps> = ({
  solicitacao,
  onAprovar,
  onRejeitar,
}) => {
  return (
    <div className="solic-card">
      <div className="solic-card__icon">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="23 4 23 10 17 10" />
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
        </svg>
      </div>

      <div className="solic-card__body">
        <div className="solic-card__top">
          <span className="solic-livro">{solicitacao.livroTitulo}</span>
          <span className="solic-badge">Pendente</span>
        </div>
        <div className="solic-card__meta">
          <span>
            <strong>Aluno:</strong> {solicitacao.solicitanteNome}{" "}
            <em>({solicitacao.solicitanteEmail})</em>
          </span>
          <span>
            <strong>Emprestado em:</strong>{" "}
            {LoansHelpers.formatDate(solicitacao.dataEmprestimo)}
          </span>
          <span>
            <strong>Devolução prevista:</strong>{" "}
            {LoansHelpers.formatDate(solicitacao.dataDevolucaoPrevista)}
          </span>
          <span>
            <strong>Renovações:</strong> {solicitacao.renovacoesRealizadas}/3
          </span>
          <span>
            <strong>Solicitado em:</strong>{" "}
            {new Date(solicitacao.dataSolicitacao).toLocaleString("pt-BR")}
          </span>
        </div>
      </div>

      <div className="solic-card__actions">
        <button
          className="solic-btn solic-btn--aprovar"
          onClick={() => onAprovar(solicitacao)}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Aprovar
        </button>
        <button
          className="solic-btn solic-btn--rejeitar"
          onClick={() => onRejeitar(solicitacao)}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
          Rejeitar
        </button>
      </div>
    </div>
  );
};
