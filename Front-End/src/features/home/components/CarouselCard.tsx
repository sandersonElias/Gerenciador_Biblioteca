// src/features/home/components/CarouselCard.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Livro } from '@/services/livro/types';
import { HomeHelpers } from '../models/HomeModel';

interface CarouselCardProps {
  book: Livro;
}

/**
 * Componente puro que renderiza um card de livro no carrossel
 */
export const CarouselCard: React.FC<CarouselCardProps> = ({ book }) => {
  const isAvailable = HomeHelpers.isBookAvailable(book);

  return (
    <Link to={`/livro/${book.id}`} className="carousel-card">
      {/* Capa do livro */}
      <div className="carousel-cover">
        {book.urlImg ? (
          <img src={book.urlImg} alt={`Capa de ${book.titulo}`} />
        ) : (
          <div className="carousel-cover-placeholder">
            <svg 
              width="48" 
              height="48" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5"
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Informações do livro */}
      <div className="carousel-info">
        <h3 className="carousel-title">{book.titulo}</h3>
        <p className="carousel-author">
          {book.autor?.autor || 'Autor desconhecido'}
        </p>

        {book.genero?.genero && (
          <div className="carousel-description">
            <p>
              <strong>Gênero:</strong> {book.genero.genero}
            </p>
          </div>
        )}

        <p className="carousel-loans">
          <svg 
            width="14" 
            height="14" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
          </svg>
          {book.contadorEmprestimos} empréstimos
        </p>

        <span 
          className={`carousel-badge ${
            isAvailable 
              ? 'carousel-badge--available' 
              : 'carousel-badge--unavailable'
          }`}
        >
          {isAvailable ? 'Disponível' : 'Indisponível'}
        </span>
      </div>
    </Link>
  );
};