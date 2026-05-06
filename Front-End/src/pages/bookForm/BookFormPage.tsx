import React from 'react';
import { useParams } from 'react-router-dom';
import { useBookFormViewModel } from '@/features/bookForm/hooks/useBookFormViewModel';
import { BookFormHeader } from '@/features/bookForm/componentes/BookFormHeader';
import { BookBasicFields } from '@/features/bookForm/componentes/BookBasicFields';
import { BookRelationsFields } from '@/features/bookForm/componentes/BookRelationsFields';
import { BookCdaFields } from '@/features/bookForm/componentes/BookCdaFields';
import { BookImageField } from '@/features/bookForm/componentes/BookImageField';
import { BookFormActions } from '@/features/bookForm/componentes/BookFormActions';
import { DeleteBookModal } from '@/features/bookForm/componentes/DeleteBookModal';
import './BookFormPage.scss';

const BookFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const bookId = id ? Number(id) : undefined;

  const vm = useBookFormViewModel({ bookId });

  // Loading state (modo edit)
  if (vm.isEdit && vm.isLoadingBook) {
    return (
      <div className="book-form-page">
        <div className="container">
          <div className="loading">Carregando livro...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="book-form-page">
      <div className="container">
        {/* Cabeçalho */}
        <BookFormHeader 
          mode={vm.mode} 
          bookTitle={vm.existingBook?.titulo} 
        />

        {/* Formulário */}
        <div className="book-form">
          <BookBasicFields 
            form={vm.form} 
            onChange={vm.handleFormChange} 
          />

          <BookRelationsFields
            // Autor
            autorSearchTerm={vm.autorAutocomplete.searchTerm}
            autorSuggestions={vm.autorAutocomplete.suggestions}
            isAutorSelected={!!vm.form.autorId}
            onAutorSearchChange={vm.autorAutocomplete.setSearchTerm}
            onAutorSelect={vm.handleSelectAutor}
            onAutorClear={vm.handleClearAutor}
            // Gênero
            generoSearchTerm={vm.generoAutocomplete.searchTerm}
            generoSuggestions={vm.generoAutocomplete.suggestions}
            isGeneroSelected={!!vm.form.generoId}
            onGeneroSearchChange={vm.generoAutocomplete.setSearchTerm}
            onGeneroSelect={vm.handleSelectGenero}
            onGeneroClear={vm.handleClearGenero}
            // Catalogação
            catalogacaoSearchTerm={vm.catalogacaoAutocomplete.searchTerm}
            catalogacaoSuggestions={vm.catalogacaoAutocomplete.suggestions}
            isCatalogacaoSelected={!!vm.form.catalogacaoId}
            onCatalogacaoSearchChange={vm.catalogacaoAutocomplete.setSearchTerm}
            onCatalogacaoSelect={vm.handleSelectCatalogacao}
            onCatalogacaoClear={vm.handleClearCatalogacao}
          />

          <BookCdaFields 
            form={vm.form} 
            mode={vm.mode}
            onChange={vm.handleFormChange} 
          />

          <BookImageField 
            form={vm.form} 
            onChange={vm.handleFormChange} 
          />
        </div>

        {/* Ações */}
        <BookFormActions
          mode={vm.mode}
          isSaving={vm.isSaving}
          isDeleting={vm.isDeleting}
          onSubmit={vm.handleSubmit}
          onCancel={vm.handleCancel}
          onDelete={vm.handleOpenDeleteModal}
        />
      </div>

      {/* Modal de deleção */}
      <DeleteBookModal
        isOpen={vm.showDeleteModal}
        bookTitle={vm.existingBook?.titulo ?? ''}
        isDeleting={vm.isDeleting}
        onClose={vm.handleCloseDeleteModal}
        onConfirm={vm.handleConfirmDelete}
      />
    </div>
  );
};

export default BookFormPage;