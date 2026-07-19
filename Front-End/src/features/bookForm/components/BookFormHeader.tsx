import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookFormMode } from '../models/BookFormModel';

interface BookFormHeaderProps {
  mode: BookFormMode;
  bookTitle?: string;
  bookId?: number;
}

export const BookFormHeader: React.FC<BookFormHeaderProps> = ({
  mode, bookTitle, bookId,
}) => {
  const navigate = useNavigate();
  const isEdit = mode === 'edit';

  return (
    <div className="form-page__header">
      <button className="btn-back" onClick={() => navigate(isEdit && bookId ? `/livro/${bookId}` : '/admin')}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Voltar
      </button>
      <div>
        <h1>{isEdit ? 'Editar Livro' : 'Cadastrar Novo Livro'}</h1>
        <p>Preencha os dados do livro abaixo</p>
      </div>
    </div>
  );
};