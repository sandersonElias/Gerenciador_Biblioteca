import React from 'react';
import { BookFormData } from '../models/BookFormModel';

interface BookBasicFieldsProps {
  form: BookFormData;
  onChange: (updates: Partial<BookFormData>) => void;
}

export const BookBasicFields: React.FC<BookBasicFieldsProps> = ({ 
  form, 
  onChange 
}) => {
  return (
    <>
      <div className="form-field">
        <label className="form-label">
          Título <span className="required">*</span>
        </label>
        <input
          type="text"
          className="form-input"
          value={form.titulo}
          onChange={(e) => onChange({ titulo: e.target.value })}
          placeholder="Ex: Dom Casmurro"
          required
        />
      </div>

      <div className="form-field">
        <label className="form-label">Editora</label>
        <input
          type="text"
          className="form-input"
          value={form.editora}
          onChange={(e) => onChange({ editora: e.target.value })}
          placeholder="Ex: Companhia das Letras"
        />
      </div>

      <div className="form-field">
        <label className="form-label">Descrição</label>
        <textarea
          className="form-textarea"
          rows={4}
          value={form.descricao}
          onChange={(e) => onChange({ descricao: e.target.value })}
          placeholder="Resumo ou sinopse do livro..."
        />
      </div>
    </>
  );
};