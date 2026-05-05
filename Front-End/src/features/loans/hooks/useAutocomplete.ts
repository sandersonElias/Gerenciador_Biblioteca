import { useState, useEffect } from 'react';

interface UseAutocompleteOptions<T> {
  searchFn: (query: string) => Promise<T[]>;
  minChars?: number;
  debounceMs?: number;
  isSelected: boolean;
}

export const useAutocomplete = <T>({
  searchFn,
  minChars = 3,
  debounceMs = 400,
  isSelected,
}: UseAutocompleteOptions<T>) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<T[]>([]);

  useEffect(() => {
    // Se já tem algo selecionado, limpa sugestões
    if (isSelected) {
      setSuggestions([]);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        if (searchTerm.trim().length >= minChars) {
          const results = await searchFn(searchTerm);
          setSuggestions(results || []);
        } else {
          setSuggestions([]);
        }
      } catch {
        setSuggestions([]);
      }
    }, debounceMs);

    return () => clearTimeout(delay);
  }, [searchTerm, isSelected, searchFn, minChars, debounceMs]);

  const clearSuggestions = () => setSuggestions([]);

  return {
    searchTerm,
    setSearchTerm,
    suggestions,
    clearSuggestions,
  };
};