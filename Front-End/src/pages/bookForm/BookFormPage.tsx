import React from "react";
import { useParams } from "react-router-dom";
import { useBookFormViewModel } from "../../features/bookForm/hooks/useBookFormViewModel";
import { BookFormHeader } from "../../features/bookForm/componentes/BookFormHeader";
import { BookBasicFields } from "../../features/bookForm/componentes/BookBasicFields";
import { BookCdaFields } from "../../features/bookForm/componentes/BookCdaFields";
import { BookDescricaoField } from "../../features/bookForm/componentes/BookDescricaoField";
import { BookFormActions } from "../../features/bookForm/componentes/BookFormActions";
import { DeleteBookModal } from "../../features/bookForm/componentes/DeleteBookModal";
import "./BookFormPage.scss";

const BookFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const bookId = id ? Number(id) : undefined;
  const vm = useBookFormViewModel({ bookId });

  if (vm.isEdit && vm.isLoadingBook) {
    return (
      <div className="book-form-page">
        <div className="container">
          <div
            style={{ padding: "4rem", textAlign: "center", color: "#64748b" }}
          >
            Carregando livro...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="book-form-page">
      <div className="container">
        <BookFormHeader
          mode={vm.mode}
          bookTitle={vm.existingBook?.titulo}
          bookId={bookId}
        />

        <div className="form-card">
          {/* ── 2 colunas: Básico | Detalhes ── */}
          <div className="form-grid-2">
            {/* Coluna esquerda */}
            <BookBasicFields
              form={vm.form}
              onChange={vm.handleFormChange}
              // Autor
              autorSearchTerm={vm.autorAutocomplete.searchTerm}
              autorSuggestions={vm.autorAutocomplete.suggestions}
              isAutorSelected={!!vm.form.autorId}
              onAutorSearchChange={vm.autorAutocomplete.handleUserInput} // ← handleUserInput
              onAutorSelect={vm.handleSelectAutor}
              onAutorClear={vm.handleClearAutor}
              // Gênero
              generoSearchTerm={vm.generoAutocomplete.searchTerm}
              generoSuggestions={vm.generoAutocomplete.suggestions}
              isGeneroSelected={!!vm.form.generoId}
              onGeneroSearchChange={vm.generoAutocomplete.handleUserInput} // ← handleUserInput
              onGeneroSelect={vm.handleSelectGenero}
              onGeneroClear={vm.handleClearGenero}
              // Catalogação
              catalogacaoSearchTerm={vm.catalogacaoAutocomplete.searchTerm}
              catalogacaoSuggestions={vm.catalogacaoAutocomplete.suggestions}
              isCatalogacaoSelected={!!vm.form.catalogacaoId}
              onCatalogacaoSearchChange={
                vm.catalogacaoAutocomplete.handleUserInput
              } // ← handleUserInput
              onCatalogacaoSelect={vm.handleSelectCatalogacao}
              onCatalogacaoClear={vm.handleClearCatalogacao}
            />

            {/* Coluna direita */}
            <BookCdaFields
              form={vm.form}
              mode={vm.mode}
              onChange={vm.handleFormChange}
            />
          </div>

          {/* ── Linha inteira: Descrição ── */}
          <BookDescricaoField form={vm.form} onChange={vm.handleFormChange} />

          {/* ── Ações ── */}
          <BookFormActions
            mode={vm.mode}
            isSaving={vm.isSaving}
            isDeleting={vm.isDeleting}
            onSubmit={vm.handleSubmit}
            onCancel={vm.handleCancel}
            onDelete={vm.handleOpenDeleteModal}
          />
        </div>
      </div>

      <DeleteBookModal
        isOpen={vm.showDeleteModal}
        bookTitle={vm.existingBook?.titulo ?? ""}
        isDeleting={vm.isDeleting}
        onClose={vm.handleCloseDeleteModal}
        onConfirm={vm.handleConfirmDelete}
      />
    </div>
  );
};

export default BookFormPage;
