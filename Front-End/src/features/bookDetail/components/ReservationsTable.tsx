import React from 'react';
import { ReservaResponse } from '@/services/reserva/types';

interface ReservationsTableProps {
  reservations: ReservaResponse[];
}

/**
 * Componente puro da tabela de reservas
 */
export const ReservationsTable: React.FC<ReservationsTableProps> = ({ 
  reservations 
}) => {
  if (reservations.length === 0) {
    return null;
  }

  return (
    <div className="reservations-section">
      <h2>Reservas deste livro</h2>
      <table className="reservations-table">
        <thead>
          <tr>
            <th>Usuário</th>
            <th>Data</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((res) => (
            <tr key={res.id}>
              <td>{res.user?.name}</td>
              <td>
                {new Date(res.dataReserva).toLocaleDateString('pt-BR')}
              </td>
              <td>
                <span className={`status-badge ${res.status.toLowerCase()}`}>
                  {res.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};