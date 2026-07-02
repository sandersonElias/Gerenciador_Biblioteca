import React from "react";
import Modal from "../../../../components/common/Modal";
import Button from "../../../../components/common/Button";
import { EmprestimoResponse } from "../../../../services/emprestimo/types";

interface ReturnLoanModalProps {
  isOpen: boolean;
  loan: EmprestimoResponse | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const ReturnLoanModal: React.FC<ReturnLoanModalProps> = ({
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
      title="Registrar Devolução"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={onConfirm}>
            Confirmar Devolução
          </Button>
        </>
      }
    >
      <p>Confirmar devolução do livro:</p>
      <strong>{loan.livro.titulo}</strong>
      <p>Emprestado para: {loan.user.name}</p>
    </Modal>
  );
};
