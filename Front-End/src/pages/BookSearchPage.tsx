import React from "react";
import SearchBar from "../components/books/SearchBar";
import BookSearchHeader from "../features/bookSearch/components/BookSearchHeader";
import BookSearchResults from "../features/bookSearch/components/BookSearchResults";
import { useBookSearchViewModel } from "../features/bookSearch/hooks/useBookSearchViewModel";
import "./BookSearchPage.scss";

const BookSearchPage: React.FC = () => {
  const vm = useBookSearchViewModel();

  return (
    <div className="book-search-page">
      <div className="container">
        <BookSearchHeader />
        <div className="search-section">
          <SearchBar onSearch={vm.handleSearch} loading={vm.isSearching} />
        </div>
        <BookSearchResults
          currentTerm={vm.currentTerm}
          displayedBooks={vm.displayedBooks}
        />
      </div>
    </div>
  );
};

export default BookSearchPage;
