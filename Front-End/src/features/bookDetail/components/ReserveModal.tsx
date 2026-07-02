import React from "react";
import Modal from "../../../components/common/Modal";
import Button from "../../../components/common/Button";

interface ReserveModalProps {
  isOpen: boolean;
  bookTitle: string;
  isReserving: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

/**
 * Componente puro do modal de confirmação de reserva
 */
export const ReserveModal: React.FC<ReserveModalProps> = ({
  isOpen,
  bookTitle,
  isReserving,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirmar Reserva"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={onConfirm} isLoading={isReserving}>
            Confirmar
          </Button>
        </>
      }
    >
      <div className="reserve-confirm">
        <p>Deseja reservar:</p>
        <strong>{bookTitle}</strong>
        <p className="reserve-note">Você terá prioridade para retirada.</p>
      </div>
    </Modal>
  );
};
