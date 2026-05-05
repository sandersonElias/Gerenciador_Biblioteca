import React from 'react';
import { useParams } from 'react-router-dom';
import './BookDetailPage.scss';
import { useBookDetailViewModel } from '@/features/bookDetail/hooks/useBookDetailViewModel';
import { BookCover } from '@/features/bookDetail/components/BookCover';
import { BookActions } from '@/features/bookDetail/components/BookActions';
import { BookInfo } from '@/features/bookDetail/components/BookInfo';
import { ReservationsTable } from '@/features/bookDetail/components/ReservationsTable';
import { ExemplaresTable } from '@/features/bookDetail/components/ExemplaresTable';
import { ReserveModal } from '@/features/bookDetail/components/ReserveModal';

const BookDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const bookId = Number(id);

  // Pega toda a lógica do ViewModel
  const viewModel = useBookDetailViewModel({ bookId });

  // Estados de erro/loading
  if (!viewModel.isValidId) {
    return (
      <div className="book-detail-page">
        <div className="container">
          <div className="error">ID do livro inválido</div>
        </div>
      </div>
    );
  }

  if (viewModel.isLoadingBook || !viewModel.book || !viewModel.availability) {
    return (
      <div className="book-detail-page">
        <div className="container">
          <div className="loading">Carregando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="book-detail-page">
      <div className="container">
        <div className="book-detail">
          {/* Capa do livro */}
          <div className="book-cover-section">
            <BookCover 
              imageUrl={viewModel.book.urlImg} 
              title={viewModel.book.titulo} 
            />

            {/* Ações mobile */}
            <BookActions
              canReserve={viewModel.permissions.canReserve}
              canEdit={viewModel.permissions.canEdit}
              isAvailable={viewModel.availability.isAvailable}
              onReserve={viewModel.handleOpenReserveModal}
              onEdit={viewModel.handleEdit}
              className="book-actions-mobile"
            />
          </div>

          {/* Informações completas */}
          <BookInfo
            book={viewModel.book}
            availability={viewModel.availability}
            reservationCount={viewModel.reservations.length}
            canReserve={viewModel.permissions.canReserve}
            canEdit={viewModel.permissions.canEdit}
            onReserve={viewModel.handleOpenReserveModal}
            onEdit={viewModel.handleEdit}
          />
        </div>

        {/* Tabela de reservas (admin/funcionário) */}
        {viewModel.permissions.canViewReservations && (
          <ReservationsTable reservations={viewModel.reservations} />
        )}

        {/* Tabela de exemplares (admin/funcionário) */}
        {viewModel.permissions.canViewReservations && (
          <ExemplaresTable exemplares={viewModel.exemplares} />
        )}
      </div>

      {/* Modal de confirmação */}
      <ReserveModal
        isOpen={viewModel.showReserveModal}
        bookTitle={viewModel.book.titulo}
        isReserving={viewModel.isReserving}
        onClose={viewModel.handleCloseReserveModal}
        onConfirm={viewModel.handleConfirmReserve}
      />
    </div>
  );
};

export default BookDetailPage;