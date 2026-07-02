import React from 'react';
import { TopBorrower } from '../models/ReportsModel';

interface TopBorrowersTableProps {
  topBorrowers: TopBorrower[];
}

const TopBorrowersTable: React.FC<TopBorrowersTableProps> = ({ topBorrowers }) => (
  <div className="table-card table-card--full">
    <div className="table-card__header">
      <h3>Top Usuários</h3>
      <span className="table-card__sub">por total de empréstimos</span>
    </div>
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Usuário</th>
            <th>E-mail</th>
            <th>Empréstimos</th>
          </tr>
        </thead>
        <tbody>
          {topBorrowers.map((item, i) => (
            <tr key={item.email}>
              <td>
                <span className={`rank-badge ${i === 0 ? 'rank-badge--gold' : i === 1 ? 'rank-badge--silver' : i === 2 ? 'rank-badge--bronze' : ''}`}>
                  {i + 1}
                </span>
              </td>
              <td className="td-name">{item.name}</td>
              <td className="td-email">{item.email}</td>
              <td>
                <div className="loan-bar">
                  <div
                    className="loan-bar__fill"
                    style={{ width: `${(item.count / (topBorrowers[0]?.count || 1)) * 100}%` }}
                  />
                  <span className="loan-bar__label">{item.count}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default TopBorrowersTable;
