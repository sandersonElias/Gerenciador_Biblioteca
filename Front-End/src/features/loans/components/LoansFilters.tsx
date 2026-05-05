import React from 'react';
import { StatusEmprestimo } from '@/services/emprestimo/types';

interface LoansFiltersProps {
  searchTerm: string;
  statusFilter: StatusEmprestimo | '';
  onSearchChange: (value: string) => void;
  onStatusChange: (value: StatusEmprestimo | '') => void;
}

export const LoansFilters: React.FC<LoansFiltersProps> = ({
  searchTerm,
  statusFilter,
  onSearchChange,
  onStatusChange,
}) => {
  return (
    <div className="lp-filters">
      <div className="lp-search">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          placeholder="Buscar por usuário ou livro…"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <select
        className="lp-select"
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value as StatusEmprestimo | '')}
      >
        <option value="">Todos os status</option>
        <option value="ATIVO">Ativo</option>
        <option value="ATRASADO">Atrasado</option>
        <option value="DEVOLVIDO">Devolvido</option>
      </select>
    </div>
  );
};