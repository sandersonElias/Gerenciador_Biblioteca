import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Livro } from '../types';
import { livroApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLoading } from '../context/LoadingContext';
import BookCard from '../components/books/BookCard';
import SearchBar from '../components/books/SearchBar';
import Button from '../components/common/Button';
import './HomePage.scss';
import ImgUm from '../components/assets/home-img-dois.png'

const HomePage: React.FC = () => {
  const [popularBooks, setPopularBooks] = useState<Livro[]>([]);
  const { isAuthenticated, hasAnyRole } = useAuth();
  const { showToast } = useToast();
  const { withLoading } = useLoading();

  useEffect(() => {
    loadPopularBooks();
  }, []);

  const loadPopularBooks = async () => {
    try {
      const books = await withLoading(livroApi.getPopulares(6));
      setPopularBooks(books);
    } catch (error) {
      showToast('Erro ao carregar livros populares', 'error');
    }
  };

  const handleSearch = (filter: string, term: string) => {
    // Navigate to search page with params
    window.location.href = `/buscar?filter=${filter}&term=${encodeURIComponent(term)}`;
  };

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
          <img src={ImgUm} className='img-um' />
        </div>
      </section>

      {/* Popular Books Section */}
      <section className="popular-books">
        <div className="container">
          <div className="section-header">
            <h2>Livros Populares</h2>
            <Link to="/buscar" className="view-all">
              Ver todos →
            </Link>
          </div>
          
          <div className="books-grid">
            {popularBooks.map(book => (
              <BookCard 
                key={book.id} 
                book={book}
                showActions={false}
              />
            ))}
          </div>
          
          {popularBooks.length === 0 && (
            <div className="empty-state">
              <p>Nenhum livro encontrado</p>
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