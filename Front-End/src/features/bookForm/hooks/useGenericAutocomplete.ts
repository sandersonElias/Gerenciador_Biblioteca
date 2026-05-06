import { useState, useEffect, useCallback } from 'react';

interface UseGenericAutocompleteOptions<T> {
  searchFn: (query: string) => Promise<T[]>;
  minChars?: number;
  debounceMs?: number;
  isSelected: boolean;
}

export const useGenericAutocomplete = <T>({
  searchFn,
  minChars = 2,
  debounceMs = 400,
  isSelected,
}: UseGenericAutocompleteOptions<T>) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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

  return {
    searchTerm,
    setSearchTerm,
    suggestions,
    clearSuggestions,
    loading,
  };
};