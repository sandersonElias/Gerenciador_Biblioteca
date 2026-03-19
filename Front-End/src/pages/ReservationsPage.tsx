import React, { useEffect, useState } from 'react';
import { Reserva } from '../types';
import { reservaApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useLoading } from '../context/LoadingContext';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import './ReservationsPage.scss';

const ReservationsPage: React.FC = () => {
  const [reservations, setReservations] = useState<Reserva[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<Reserva | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  
  const { showToast } = useToast();
  const { withLoading } = useLoading();

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      const data = await withLoading(reservaApi.getMinhasReservas());
      setReservations(data);
    } catch (error) {
      showToast('Erro ao carregar reservas', 'error');
    }
  };

  const handleCancel = async () => {
    if (!selectedReservation) return;
    
    try {
      await reservaApi.cancelar(selectedReservation.id);
      showToast('Reserva cancelada com sucesso!', 'success');
      setShowCancelModal(false);
      loadReservations();
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Erro ao cancelar reserva', 'error');
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'ATIVA': return 'status-active';
      case 'DISPONIVEL': return 'status-available';
      case 'CONCLUIDA': return 'status-completed';
      case 'EXPIRADA': return 'status-expired';
      case 'CANCELADA': return 'status-cancelled';
      default: return '';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ATIVA': return 'Na fila';
      case 'DISPONIVEL': return 'Disponível para retirada';
      case 'CONCLUIDA': return 'Concluída';
      case 'EXPIRADA': return 'Expirada';
      case 'CANCELADA': return 'Cancelada';
      default: return status;
    }
  };

  const canCancel = (status: string) => {
    return ['ATIVA', 'DISPONIVEL'].includes(status);
  };

  return (
    <div className="reservations-page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1>Minhas Reservas</h1>
            <p>Acompanhe o status das suas reservas</p>
          </div>
        </div>

        <div className="reservations-grid">
          {reservations.length > 0 ? (
            reservations.map(reservation => (
              <div key={reservation.id} className="reservation-card">
                <div className="reservation-book">
                  <div className="book-cover-small">
                    {reservation.livro.urlImg ? (
                      <img src={reservation.livro.urlImg} alt={reservation.livro.titulo} />
                    ) : (
                      <div className="cover-placeholder-small">📚</div>
                    )}
                  </div>
                  <div className="book-info">
                    <h3>{reservation.livro.titulo}</h3>
                    <p className="book-author">{reservation.livro.autor?.autor}</p>
                  </div>
                </div>
                
                <div className="reservation-details">
                  <div className="detail-item">
                    <span className="detail-label">Data da Reserva</span>
                    <span className="detail-value">
                      {new Date(reservation.dataReserva).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  
                  {reservation.dataDisponivel && (
                    <div className="detail-item">
                      <span className="detail-label">Disponível desde</span>
                      <span className="detail-value">
                        {new Date(reservation.dataDisponivel).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  )}
                  
                  {reservation.dataExpiracao && (
                    <div className="detail-item">
                      <span className="detail-label">Expira em</span>
                      <span className="detail-value">
                        {new Date(reservation.dataExpiracao).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  )}
                  
                  <div className="detail-item">
                    <span className="detail-label">Status</span>
                    <span className={`status-badge ${getStatusClass(reservation.status)}`}>
                      {getStatusLabel(reservation.status)}
                    </span>
                  </div>
                </div>
                
                {canCancel(reservation.status) && (
                  <div className="reservation-actions">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedReservation(reservation);
                        setShowCancelModal(true);
                      }}
                    >
                      Cancelar Reserva
                    </Button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <h3>Nenhuma reserva encontrada</h3>
              <p>Você ainda não fez nenhuma reserva. Explore nosso catálogo e reserve um livro!</p>
              <a href="/buscar" className="btn-browse">Explorar Catálogo</a>
            </div>
          )}
        </div>
      </div>

      {/* Cancel Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancelar Reserva"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowCancelModal(false)}>
              Manter Reserva
            </Button>
            <Button variant="danger" onClick={handleCancel}>
              Confirmar Cancelamento
            </Button>
          </>
        }
      >
        <p>Tem certeza que deseja cancelar a reserva do livro:</p>
        <strong>{selectedReservation?.livro.titulo}</strong>
        <p className="modal-warning">Esta ação não pode ser desfeita.</p>
      </Modal>
    </div>
  );
};

export default ReservationsPage;