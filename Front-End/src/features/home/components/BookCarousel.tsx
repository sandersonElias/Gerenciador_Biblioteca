import React from 'react';
import { Livro } from '@/services/livro/types';
import { CarouselDirection } from '../models/HomeModel';
import { CarouselCard } from './CarouselCard';

interface BookCarouselProps {
  books: Livro[];
  currentBook: Livro | null;
  currentIndex: number;
  isAnimating: boolean;
  direction: CarouselDirection;
  onNext: () => void;
  onPrev: () => void;
  onGoToIndex: (index: number, direction: CarouselDirection) => void;
  onResetAutoPlay: () => void;
}

/**
 * Componente do carrossel de livros populares
 * Recebe toda lógica via props do ViewModel
 */
export const BookCarousel: React.FC<BookCarouselProps> = ({
  books,
  currentBook,
  currentIndex,
  isAnimating,
  direction,
  onNext,
  onPrev,
  onGoToIndex,
  onResetAutoPlay,
}) => {
  // Estado vazio
  if (books.length === 0) {
    return (
      <div className="empty-state">
        <p>Nenhum livro encontrado</p>
      </div>
    );
  }

  const handleNext = () => {
    onNext();
    onResetAutoPlay();
  };

  const handlePrev = () => {
    onPrev();
    onResetAutoPlay();
  };

  const handleDotClick = (index: number) => {
    const dir: CarouselDirection = index > currentIndex ? 'next' : 'prev';
    onGoToIndex(index, dir);
    onResetAutoPlay();
  };

  return (
    <div className="carousel">
      {/* Seta anterior */}
      <button 
        className="carousel-arrow carousel-arrow--prev" 
        onClick={handlePrev}
        aria-label="Livro anterior"
      >
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Track com animação */}
      <div 
        className={`carousel-track ${
          isAnimating 
            ? `carousel-track--exit-${direction}` 
            : 'carousel-track--enter'
        }`}
      >
        {currentBook && <CarouselCard book={currentBook} />}
      </div>

      {/* Seta próxima */}
      <button 
        className="carousel-arrow carousel-arrow--next" 
        onClick={handleNext}
        aria-label="Próximo livro"
      >
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Dots de navegação */}
      <div className="carousel-dots">
        {books.map((_, index) => (
          <button
            key={index}
            className={`carousel-dot ${
              index === currentIndex ? 'carousel-dot--active' : ''
            }`}
            onClick={() => handleDotClick(index)}
            aria-label={`Ir para livro ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};