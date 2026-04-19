import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Livro, BookFilterType } from '../types';
import { livroApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useLoading } from '../context/LoadingContext';
import BookCard from '../components/books/BookCard';
import SearchBar from '../components/books/SearchBar';
import './BookSearchPage.scss';

const BookSearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState<Livro[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Livro[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const { withLoading } = useLoading();

  const initialFilter = (searchParams.get('filter') as BookFilterType) || 'titulo';
  const initialTerm = searchParams.get('term') || '';

  const handleSearch = useCallback(async (filter: BookFilterType, term: string) => {
    if (!term.trim()) {
      setFilteredBooks(books);
      return;
    }

    setIsLoading(true);
    setSearchParams({ filter, term });

    try {
      const results = await livroApi.searchByFilter(filter, term);
      setFilteredBooks(results);
      if (results.length === 0) {
        showToast('Nenhum livro encontrado', 'info');
      }
    } catch (error) {
      showToast('Erro na busca', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [books, setSearchParams, showToast]);

  const loadBooks = useCallback(async () => {
    try {
      const allBooks = await withLoading(livroApi.getAll());
      setBooks(allBooks);
      setFilteredBooks(allBooks);
    } catch (error) {
      showToast('Erro ao carregar livros', 'error');
    }
  }, [withLoading, showToast]);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  useEffect(() => {
    if (initialTerm) {
      handleSearch(initialFilter, initialTerm);
    }
  }, [initialTerm, initialFilter, handleSearch]);

  return (
    <div className="book-search-page">
      <div className="container">
        <div className="search-header">
          <h1>Buscar Livros</h1>
          <p>Encontre rapidamente o livro que você procura</p>
        </div>

        <div className="search-section">
          <SearchBar onSearch={handleSearch} loading={isLoading} />
        </div>

        <div className="results-section">
          <div className="results-header">
            <h2>
              {initialTerm 
                ? `Resultados para "${initialTerm}"` 
                : 'Todos os livros'}
            </h2>
            <span className="results-count">
              {filteredBooks.length} {filteredBooks.length === 1 ? 'livro' : 'livros'}
            </span>
          </div>

          {filteredBooks.length > 0 ? (
            <div className="books-grid">
              {filteredBooks.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <div className="no-results-icon">📚</div>
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