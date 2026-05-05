import React from 'react';
import { Link } from 'react-router-dom';
import { ReservaResponse } from '@/services';  // ← Use o tipo do Services!
import { fmt, statusReservaClass, statusReservaLabel } from '../models/ProfileModel';

interface MinhasReservasProps {
  reservas: ReservaResponse[];  // ← Tipo correto do Services!
  onCancelarReserva: (reserva: ReservaResponse) => void;  // ← Nome melhor
}

export const MinhasReservas: React.FC<MinhasReservasProps> = ({ 
  reservas, 
  onCancelarReserva 
}) => {
  return (
    <section className="profile-section">
      <h2 className="section-title">
        <svg 
          width="18" 
          height="18" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
        Minhas Reservas
      </h2>

      {reservas.length > 0 ? (
        <div className="reservations-list">
          {reservas.map((r) => (
            <div key={r.id} className="reservation-item">
              {/* Capa do livro */}
              <div className="reservation-cover">
                {r.livro.urlImg ? (
                  <img src={r.livro.urlImg} alt={r.livro.titulo} />
                ) : (
                  <div className="cover-placeholder cover-placeholder--sm">
                    <svg 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="1.5"
                    >
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Informações da reserva */}
              <div className="reservation-info">
                <Link 
                  to={`/livro/${r.livro.id}`} 
                  className="reservation-title"
                >
                  {r.livro.titulo}
                </Link>
                <p className="reservation-author">{r.livro.autor?.autor}</p>
                <div className="reservation-dates">
                  <span>Reservado em {fmt(r.dataReserva)}</span>
                  {r.dataExpiracao && (
                    <span>Expira em {fmt(r.dataExpiracao)}</span>
                  )}
                </div>
              </div>

              {/* Status e ações */}
              <div className="reservation-right">
                <span className={`badge ${statusReservaClass(r.status)}`}>
                  {statusReservaLabel(r.status)}
                </span>
                {['ATIVA', 'DISPONIVEL'].includes(r.status) && (
                  <button
                    className="btn-cancel-reservation"
                    onClick={() => onCancelarReserva(r)}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-card">
          <p>Você não possui reservas ativas.</p>
          <Link to="/buscar" className="btn-browse">
            Explorar catálogo →
          </Link>
        </div>
      )}
    </section>
  );
};