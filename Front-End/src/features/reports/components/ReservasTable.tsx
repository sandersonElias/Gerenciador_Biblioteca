import React from "react";
import { ReservaResponse } from "../../../services/reserva/types";
import { fmt, statusResClass, statusLabel } from "../models/ReportsModel";

interface ReservasTableProps {
  reservations: ReservaResponse[];
}

const ReservasTable: React.FC<ReservasTableProps> = ({ reservations }) => (
  <div className="table-card">
    <div className="table-card__header">
      <h3>Últimas Reservas</h3>
    </div>
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Livro</th>
            <th>Usuário</th>
            <th>Data</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {reservations.slice(0, 6).map((res) => (
            <tr key={res.id}>
              <td className="td-title">{res.livro.titulo}</td>
              <td>
                <span className="td-name">{res.user.name}</span>
              </td>
              <td className="td-date">{fmt(res.dataReserva)}</td>
              <td>
                <span className={`badge ${statusResClass(res.status)}`}>
                  {statusLabel(res.status)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default ReservasTable;
