import React from 'react';

interface LoansHeaderProps {
  onNewLoan: () => void;
}

export const LoansHeader: React.FC<LoansHeaderProps> = ({ onNewLoan }) => {
  return (
    <div className="lp-header">
      <div className="lp-header__text">
        <h1>Gerenciamento de Empréstimos</h1>
        <p>Gerencie empréstimos, renovações e devoluções</p>
      </div>
      <button className="lp-btn-new" onClick={onNewLoan}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Novo Empréstimo
      </button>
    </div>
  );
};