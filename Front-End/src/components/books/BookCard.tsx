import React from "react";
import { Link } from "react-router-dom";
import { Livro } from "../../services/livro/types";
import "./BookCard.scss";

interface BookCardProps {
  book: Livro;
  showActions?: boolean;
  onReserve?: (book: Livro) => void;
}

const BookCard: React.FC<BookCardProps> = ({
  book,
  showActions = true,
  onReserve,
}) => {
  const isAvailable = book.quantidadeDisponivel > 0;

  return (
    <div
      className={`book-card ${!isAvailable ? "book-card--unavailable" : ""}`}
    >
      <Link to={`/livro/${book.id}`} className="book-card-link">
        {/* Capa */}
        <div className="book-cover">
          {book.urlImg ? (
            <img src={book.urlImg} alt={`Capa de ${book.titulo}`} />
          ) : (
            <div className="book-cover-placeholder">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
          )}

          {/* Badge de disponibilidade */}
          <span
            className={`book-badge ${
              isAvailable ? "book-badge--available" : "book-badge--unavailable"
            }`}
          >
            {isAvailable ? "Disponível" : "Indisponível"}
          </span>

          {/* Overlay com contagem */}
          <div className="book-cover-overlay">
            <span className="book-copies-overlay">
              {book.quantidadeDisponivel}/{book.totalExemplares} exemplares
            </span>
          </div>
        </div>

        {/* Informações */}
        <div className="book-info">
          <div className="book-genre-tag">
            {book.genero?.genero || "Gênero não informado"}
          </div>

          <h3 className="book-title">{book.titulo}</h3>
          <p className="book-author">
            {book.autor?.autor || "Autor desconhecido"}
          </p>

          <div className="book-loans">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
            <span>{book.contadorEmprestimos} empréstimos</span>
          </div>
        </div>
      </Link>

      {/* Ações */}
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
