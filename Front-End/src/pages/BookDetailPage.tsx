import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Livro, Reserva } from '../types';
import { livroApi, reservaApi } from '../services/api';
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
  const [reservations, setReservations] = useState<Reserva[]>([]);
  const [showReserveModal, setShowReserveModal] = useState(false);
  const { isAuthenticated, hasAnyRole } = useAuth();
  const { showToast } = useToast();
  const { withLoading } = useLoading();

  useEffect(() => {
    if (id) {
      loadBook(parseInt(id));
    }
  }, [id]);

  const loadBook = async (bookId: number) => {
    try {
      const bookData = await withLoading(livroApi.getById(bookId));
      setBook(bookData);
      
      // Load reservations for this book
      if (hasAnyRole(['ROLE_FUNCIONARIO', 'ROLE_ADMIN'])) {
        const reservas = await reservaApi.getByLivro(bookId);
        setReservations(reservas);
      }
    } catch (error) {
      showToast('Erro ao carregar detalhes do livro', 'error');
    }
  };

  const handleReserve = async () => {
    if (!book || !isAuthenticated) return;
    
    try {
      await reservaApi.create(book.id);
      showToast('Livro reservado com sucesso!', 'success');
      setShowReserveModal(false);
      loadBook(book.id);
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Erro ao reservar livro', 'error');
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

  return (
    <div className="book-detail-page">
      <div className="container">
        <div className="book-detail">
          {/* Book Cover */}
          <div className="book-cover-section">
            <div className="book-cover-large">
              {book.urlImg ? (
                <img src={book.urlImg} alt={book.titulo} />
              ) : (
                <div className="cover-placeholder">
                  <span>📚</span>
                </div>
              )}
            </div>
            
            <div className="book-actions-mobile">
              {canReserve && (
                <Button
                  variant={isAvailable ? 'primary' : 'outline'}
                  fullWidth
                  onClick={() => isAvailable ? setShowReserveModal(true) : null}
                  disabled={!isAvailable}
                >
                  {isAvailable ? 'Reservar' : 'Indisponível'}
                </Button>
              )}
              {canEdit && (
                <Button variant="secondary" fullWidth onClick={() => navigate(`/admin/livros/editar/${book.id}`)}>
                  Editar Livro
                </Button>
              )}
            </div>
          </div>

          {/* Book Info */}
          <div className="book-info-section">
            <div className="book-header">
              <span className={`availability-badge ${isAvailable ? 'available' : 'unavailable'}`}>
                {isAvailable ? 'Disponível' : 'Indisponível'}
              </span>
              <h1>{book.titulo}</h1>
              <p className="book-author">{book.autor?.autor}</p>
            </div>

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

            <div className="book-availability">
              <h3>Disponibilidade</h3>
              <div className="availability-bar">
                <div 
                  className="availability-fill"
                  style={{ 
                    width: `${(book.quantidadeDisponivel / book.totalExemplares) * 100}%`,
                    backgroundColor: isAvailable ? '#28a745' : '#dc3545'
                  }}
                />
              </div>
              <p className="availability-text">
                <strong>{book.quantidadeDisponivel}</strong> de <strong>{book.totalExemplares}</strong> exemplares disponíveis
              </p>
            </div>

            <div className="book-stats">
              <div className="stat-item">
                <span className="stat-number">{book.contadorEmprestimos}</span>
                <span className="stat-label">Empréstimos totais</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{reservations.length}</span>
                <span className="stat-label">Reservas ativas</span>
              </div>
            </div>

            {book.descricao && (
              <div className="book-description">
                <h3>Descrição</h3>
                <p>{book.descricao}</p>
              </div>
            )}

            <div className="book-actions-desktop">
              {canReserve && (
                <Button
                  variant={isAvailable ? 'primary' : 'outline'}
                  size="lg"
                  onClick={() => isAvailable ? setShowReserveModal(true) : null}
                  disabled={!isAvailable}
                >
                  {isAvailable ? 'Reservar Livro' : 'Indisponível para reserva'}
                </Button>
              )}
              {canEdit && (
                <Button variant="secondary" size="lg" onClick={() => navigate(`/admin/livros/editar/${book.id}`)}>
                  Editar Livro
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Reservations Table (Staff only) */}
        {hasAnyRole(['ROLE_FUNCIONARIO', 'ROLE_ADMIN']) && reservations.length > 0 && (
          <div className="reservations-section">
            <h2>Reservas deste livro</h2>
            <table className="reservations-table">
              <thead>
                <tr>
                  <th>Usuário</th>
                  <th>Data da Reserva</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map(res => (
                  <tr key={res.id}>
                    <td>{res.user.name}</td>
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
      </div>

      {/* Reserve Modal */}
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
              Confirmar Reserva
            </Button>
          </>
        }
      >
        <div className="reserve-confirm">
          <p>Tem certeza que deseja reservar o livro:</p>
          <strong>{book.titulo}</strong>
          <p className="reserve-note">
            Você será notificado quando o livro estiver disponível para retirada.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default BookDetailPage;