import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Livro } from '../types';
import { livroApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
// import { useToast } from '../context/ToastContext';
import SearchBar from '../components/books/SearchBar';
import Button from '../components/common/Button';
import './HomePage.scss';
import ImgUm from '../components/assets/home-img.png';

const ANIMATED_WORDS = ['Leitura', 'Conhecimento', 'Aprendizado', 'Descoberta', 'Cultura'];

const HomePage: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [wordIndex, setWordIndex] = useState(0);
  const [wordVisible, setWordVisible] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { isAuthenticated, hasAnyRole } = useAuth();
  // const { showToast } = useToast();

  // ✅ React Query: livros populares (cacheados por 5 min)
  const { data: popularBooks = [] } = useQuery<Livro[]>({
    queryKey: ['livros', 'populares'],
    queryFn: () => livroApi.getPopulares(6),
  });

  // Troca de palavras animadas
  useEffect(() => {
    const id = setInterval(() => {
      setWordVisible(false);
      setTimeout(() => {
        setWordIndex((i) => (i + 1) % ANIMATED_WORDS.length);
        setWordVisible(true);
      }, 350);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  // Carrossel
  const goTo = useCallback((index: number, dir: 'next' | 'prev') => {
    if (isAnimating || popularBooks.length === 0) return;
    setDirection(dir);
    setIsAnimating(true);
    setTimeout(() => { setCurrentIndex(index); setIsAnimating(false); }, 350);
  }, [isAnimating, popularBooks.length]);

  const goNext = useCallback(() => goTo((currentIndex + 1) % popularBooks.length, 'next'),
    [currentIndex, popularBooks.length, goTo]);
  const goPrev = useCallback(() => goTo((currentIndex - 1 + popularBooks.length) % popularBooks.length, 'prev'),
    [currentIndex, popularBooks.length, goTo]);

  useEffect(() => {
    if (popularBooks.length <= 1) return;
    intervalRef.current = setInterval(goNext, 5000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [goNext, popularBooks.length]);

  const resetInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (popularBooks.length > 1) intervalRef.current = setInterval(goNext, 5000);
  };

  const handleSearch = (filter: string, term: string) => {
    window.location.href = `/buscar?filter=${filter}&term=${encodeURIComponent(term)}`;
  };

  const currentBook = popularBooks[currentIndex];

  return (
    <div className="home-page">

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-blob hero-blob--1" aria-hidden="true" />
        <div className="hero-blob hero-blob--2" aria-hidden="true" />

        <div className="hero-content">
          <div className="hero-eyebrow">
            <span className="hero-eyebrow__dot" />
            Biblioteca Digital
          </div>

          <h1 className="hero-title">
            Um espaço para
            <span className={`hero-word ${wordVisible ? 'hero-word--visible' : 'hero-word--hidden'}`}>
              {ANIMATED_WORDS[wordIndex]}
            </span>
          </h1>

          <p className="hero-subtitle">
            Acesse o acervo completo, faça reservas e acompanhe seus empréstimos de qualquer lugar.
          </p>

          <div className="hero-search">
            <SearchBar onSearch={handleSearch} />
          </div>

          {isAuthenticated && hasAnyRole(['ROLE_FUNCIONARIO', 'ROLE_ADMIN']) && (
            <div className="hero-actions">
              <Link to="/emprestimos">
                <Button variant="accent" size="lg">+ Novo Empréstimo</Button>
              </Link>
              <Link to="/emprestimos">
                <Button variant="secondary" size="lg">↻ Renovar</Button>
              </Link>
              <Link to="/emprestimos">
                <Button variant="outline" size="lg">↩ Devolução</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Imagem + stat cards */}
        <div className="hero-visual">
          <div className="hero-image">
            <img src={ImgUm} className="img-um" alt="Ilustração da biblioteca" />
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat__icon hero-stat__icon--blue">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>
              <div>
                <p className="hero-stat__label">Livros no acervo</p>
                <p className="hero-stat__value">---</p>
              </div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat__icon hero-stat__icon--amber">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
                </svg>
              </div>
              <div>
                <p className="hero-stat__label">Empréstimos este mês</p>
                <p className="hero-stat__value">---</p>
              </div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat__icon hero-stat__icon--green">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div>
                <p className="hero-stat__label">Usuários ativos</p>
                <p className="hero-stat__value">---</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Carrossel ── */}
      <section className="popular-books">
        <div className="container">
          <div className="section-header">
            <h2>Livros Populares</h2>
            <Link to="/buscar" className="view-all">Ver todos →</Link>
          </div>

          {popularBooks.length === 0 ? (
            <div className="empty-state"><p>Nenhum livro encontrado</p></div>
          ) : (
            <div className="carousel">
              <button className="carousel-arrow carousel-arrow--prev" onClick={() => { goPrev(); resetInterval(); }} aria-label="Livro anterior">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
              </button>

              <div className={`carousel-track ${isAnimating ? `carousel-track--exit-${direction}` : 'carousel-track--enter'}`}>
                {currentBook && (
                  <Link to={`/livro/${currentBook.id}`} className="carousel-card">
                    <div className="carousel-cover">
                      {currentBook.urlImg
                        ? <img src={currentBook.urlImg} alt={`Capa de ${currentBook.titulo}`} />
                        : <div className="carousel-cover-placeholder">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                            </svg>
                          </div>
                      }
                    </div>
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
                          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
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

              <button className="carousel-arrow carousel-arrow--next" onClick={() => { goNext(); resetInterval(); }} aria-label="Próximo livro">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
              </button>

              <div className="carousel-dots">
                {popularBooks.map((_, i) => (
                  <button key={i}
                    className={`carousel-dot ${i === currentIndex ? 'carousel-dot--active' : ''}`}
                    onClick={() => { goTo(i, i > currentIndex ? 'next' : 'prev'); resetInterval(); }}
                    aria-label={`Ir para livro ${i + 1}`} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="features">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon feature-icon--search">
                <svg className="icon-search" viewBox="0 0 48 48" fill="none">
                  <circle cx="21" cy="21" r="13" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                  <line className="icon-search__handle" x1="31" y1="31" x2="42" y2="42" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                  <line x1="16" y1="21" x2="26" y2="21" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.5"/>
                  <line x1="21" y1="16" x2="21" y2="26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.5"/>
                </svg>
              </div>
              <h3>Busca Rápida</h3>
              <p>Encontre rapidamente o livro que você procura por título, autor ou gênero</p>
              <span className="feature-link">Buscar agora →</span>
            </div>

            <div className="feature-card">
              <div className="feature-icon feature-icon--book">
                <svg className="icon-book" viewBox="0 0 48 48" fill="none">
                  <path className="icon-book__left" d="M24 38 C24 38 10 33 8 20 L8 10 C14 10 20 14 24 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path className="icon-book__right" d="M24 38 C24 38 38 33 40 20 L40 10 C34 10 28 14 24 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="24" y1="20" x2="24" y2="38" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="13" y1="20" x2="21" y2="22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
                  <line x1="13" y1="25" x2="21" y2="27" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
                  <line x1="35" y1="20" x2="27" y2="22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
                  <line x1="35" y1="25" x2="27" y2="27" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
                </svg>
              </div>
              <h3>Reservas Online</h3>
              <p>Reserve seu livro favorito de qualquer lugar e garanta sua vez na fila</p>
              <span className="feature-link">Fazer reserva →</span>
            </div>

            <div className="feature-card">
              <div className="feature-icon feature-icon--chart">
                <svg className="icon-chart" viewBox="0 0 48 48" fill="none">
                  <line x1="8" y1="40" x2="40" y2="40" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                  <rect className="icon-chart__bar icon-chart__bar--1" x="11" y="28" width="7" height="12" rx="2" fill="currentColor" opacity="0.3"/>
                  <rect className="icon-chart__bar icon-chart__bar--2" x="21" y="18" width="7" height="22" rx="2" fill="currentColor" opacity="0.6"/>
                  <rect className="icon-chart__bar icon-chart__bar--3" x="31" y="10" width="7" height="30" rx="2" fill="currentColor"/>
                </svg>
              </div>
              <h3>Acompanhamento</h3>
              <p>Acompanhe seus empréstimos, reservas e histórico de leituras em tempo real</p>
              <span className="feature-link">Ver histórico →</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;