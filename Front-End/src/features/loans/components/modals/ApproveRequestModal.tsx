import React from "react";
import Modal from "../../../../components/common/Modal";
import Button from "../../../../components/common/Button";
import { SolicitacaoPendenteDto } from "../../../../services/solicitacao/types";

interface ApproveRequestModalProps {
  isOpen: boolean;
  solicitacao: SolicitacaoPendenteDto | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const ApproveRequestModal: React.FC<ApproveRequestModalProps> = ({
  isOpen,
  solicitacao,
  onClose,
  onConfirm,
}) => {
  if (!solicitacao) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Aprovar Renovação"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={onConfirm}>
            Confirmar Aprovação
          </Button>
        </>
      }
    >
      <p>Aprovar a solicitação de renovação de:</p>
      <strong>{solicitacao.livroTitulo}</strong>
      <p>Aluno: {solicitacao.solicitanteNome}</p>
      <div className="modal-note modal-note--info">
        A data de devolução será estendida em 7 dias.
      </div>
    </Modal>
  );
};
