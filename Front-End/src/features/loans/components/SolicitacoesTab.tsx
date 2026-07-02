import React from "react";
import { SolicitacaoPendenteDto } from "../../../services/solicitacao/types";
import { SolicitacaoCard } from "./SolicitacaoCard";

interface SolicitacoesTabProps {
  pendentes: SolicitacaoPendenteDto[];
  onAprovar: (solic: SolicitacaoPendenteDto) => void;
  onRejeitar: (solic: SolicitacaoPendenteDto) => void;
}

export const SolicitacoesTab: React.FC<SolicitacoesTabProps> = ({
  pendentes,
  onAprovar,
  onRejeitar,
}) => {
  if (pendentes.length === 0) {
    return (
      <div className="lp-solicitacoes">
        <div className="lp-empty">
          <svg
            width="44"
            height="44"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <p>Nenhuma solicitação pendente</p>
        </div>
      </div>
    );
  }

  return (
    <div className="lp-solicitacoes">
      <div className="solic-list">
        {pendentes.map((solic) => (
          <SolicitacaoCard
            key={solic.id}
            solicitacao={solic}
            onAprovar={onAprovar}
            onRejeitar={onRejeitar}
          />
        ))}
      </div>
    </div>
  );
};
