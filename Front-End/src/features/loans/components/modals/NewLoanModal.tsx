import React from 'react';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import { AutocompleteField } from '../AutocompleteField';
import { ExemplarSelector } from '../ExemplarSelector';
import { NewLoanFormData } from '../../models/LoansModel';
import { UserResponse } from '@/services/user/types';
import { Livro } from '@/services/livro/types';
import { Exemplar } from '@/services/exemplar/types';

interface NewLoanModalProps {
  isOpen: boolean;
  formData: NewLoanFormData;
  onClose: () => void;
  onConfirm: () => void;
  onFormChange: (data: Partial<NewLoanFormData>) => void;
  
  // Autocomplete usuário
  userSearchTerm: string;
  userSuggestions: UserResponse[];
  onUserSearchChange: (value: string) => void;
  onUserSelect: (userId: number, userName: string) => void;
  onUserClear: () => void;
  
  // Autocomplete livro
  bookSearchTerm: string;
  bookSuggestions: Livro[];
  onBookSearchChange: (value: string) => void;
  onBookSelect: (bookId: number, bookTitle: string) => void;
  onBookClear: () => void;
  
  // Exemplares
  exemplares: Exemplar[];
  loadingExemplares: boolean;
}

export const NewLoanModal: React.FC<NewLoanModalProps> = ({
  isOpen,
  formData,
  onClose,
  onConfirm,
  onFormChange,
  userSearchTerm,
  userSuggestions,
  onUserSearchChange,
  onUserSelect,
  onUserClear,
  bookSearchTerm,
  bookSuggestions,
  onBookSearchChange,
  onBookSelect,
  onBookClear,
  exemplares,
  loadingExemplares,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Novo Empréstimo"
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={onConfirm}>
            Criar Empréstimo
          </Button>
        </>
      }
    >
      <div className="loan-form">
        {/* Campo Usuário */}
        <AutocompleteField
          label="Usuário *"
          icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          }
          value={userSearchTerm}
          placeholder="Digite o nome do usuário (mín. 3 letras)"
          suggestions={userSuggestions}
          isSelected={!!formData.userId}
          onChange={(value) => {
            onUserSearchChange(value);
            onUserClear();
          }}
          onSelect={(user) => onUserSelect(user.id, user.name)}
          renderSuggestion={(user) => (
            <>
              <span className="sug-name">{user.name}</span>
              <span className="sug-email">{user.email}</span>
            </>
          )}
        />

        {/* Campo Livro */}
        <AutocompleteField
          label="Livro *"
          icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
          }
          value={bookSearchTerm}
          placeholder="Digite o título do livro (mín. 3 letras)"
          suggestions={bookSuggestions}
          isSelected={!!formData.livroId}
          onChange={(value) => {
            onBookSearchChange(value);
            onBookClear();
          }}
          onSelect={(book) => onBookSelect(book.id, book.titulo)}
          renderSuggestion={(book) => (
            <>
              <span className="sug-name">{book.titulo}</span>
              <span className="sug-email">{book.autor?.autor}</span>
            </>
          )}
        />

        {/* Seleção de exemplar */}
        {formData.livroId && (
          <ExemplarSelector
            exemplares={exemplares}
            loading={loadingExemplares}
            selectedId={formData.exemplarId}
            onSelect={(exemplarId) => onFormChange({ exemplarId })}
          />
        )}

        {/* Data de devolução */}
        <div className="loan-form__field">
          <label className="loan-form__label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Data de Devolução <span className="loan-form__optional">(padrão: 7 dias)</span>
          </label>
          <input
            className="loan-form__input"
            type="date"
            value={formData.dataDevolucao}
            onChange={(e) => onFormChange({ dataDevolucao: e.target.value })}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        {/* Info */}
        <div className="modal-note modal-note--info">
          Digite e <strong>clique na sugestão</strong> para selecionar usuário e livro.
          Após selecionar o livro, os exemplares disponíveis serão carregados automaticamente.
          {!formData.dataDevolucao && ' O prazo padrão é de 7 dias.'}
        </div>
      </div>
    </Modal>
  );
};