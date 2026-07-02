import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "../../../context/ToastContext";
import { LivroService } from "../../../services/livro/LivroService";
import { Livro } from "../../../services/livro/types";
import { BookFilterType } from "../../../types/filters";
import { INITIAL_BOOK_SEARCH } from "../models/BookSearchModel";

export const useBookSearchViewModel = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToast();

  const initialFilter =
    (searchParams.get("filter") as BookFilterType) ||
    INITIAL_BOOK_SEARCH.currentFilter;
  const initialTerm =
    searchParams.get("term") || INITIAL_BOOK_SEARCH.currentTerm;

  const [currentFilter, setCurrentFilter] =
    useState<BookFilterType>(initialFilter);
  const [currentTerm, setCurrentTerm] = useState(initialTerm);

  const { data: allBooks = [] } = useQuery<Livro[]>({
    queryKey: ["livros", "todos"],
    queryFn: LivroService.getAll,
  });

  const { data: searchResults = [], isLoading: isSearching } = useQuery<
    Livro[]
  >({
    queryKey: ["livros", currentFilter, currentTerm],
    queryFn: () => LivroService.searchByFilter(currentFilter, currentTerm),
    enabled: !!currentTerm.trim(),
  });

  useEffect(() => {
    if (currentTerm.trim() && searchResults.length === 0 && !isSearching) {
      showToast("Nenhum livro encontrado", "info");
    }
  }, [searchResults, currentTerm, isSearching, showToast]);

  useEffect(() => {
    if (initialTerm) {
      setCurrentFilter(initialFilter);
      setCurrentTerm(initialTerm);
    }
  }, [initialTerm, initialFilter]);

  const displayedBooks = currentTerm.trim() ? searchResults : allBooks;

  const handleSearch = (filter: BookFilterType, term: string) => {
    setCurrentFilter(filter);
    setCurrentTerm(term);
    setSearchParams({ filter, term });
  };

  return {
    currentTerm,
    isSearching,
    displayedBooks,
    handleSearch,
  };
};
