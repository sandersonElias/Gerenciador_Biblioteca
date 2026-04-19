import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Livro } from '../types';
import { livroApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLoading } from '../context/LoadingContext';
import SearchBar from '../components/books/SearchBar';
import Button from '../components/common/Button';
import './HomePage.scss';
import ImgUm from '../components/assets/home-img.png';

const HomePage: React.FC = () => {
  const [popularBooks, setPopularBooks] = useState<Livro[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { isAuthenticated, hasAnyRole } = useAuth();
  const { showToast } = useToast();
  const { withLoading } = useLoading();

  const loadPopularBooks = useCallback(async () => {
    try {
      const books = await withLoading(livroApi.getPopulares(6));
      setPopularBooks(Array.isArray(books) ? books : []);
    } catch (error) {
      showToast('Erro ao carregar livros populares', 'error');
      setPopularBooks([]);
    }
  }, [withLoading, showToast]);

  useEffect(() => {
    loadPopularBooks();
  }, [loadPopularBooks]);

  const goTo = useCallback(
    (index: number, dir: 'next' | 'prev') => {
      if (isAnimating || popularBooks.length === 0) return;
      setDirection(dir);
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex(index);
        setIsAnimating(false);
      }, 350);
    },
    [isAnimating, popularBooks.length]
  );

  const goNext = useCallback(() => {
    const next = (currentIndex + 1) % popularBooks.length;
    goTo(next, 'next');
  }, [currentIndex, popularBooks.length, goTo]);

  const goPrev = useCallback(() => {
    const prev = (currentIndex - 1 + popularBooks.length) % popularBooks.length;
    goTo(prev, 'prev');
  }, [currentIndex, popularBooks.length, goTo]);

  // Auto-advance
  useEffect(() => {
    if (popularBooks.length <= 1) return;
    intervalRef.current = setInterval(goNext, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [goNext, popularBooks.length]);

  const resetInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (popularBooks.length > 1) {
      intervalRef.current = setInterval(goNext, 5000);
    }
  };

  const handlePrev = () => {
    goPrev();
    resetInterval();
  };

  const handleNext = () => {
    goNext();
    resetInterval();
  };

  const handleDotClick = (index: number) => {
    if (index === currentIndex) return;
    goTo(index, index > currentIndex ? 'next' : 'prev');
    resetInterval();
  };

  const handleSearch = (filter: string, term: string) => {
    window.location.href = `/buscar?filter=${filter}&term=${encodeURIComponent(term)}`;
  };

  const currentBook = popularBooks[currentIndex];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Bem-vindo à Biblioteca Monsa</h1>
          <p className="hero-subtitle">
            Um espaço dedicado à Leitura e ao Aprendizado.
          </p>

          <div className="hero-search">
            <SearchBar onSearch={handleSearch} />
          </div>

          {isAuthenticated && hasAnyRole(['ROLE_FUNCIONARIO', 'ROLE_ADMIN']) && (
            <div className="hero-actions">
              <Link to="/emprestimos">
                <Button variant="accent" size="lg">
                  <span>+</span> Novo Empréstimo
                </Button>
              </Link>
              <Link to="/emprestimos">
                <Button variant="secondary" size="lg">
                  ↻ Renovar
                </Button>
              </Link>
              <Link to="/emprestimos">
                <Button variant="outline" size="lg">
                  ↩ Devolução
                </Button>
              </Link>
            </div>
          )}
        </div>

        <div className="hero-image">
          <img src={ImgUm} className="img-um" alt="Ilustração da biblioteca" />
        </div>
      </section>

      {/* Popular Books Carousel */}
      <section className="popular-books">
        <div className="container">
          <div className="section-header">
            <h2>Livros Populares</h2>
            <Link to="/buscar" className="view-all">
              Ver todos →
            </Link>
          </div>

          {popularBooks.length === 0 ? (
            <div className="empty-state">
              <p>Nenhum livro encontrado</p>
            </div>
          ) : (
            <div className="carousel">
              {/* Prev Button */}
              <button
                className="carousel-arrow carousel-arrow--prev"
                onClick={handlePrev}
                aria-label="Livro anterior"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              {/* Card */}
              <div className={`carousel-track ${isAnimating ? `carousel-track--exit-${direction}` : 'carousel-track--enter'}`}>
                {currentBook && (
                  <Link to={`/livro/${currentBook.id}`} className="carousel-card">
                    {/* Capa */}
                    <div className="carousel-cover">
                      {currentBook.urlImg ? (
                        <img src={currentBook.urlImg} alt={`Capa de ${currentBook.titulo}`} />
                      ) : (
                        <div className="carousel-cover-placeholder">
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="carousel-info">
                      <h3 className="carousel-title">{currentBook.titulo}</h3>
                      <p className="carousel-author">{currentBook.autor?.autor || 'Autor desconhecido'}</p>

                      {currentBook.genero?.genero && (
                        <div className="carousel-description">
                          <p><strong>Gênero:</strong> {currentBook.genero.genero}</p>
                        </div>
                      )}

                      <p className="carousel-loans">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                          <polyline points="17 6 23 6 23 12" />
                        </svg>
                        {currentBook.contadorEmprestimos} empréstimos
                      </p>

                      <span className={`carousel-badge ${currentBook.quantidadeDisponivel > 0 ? 'carousel-badge--available' : 'carousel-badge--unavailable'}`}>
                        {currentBook.quantidadeDisponivel > 0 ? 'Disponível' : 'Indisponível'}
                      </span>
                    </div>
                  </Link>
                )}
              </div>

              {/* Next Button */}
              <button
                className="carousel-arrow carousel-arrow--next"
                onClick={handleNext}
                aria-label="Próximo livro"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>

              {/* Dots */}
              <div className="carousel-dots">
                {popularBooks.map((_, i) => (
                  <button
                    key={i}
                    className={`carousel-dot ${i === currentIndex ? 'carousel-dot--active' : ''}`}
                    onClick={() => handleDotClick(i)}
                    aria-label={`Ir para livro ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Busca Rápida</h3>
              <p>Encontre rapidamente o livro que você procura</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📖</div>
              <h3>Reservas Online</h3>
              <p>Reserve seu livro favorito de qualquer lugar</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Acompanhamento</h3>
              <p>Acompanhe seus empréstimos e reservas</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;