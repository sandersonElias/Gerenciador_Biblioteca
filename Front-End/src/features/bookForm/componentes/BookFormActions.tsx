import React from 'react';
import Button from '@/components/common/Button';
import { BookFormMode } from '../models/BookFormModel';

interface BookFormActionsProps {
  mode: BookFormMode;
  isSaving: boolean;
  isDeleting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export const BookFormActions: React.FC<BookFormActionsProps> = ({
  mode, isSaving, isDeleting, onSubmit, onCancel, onDelete,
}) => {
  const isEdit = mode === 'edit';

  return (
    <div
      className="form-actions"
      style={{ justifyContent: isEdit ? 'space-between' : 'flex-end' }}
    >
      {/* Excluir — esquerda, só edit */}
      {isEdit && onDelete && (
        <Button
          variant="danger"
          onClick={onDelete}
          isLoading={isDeleting}
          disabled={isSaving}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}>
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
          Excluir Livro
        </Button>
      )}

      {/* Cancelar + Salvar — direita */}
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <Button variant="ghost" onClick={onCancel} disabled={isSaving || isDeleting}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={onSubmit} isLoading={isSaving} disabled={isDeleting}>
          {isEdit ? 'Salvar Alterações' : 'Cadastrar Livro'}
        </Button>
      </div>
    </div>
  );
};