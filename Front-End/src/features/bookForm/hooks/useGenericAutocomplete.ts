import { useState, useEffect, useCallback, useRef } from "react";

interface UseGenericAutocompleteOptions<T> {
  searchFn: (query: string) => Promise<T[]>;
  minChars?: number;
  debounceMs?: number;
  isSelected: boolean;
  initialTerm?: string;
}

export const useGenericAutocomplete = <T>({
  searchFn,
  minChars = 2,
  debounceMs = 400,
  isSelected,
  initialTerm = "",
}: UseGenericAutocompleteOptions<T>) => {
  // ✅ Inicia com o initialTerm se fornecido
  const [searchTerm, setSearchTermState] = useState(initialTerm);
  const [suggestions, setSuggestions] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const userTyped = useRef(false);

  // ✅ Quando initialTerm muda (livro carregado), atualiza sem disparar busca
  useEffect(() => {
    if (initialTerm) {
      userTyped.current = false;
      setSearchTermState(initialTerm);
      setSuggestions([]);
    }
  }, [initialTerm]);

  useEffect(() => {
    if (!userTyped.current) return;

    if (isSelected) {
      setSuggestions([]);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        if (searchTerm.trim().length >= minChars) {
          setLoading(true);
          const results = await searchFn(searchTerm);
          setSuggestions(results || []);
        } else {
          setSuggestions([]);
        }
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, debounceMs);

    return () => clearTimeout(delay);
  }, [searchTerm, isSelected, searchFn, minChars, debounceMs]);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
  }, []);

  const handleUserInput = useCallback((value: string) => {
    userTyped.current = true;
    setSearchTermState(value);
  }, []);

  const setSearchTerm = useCallback((value: string) => {
    userTyped.current = false;
    setSearchTermState(value);
    setSuggestions([]);
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    handleUserInput,
    suggestions,
    clearSuggestions,
    loading,
  };
};
