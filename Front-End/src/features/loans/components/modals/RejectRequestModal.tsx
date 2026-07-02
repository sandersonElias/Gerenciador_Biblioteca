import React from "react";
import Modal from "../../../../components/common/Modal";
import Button from "../../../../components/common/Button";
import { SolicitacaoPendenteDto } from "@/services/solicitacao/types";

interface RejectRequestModalProps {
  isOpen: boolean;
  solicitacao: SolicitacaoPendenteDto | null;
  observacao: string;
  onClose: () => void;
  onConfirm: () => void;
  onObservacaoChange: (value: string) => void;
}

export const RejectRequestModal: React.FC<RejectRequestModalProps> = ({
  isOpen,
  solicitacao,
  observacao,
  onClose,
  onConfirm,
  onObservacaoChange,
}) => {
  if (!solicitacao) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Rejeitar Solicitação"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Confirmar Rejeição
          </Button>
        </>
      }
    >
      <p>Rejeitar a solicitação de renovação de:</p>
      <strong>{solicitacao.livroTitulo}</strong>
      <p>Aluno: {solicitacao.solicitanteNome}</p>

      <div className="loan-form__field" style={{ marginTop: "1rem" }}>
        <label className="loan-form__label">
          Motivo da rejeição (opcional)
        </label>
        <textarea
          className="lp-textarea"
          rows={3}
          placeholder="Ex: Livro com alta demanda, limite de renovações atingido…"
          value={observacao}
          onChange={(e) => onObservacaoChange(e.target.value)}
        />
      </div>
    </Modal>
  );
};
