import React from 'react';
import { BookFormData } from '../models/BookFormModel';

interface BookDescricaoFieldProps {
  form: BookFormData;
  onChange: (updates: Partial<BookFormData>) => void;
}

export const BookDescricaoField: React.FC<BookDescricaoFieldProps> = ({
  form, onChange,
}) => {
  return (
    <div className="form-section full-width">
      <div className="form-section__title">
        <div className="form-section__icon form-section__icon--green">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="17" y1="10" x2="3" y2="10"/>
            <line x1="21" y1="6" x2="3" y2="6"/>
            <line x1="21" y1="14" x2="3" y2="14"/>
            <line x1="17" y1="18" x2="3" y2="18"/>
          </svg>
        </div>
        Descrição / Sinopse
      </div>

      <div className="field">
        <textarea
          className="field__textarea"
          rows={4}
          value={form.descricao}
          onChange={(e) => onChange({ descricao: e.target.value })}
          placeholder="Resumo ou sinopse do livro..."
        />
      </div>
    </div>
  );
};