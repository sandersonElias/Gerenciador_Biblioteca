import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Exemplar, Livro, ReservaResponse } from '../types';
import { exemplarApi, livroApi, reservaApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLoading } from '../context/LoadingContext';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import './BookDetailPage.scss';

const BookDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [book, setBook] = useState<Livro | null>(null);
  const [reservations, setReservations] = useState<ReservaResponse[]>([]);
  const [exemplares, setExemplares] = useState<Exemplar[]>([]);
  const [showReserveModal, setShowReserveModal] = useState(false);

  const { user, isAuthenticated, hasAnyRole } = useAuth();
  const { showToast } = useToast();
  const { withLoading } = useLoading();

  const loadBook = useCallback(async (bookId: number) => {
    try {
      const bookData = await withLoading(livroApi.getById(bookId));
      setBook(bookData);

      if (hasAnyRole(['ROLE_FUNCIONARIO', 'ROLE_ADMIN'])) {
        const [reservas, exs] = await Promise.all([
          reservaApi.getByLivro(bookId),
          exemplarApi.listarPorLivro(bookId),
        ]);
        setReservations(reservas);
        setExemplares(exs);
      }
    } catch (error) {
      showToast('Erro ao carregar detalhes do livro', 'error');
    }
  }, [withLoading, hasAnyRole, showToast]);

  useEffect(() => {
    if (!id) return;
    const bookId = Number(id);
    if (isNaN(bookId)) {
      showToast('ID do livro inválido', 'error');
      return;
    }
    loadBook(bookId);
  }, [id, loadBook, showToast]);

  const handleReserve = async () => {
    if (!book || !isAuthenticated || !user) return;

    try {
      await reservaApi.create({ livroId: book.id, userId: user.id });
      showToast('Livro reservado com sucesso!', 'success');
      setShowReserveModal(false);
      loadBook(book.id);
    } catch (error: any) {
      showToast(
        error.response?.data?.message || 'Erro ao reservar livro',
        'error'
      );
    }
  };

  if (!book) {
    return (
      <div className="book-detail-page">
        <div className="container">
          <div className="loading">Carregando...</div>
        </div>
      </div>
    );
  }

  const isAvailable = book.quantidadeDisponivel > 0;
  const canReserve = isAuthenticated && hasAnyRole(['ROLE_ALUNO', 'ROLE_FUNCIONARIO', 'ROLE_ADMIN']);
  const canEdit = isAuthenticated && hasAnyRole(['ROLE_ADMIN']);
  const availabilityPercentage =
    book.totalExemplares > 0
      ? (book.quantidadeDisponivel / book.totalExemplares) * 100
      : 0;

  return (
    <div className="book-detail-page">
      <div className="container">
        <div className="book-detail">

          {/* ── Capa ── */}
          <div className="book-cover-section">
            <div className="book-cover-large">
              {book.urlImg ? (
                <img src={book.urlImg} alt={book.titulo} />
              ) : (
                <div className="cover-placeholder">
                  <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                </div>
              )}
            </div>

            <div className="book-actions-mobile">
              {canReserve && (
                <Button
                  variant={isAvailable ? 'primary' : 'outline'}
                  fullWidth
                  onClick={() => isAvailable && setShowReserveModal(true)}
                  disabled={!isAvailable}
                >
                  {isAvailable ? 'Reservar' : 'Indisponível'}
                </Button>
              )}
              {canEdit && (
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => navigate(`/admin/livros/editar/${book.id}`)}
                >
                  Editar Livro
                </Button>
              )}
            </div>
          </div>

          {/* ── Informações ── */}
          <div className="book-info-section">

            {/* Cabeçalho */}
            <div className="book-header">
              <span className={`availability-badge ${isAvailable ? 'available' : 'unavailable'}`}>
                {isAvailable ? 'Disponível' : 'Indisponível'}
              </span>
              <h1>{book.titulo}</h1>
              <p className="book-author">{book.autor?.autor}</p>
            </div>

            {/* Metadados */}
            <div className="book-meta">
              <div className="meta-item">
                <span className="meta-label">Editora</span>
                <span className="meta-value">{book.editora || 'Não informada'}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Gênero</span>
                <span className="meta-value">{book.genero?.genero || 'Não informado'}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Catalogação</span>
                <span className="meta-value">{book.catalogacao?.catalogacao || 'Não informada'}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">CDD</span>
                <span className="meta-value">{book.cdd || 'Não informado'}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Localização</span>
                <span className="meta-value">{book.localizacao || 'Não informada'}</span>
              </div>
            </div>

            {/* Disponibilidade */}
            <div className="book-availability">
              <h3>Disponibilidade</h3>
              <div className="availability-bar">
                <div
                  className="availability-fill"
                  style={{
                    width: `${availabilityPercentage}%`,
                    backgroundColor: isAvailable ? '#0f6e56' : '#993c1d',
                  }}
                />
              </div>
              <p className="availability-text">
                <strong>{book.quantidadeDisponivel}</strong> de{' '}
                <strong>{book.totalExemplares}</strong> disponíveis
              </p>
            </div>

            {/* Stats */}
            <div className="book-stats">
              <div className="stat-item">
                <span className="stat-number">{book.contadorEmprestimos}</span>
                <span className="stat-label">Empréstimos</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{reservations.length}</span>
                <span className="stat-label">Reservas</span>
              </div>
            </div>

            {/* Descrição */}
            {book.descricao && (
              <div className="book-description">
                <h3>Descrição</h3>
                <p>{book.descricao}</p>
              </div>
            )}

            {/* Ações desktop */}
            <div className="book-actions-desktop">
              {canReserve && (
                <Button
                  variant={isAvailable ? 'primary' : 'outline'}
                  size="lg"
                  onClick={() => isAvailable && setShowReserveModal(true)}
                  disabled={!isAvailable}
                >
                  {isAvailable ? 'Reservar Livro' : 'Indisponível'}
                </Button>
              )}
              {canEdit && (
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate(`/admin/livros/editar/${book.id}`)}
                >
                  Editar Livro
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* ── Tabela de reservas ── */}
        {hasAnyRole(['ROLE_FUNCIONARIO', 'ROLE_ADMIN']) && reservations.length > 0 && (
          <div className="reservations-section">
            <h2>Reservas deste livro</h2>
            <table className="reservations-table">
              <thead>
                <tr>
                  <th>Usuário</th>
                  <th>Data</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map(res => (
                  <tr key={res.id}>
                    <td>{res.user?.name}</td>
                    <td>{new Date(res.dataReserva).toLocaleDateString('pt-BR')}</td>
                    <td>
                      <span className={`status-badge ${res.status.toLowerCase()}`}>
                        {res.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Tabela de exemplares ── */}
        {hasAnyRole(['ROLE_FUNCIONARIO', 'ROLE_ADMIN']) && exemplares.length > 0 && (
          <div className="reservations-section exemplares-section">
            <h2>Exemplares</h2>
            <table className="reservations-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {exemplares.map(ex => (
                  <tr key={ex.id}>
                    <td><strong>{ex.codigo}</strong></td>
                    <td>
                      <span className={`exemplar-badge exemplar-badge--${ex.status.toLowerCase()}`}>
                        {ex.status === 'DISPONIVEL' ? 'Disponível'
                          : ex.status === 'EMPRESTADO' ? 'Emprestado'
                          : 'Reservado'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Modal de reserva ── */}
      <Modal
        isOpen={showReserveModal}
        onClose={() => setShowReserveModal(false)}
        title="Confirmar Reserva"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowReserveModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleReserve}>
              Confirmar
            </Button>
          </>
        }
      >
        <div className="reserve-confirm">
          <p>Deseja reservar:</p>
          <strong>{book.titulo}</strong>
          <p className="reserve-note">
            Você terá prioridade para retirada.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default BookDetailPage;