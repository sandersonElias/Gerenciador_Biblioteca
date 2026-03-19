import React from 'react';
import { Link } from 'react-router-dom';
import { Livro } from '../../types';
import './BookCard.scss';

interface BookCardProps {
  book: Livro;
  showActions?: boolean;
  onReserve?: (book: Livro) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, showActions = true, onReserve }) => {
  const isAvailable = book.quantidadeDisponivel > 0;
  
  return (
    <div className="book-card">
      <Link to={`/livro/${book.id}`} className="book-card-link">
        <div className="book-cover">
          {book.urlImg ? (
            <img src={book.urlImg} alt={`Capa de ${book.titulo}`} />
          ) : (
            <div className="book-cover-placeholder">
              <span>📚</span>
            </div>
          )}
          <span className={`book-status ${isAvailable ? 'available' : 'unavailable'}`}>
            {isAvailable ? 'Disponível' : 'Indisponível'}
          </span>
        </div>
        
        <div className="book-info">
          <h3 className="book-title">{book.titulo}</h3>
          <p className="book-author">{book.autor?.autor || 'Autor desconhecido'}</p>
          <p className="book-genre">{book.genero?.genero || 'Gênero não especificado'}</p>
          
          <div className="book-stats">
            <span className="book-copies">
              {book.quantidadeDisponivel} / {book.totalExemplares} disponíveis
            </span>
            <span className="book-loans">
              {book.contadorEmprestimos} empréstimos
            </span>
          </div>
        </div>
      </Link>
      
      {showActions && (
        <div className="book-actions">
          <Link to={`/livro/${book.id}`} className="btn-view">
            Ver detalhes
          </Link>
          {onReserve && (
            <button 
              onClick={() => onReserve(book)}
              className="btn-reserve"
              disabled={!isAvailable}
            >
              Reservar
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default BookCard;