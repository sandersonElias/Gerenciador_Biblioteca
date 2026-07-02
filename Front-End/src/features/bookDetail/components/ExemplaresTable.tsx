import React from "react";
import { Exemplar } from "../../../services/exemplar/types";
import { BookDetailHelpers } from "../models/BookDetailModel";

interface ExemplaresTableProps {
  exemplares: Exemplar[];
}

/**
 * Componente puro da tabela de exemplares
 */
export const ExemplaresTable: React.FC<ExemplaresTableProps> = ({
  exemplares,
}) => {
  if (exemplares.length === 0) {
    return null;
  }

  return (
    <div className="reservations-section exemplares-section">
      <h2>Exemplares</h2>
      <table className="reservations-table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {exemplares.map((ex) => (
            <tr key={ex.id}>
              <td>
                <strong>{ex.codigo}</strong>
              </td>
              <td>
                <span
                  className={`exemplar-badge exemplar-badge--${ex.status.toLowerCase()}`}
                >
                  {BookDetailHelpers.getExemplarStatusLabel(ex.status)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
