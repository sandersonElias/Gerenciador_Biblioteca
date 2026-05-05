import React from 'react';
import { EmprestimoResponse } from '@/services/emprestimo/types';
import { LoansHelpers } from '../models/LoansModel';

interface LoansTableProps {
  loans: EmprestimoResponse[];
  onRenew: (loan: EmprestimoResponse) => void;
  onReturn: (loan: EmprestimoResponse) => void;
}

export const LoansTable: React.FC<LoansTableProps> = ({
  loans,
  onRenew,
  onReturn,
}) => {
  if (loans.length === 0) {
    return (
      <div className="lp-empty">
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
        <p>Nenhum empréstimo encontrado</p>
      </div>
    );
  }

  return (
    <div className="lp-table-wrap">
      <table className="lp-table">
        <thead>
          <tr>
            <th>Livro</th>
            <th>Usuário</th>
            <th>Exemplar</th>
            <th>Emprestado em</th>
            <th>Devolver até</th>
            <th>Renov.</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((loan) => (
            <tr
              key={loan.id}
              className={loan.status === 'ATRASADO' ? 'row--overdue' : ''}
            >
              <td className="cell-book">
                <strong>{loan.livro.titulo}</strong>
              </td>
              <td>
                <div className="cell-user">
                  <span className="user-name">{loan.user.name}</span>
                  <span className="user-email">{loan.user.email}</span>
                </div>
              </td>
              <td className="cell-center cell-exemplar">
                {loan.exemplar ? (
                  <span className="exemplar-codigo">{loan.exemplar.codigo}</span>
                ) : (
                  '—'
                )}
              </td>
              <td>{LoansHelpers.formatDate(loan.dataEmprestimo)}</td>
              <td>{LoansHelpers.formatDate(loan.dataDevolucao)}</td>
              <td className="cell-center">{loan.renovacoes}/3</td>
              <td>
                <span className={`lp-badge ${LoansHelpers.getStatusClass(loan.status)}`}>
                  {LoansHelpers.getStatusLabel(loan.status)}
                </span>
              </td>
              <td>
                {loan.status !== 'DEVOLVIDO' && (
                  <div className="lp-actions">
                    <button
                      className="lp-btn lp-btn--renew"
                      onClick={() => onRenew(loan)}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <polyline points="23 4 23 10 17 10"/>
                        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                      </svg>
                      Renovar
                    </button>
                    <button
                      className="lp-btn lp-btn--return"
                      onClick={() => onReturn(loan)}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <polyline points="9 14 4 9 9 4"/>
                        <path d="M20 20v-7a4 4 0 0 0-4-4H4"/>
                      </svg>
                      Devolver
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};