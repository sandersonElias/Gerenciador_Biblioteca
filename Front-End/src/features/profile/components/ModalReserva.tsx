import Button from "../../../components/common/Button";
import Modal from "../../../components/common/Modal";
import { ReservaResponse } from "../../../services";

interface ModalReservaProps {
  handleCancelarReserva: () => void;
  handleCloseCancelModal: () => void;
  showCancelModal: boolean;
  cancelTarget: ReservaResponse | null;
  isCancelandoReserva: boolean;
}

export const ModalReserva: React.FC<ModalReservaProps> = ({
  handleCancelarReserva,
  handleCloseCancelModal,
  showCancelModal,
  cancelTarget,
  isCancelandoReserva,
}) => {
  return (
    <Modal
      isOpen={showCancelModal}
      onClose={handleCloseCancelModal}
      title="Cancelar Reserva"
      footer={
        <>
          <Button variant="ghost" onClick={handleCloseCancelModal}>
            Manter Reserva
          </Button>
          <Button
            variant="danger"
            onClick={handleCancelarReserva}
            isLoading={isCancelandoReserva}
          >
            Confirmar Cancelamento
          </Button>
        </>
      }
    >
      <p>Tem certeza que deseja cancelar a reserva do livro:</p>
      <strong>{cancelTarget?.livro.titulo}</strong>
      <p className="modal-warning">Esta ação não pode ser desfeita.</p>
    </Modal>
  );
};
