import React from "react";
import Modal from "../../../components/common/Modal";
import Button from "../../../components/common/Button";

interface DeleteBookModalProps {
  isOpen: boolean;
  bookTitle: string;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteBookModal: React.FC<DeleteBookModalProps> = ({
  isOpen,
  bookTitle,
  isDeleting,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Excluir Livro"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isDeleting}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={onConfirm} isLoading={isDeleting}>
            Confirmar Exclusão
          </Button>
        </>
      }
    >
      <p>Tem certeza que deseja excluir permanentemente o livro:</p>
      <strong style={{ display: "block", margin: "0.5rem 0" }}>
        "{bookTitle}"
      </strong>
      <div className="modal-warning">
        <strong>⚠️ Atenção:</strong> Esta ação NÃO pode ser desfeita. Todos os
        exemplares físicos cadastrados também serão removidos.
        <br />
        <br />
        Se houver empréstimos ou reservas ativas, a exclusão será bloqueada.
      </div>
    </Modal>
  );
};
