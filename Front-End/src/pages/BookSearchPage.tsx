import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Livro, BookFilterType } from '../types';
import { livroApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import BookCard from '../components/books/BookCard';
import SearchBar from '../components/books/SearchBar';
import Img from '../components/assets/bookSearch-img-um.png';
import './BookSearchPage.scss';

const BookSearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToast();

  const initialFilter = (searchParams.get('filter') as BookFilterType) || 'titulo';
  const initialTerm = searchParams.get('term') || '';

  const [currentFilter, setCurrentFilter] = useState<BookFilterType>(initialFilter);
  const [currentTerm, setCurrentTerm] = useState(initialTerm);

  // ✅ Query 1: Busca todos os livros (cacheado por 5 min)
  const { data: allBooks = [] } = useQuery<Livro[]>({
    queryKey: ['livros', 'todos'],
    queryFn: livroApi.getAll,
  });

  // ✅ Query 2: Busca filtrada (só executa se houver termo de busca)
  const {
    data: searchResults = [],
    isLoading: isSearching,
  } = useQuery<Livro[]>({
    queryKey: ['livros', currentFilter, currentTerm],
    queryFn: () => livroApi.searchByFilter(currentFilter, currentTerm),
    enabled: !!currentTerm.trim(), // Só executa se houver termo
  });

  // Side effect: toast quando busca retorna vazio
  useEffect(() => {
    if (currentTerm.trim() && searchResults.length === 0 && !isSearching) {
      showToast('Nenhum livro encontrado', 'info');
    }
  }, [searchResults, currentTerm, isSearching, showToast]);

  // Decide quais livros mostrar: resultado da busca OU todos
  const displayedBooks = currentTerm.trim() ? searchResults : allBooks;

  const handleSearch = (filter: BookFilterType, term: string) => {
    setCurrentFilter(filter);
    setCurrentTerm(term);
    setSearchParams({ filter, term });
  };

  // Sincroniza com URL params na primeira carga
  useEffect(() => {
    if (initialTerm) {
      setCurrentFilter(initialFilter);
      setCurrentTerm(initialTerm);
    }
  }, [initialTerm, initialFilter]);

  return (
    <div className="book-search-page">
      <div className="container">
        <div className="search-header">
          <h1>Buscar Livros</h1>
          <p>Encontre rapidamente o livro que você procura</p>
        </div>

        <div className="search-section">
          <SearchBar onSearch={handleSearch} loading={isSearching} />
        </div>

        <div className="results-section">
          <div className="results-header">
            <h2>
              {currentTerm 
                ? `Resultados para "${currentTerm}"` 
                : 'Todos os livros'}
            </h2>
            <span className="results-count">
              {displayedBooks.length} {displayedBooks.length === 1 ? 'livro' : 'livros'}
            </span>
          </div>

          {displayedBooks.length > 0 ? (
            <div className="books-grid">
              {displayedBooks.map((book: Livro) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <div className="no-results-img">
                <img className="img" src={Img} alt="" />
              </div>
              <h3>Nenhum livro encontrado</h3>
              <p>Tente buscar com outros termos ou filtros</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookSearchPage;