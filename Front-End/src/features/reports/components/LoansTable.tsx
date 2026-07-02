import React from "react";
import { EmprestimoResponse } from "../../../services/emprestimo/types";
import { fmt, statusLoanClass, statusLabel } from "../models/ReportsModel";

interface LoansTableProps {
  loans: EmprestimoResponse[];
}

const LoansTable: React.FC<LoansTableProps> = ({ loans }) => (
  <div className="table-card">
    <div className="table-card__header">
      <h3>Últimos Empréstimos</h3>
    </div>
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Livro</th>
            <th>Usuário</th>
            <th>Devolução</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {loans.slice(0, 6).map((loan) => (
            <tr key={loan.id}>
              <td className="td-title">{loan.livro.titulo}</td>
              <td>
                <span className="td-name">{loan.user.name}</span>
                <span className="td-email">{loan.user.email}</span>
              </td>
              <td className="td-date">{fmt(loan.dataDevolucao)}</td>
              <td>
                <span className={`badge ${statusLoanClass(loan.status)}`}>
                  {statusLabel(loan.status)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default LoansTable;
