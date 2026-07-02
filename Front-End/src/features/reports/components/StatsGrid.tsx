import React from 'react';

interface StatsGridProps {
  totalLoans: number;
  ativos: number;
  atrasados: number;
  reservasAtivas: number;
}

const StatsGrid: React.FC<StatsGridProps> = ({ totalLoans, ativos, atrasados, reservasAtivas }) => (
  <div className="stats-grid">
    <div className="stat-card stat-card--blue">
      <div className="stat-card__icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
      </div>
      <div className="stat-card__body">
        <span className="stat-card__value">{totalLoans}</span>
        <span className="stat-card__label">Total empréstimos</span>
      </div>
    </div>

    <div className="stat-card stat-card--green">
      <div className="stat-card__icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      <div className="stat-card__body">
        <span className="stat-card__value">{ativos}</span>
        <span className="stat-card__label">Ativos agora</span>
      </div>
    </div>

    <div className="stat-card stat-card--red">
      <div className="stat-card__icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <div className="stat-card__body">
        <span className="stat-card__value">{atrasados}</span>
        <span className="stat-card__label">Atrasados</span>
      </div>
    </div>

    <div className="stat-card stat-card--amber">
      <div className="stat-card__icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
        </svg>
      </div>
      <div className="stat-card__body">
        <span className="stat-card__value">{reservasAtivas}</span>
        <span className="stat-card__label">Reservas ativas</span>
      </div>
    </div>
  </div>
);

export default StatsGrid;
