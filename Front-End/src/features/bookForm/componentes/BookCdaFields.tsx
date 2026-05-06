import React from 'react';
import { BookFormData, BookFormMode } from '../models/BookFormModel';

interface BookCdaFieldsProps {
  form: BookFormData;
  mode: BookFormMode;
  onChange: (updates: Partial<BookFormData>) => void;
}

export const BookCdaFields: React.FC<BookCdaFieldsProps> = ({ 
  form, 
  mode,
  onChange 
}) => {
  const isEdit = mode === 'edit';

  return (
    <div className="form-grid">
      <div className="form-field">
        <label className="form-label">CDD</label>
        <input
          type="text"
          className="form-input"
          value={form.cdd}
          onChange={(e) => onChange({ cdd: e.target.value })}
          placeholder="Ex: 869.3"
        />
      </div>

      <div className="form-field">
        <label className="form-label">Localização</label>
        <input
          type="text"
          className="form-input"
          value={form.localizacao}
          onChange={(e) => onChange({ localizacao: e.target.value })}
          placeholder="Ex: Estante A-3"
        />
      </div>

      <div className="form-field">
        <label className="form-label">
          Total de Exemplares <span className="required">*</span>
        </label>
        <input
          type="number"
          className="form-input"
          value={form.totalExemplares}
          onChange={(e) => onChange({ totalExemplares: e.target.value })}
          min="0"
          required
        />
        {isEdit && (
          <small className="form-hint">
            ⚠️ Aumentar este número irá criar exemplares adicionais
          </small>
        )}
      </div>

      <div className="form-field">
        <label className="form-label">
          Quantidade Disponível <span className="required">*</span>
        </label>
        <input
          type="number"
          className="form-input"
          value={form.quantidadeDisponivel}
          onChange={(e) => onChange({ quantidadeDisponivel: e.target.value })}
          min="0"
          required
        />
      </div>
    </div>
  );
};