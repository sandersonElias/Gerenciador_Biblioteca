import React from 'react';
import { BookFormMode } from '../models/BookFormModel';

interface BookFormHeaderProps {
  mode: BookFormMode;
  bookTitle?: string;
}

export const BookFormHeader: React.FC<BookFormHeaderProps> = ({ 
  mode, 
  bookTitle 
}) => {
  const isEdit = mode === 'edit';

  return (
    <div className="book-form-header">
      <h1>{isEdit ? 'Editar Livro' : 'Cadastrar Novo Livro'}</h1>
      <p>
        {isEdit 
          ? `Editando: ${bookTitle ?? '...'}`
          : 'Preencha os campos abaixo para cadastrar um novo livro'
        }
      </p>
    </div>
  );
};