import React from "react";
import BookCard from "../../../components/books/BookCard";
import Img from "../../../components/assets/bookSearch-img-um.png";
import { Livro } from "../../../services/livro/types";

interface BookSearchResultsProps {
  currentTerm: string;
  displayedBooks: Livro[];
}

const BookSearchResults: React.FC<BookSearchResultsProps> = ({
  currentTerm,
  displayedBooks,
}) => (
  <div className="results-section">
    <div className="results-header">
      <h2>
        {currentTerm ? `Resultados para "${currentTerm}"` : "Todos os livros"}
      </h2>
      <span className="results-count">
        {displayedBooks.length}{" "}
        {displayedBooks.length === 1 ? "livro" : "livros"}
      </span>
    </div>

    {displayedBooks.length > 0 ? (
      <div className="books-grid">
        {displayedBooks.map((book) => (
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
);

export default BookSearchResults;
