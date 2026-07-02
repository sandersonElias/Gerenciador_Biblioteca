import React, { useState, useCallback } from "react";
import { BookFilterType } from "../../types/filters";
import "./SearchBar.scss";

interface SearchBarProps {
  onSearch: (filter: BookFilterType, term: string) => void;
  loading?: boolean;
}

const filters: { value: BookFilterType; label: string }[] = [
  { value: "titulo", label: "Título" },
  { value: "autor", label: "Autor" },
  { value: "genero", label: "Gênero" },
  { value: "catalogacao", label: "Catalogação" },
];

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, loading = false }) => {
  const [filter, setFilter] = useState<BookFilterType>("titulo");
  const [term, setTerm] = useState("");

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (term.trim()) {
        onSearch(filter, term.trim());
      }
    },
    [filter, term, onSearch],
  );

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <div className="search-input-wrapper">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as BookFilterType)}
          className="search-filter"
          aria-label="Filtrar por"
        >
          {filters.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>

        <input
          type="text"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder={`Digite o ${filters
            .find((f) => f.value === filter)
            ?.label.toLowerCase()}...`}
          className="search-input"
          aria-label="Termo de busca"
        />

        <button
          type="submit"
          className="search-button"
          disabled={loading || !term.trim()}
          aria-label="Buscar"
        >
          {loading ? (
            <span className="search-spinner" />
          ) : (
            <>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <span>Buscar</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
