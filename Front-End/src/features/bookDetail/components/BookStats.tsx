import React from 'react';

interface BookStatsProps {
  loanCount: number;
  reservationCount: number;
}

/**
 * Componente puro de estatísticas do livro
 */
export const BookStats: React.FC<BookStatsProps> = ({ 
  loanCount, 
  reservationCount 
}) => {
  return (
    <div className="book-stats">
      <div className="stat-item">
        <span className="stat-number">{loanCount}</span>
        <span className="stat-label">Empréstimos</span>
      </div>
      <div className="stat-item">
        <span className="stat-number">{reservationCount}</span>
        <span className="stat-label">Reservas</span>
      </div>
    </div>
  );
};