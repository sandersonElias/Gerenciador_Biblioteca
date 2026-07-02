import React from "react";
import Modal from "../../../../components/common/Modal";
import Button from "../../../../components/common/Button";
import { EmprestimoResponse } from "../../../../services/emprestimo/types";

interface RenewLoanModalProps {
  isOpen: boolean;
  loan: EmprestimoResponse | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const RenewLoanModal: React.FC<RenewLoanModalProps> = ({
  isOpen,
  loan,
  onClose,
  onConfirm,
}) => {
  if (!loan) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Renovar Empréstimo"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={onConfirm}>
            Confirmar Renovação
          </Button>
        </>
      }
    >
      <p>Renovar o empréstimo de:</p>
      <strong>{loan.livro.titulo}</strong>
      <p>Usuário: {loan.user.name}</p>
      <div className="modal-note modal-note--info">
        A data de devolução será estendida em 7 dias.
      </div>
    </Modal>
  );
};
