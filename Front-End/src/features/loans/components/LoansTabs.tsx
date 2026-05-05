import React from 'react';
import { LoansTab } from '../models/LoansModel';

interface LoansTabsProps {
  activeTab: LoansTab;
  ativosCount: number;
  pendentesCount: number;
  onTabChange: (tab: LoansTab) => void;
}

export const LoansTabs: React.FC<LoansTabsProps> = ({
  activeTab,
  ativosCount,
  pendentesCount,
  onTabChange,
}) => {
  return (
    <div className="lp-tabs">
      <button
        className={`lp-tab ${activeTab === 'emprestimos' ? 'lp-tab--active' : ''}`}
        onClick={() => onTabChange('emprestimos')}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
        Empréstimos
        <span className="lp-tab__count">{ativosCount}</span>
      </button>

      <button
        className={`lp-tab ${activeTab === 'solicitacoes' ? 'lp-tab--active' : ''}`}
        onClick={() => onTabChange('solicitacoes')}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        Solicitações de Renovação
        {pendentesCount > 0 && (
          <span className="lp-tab__badge">{pendentesCount}</span>
        )}
      </button>
    </div>
  );
};