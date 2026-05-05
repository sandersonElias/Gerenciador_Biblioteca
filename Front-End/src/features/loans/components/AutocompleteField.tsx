import React from 'react';

interface AutocompleteFieldProps<T> {
  label: string;
  icon: React.ReactNode;
  value: string;
  placeholder: string;
  suggestions: T[];
  isSelected: boolean;
  onChange: (value: string) => void;
  onSelect: (item: T) => void;
  renderSuggestion: (item: T) => React.ReactNode;
}

/**
 * Componente genérico de campo com autocomplete
 * Reutilizável para qualquer tipo de dado
 */
export const AutocompleteField = <T,>({
  label,
  icon,
  value,
  placeholder,
  suggestions,
  isSelected,
  onChange,
  onSelect,
  renderSuggestion,
}: AutocompleteFieldProps<T>) => {
  return (
    <div className="loan-form__field autocomplete">
      <label className="loan-form__label">
        {icon}
        {label}
      </label>
      <div className={`loan-form__input-wrap ${isSelected ? 'loan-form__input-wrap--selected' : ''}`}>
        <input
          className="loan-form__input"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
        {isSelected && (
          <span className="loan-form__check">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </span>
        )}
      </div>
      {suggestions.length > 0 && (
        <ul className="loan-form__suggestions">
          {suggestions.map((item, index) => (
            <li key={index} onClick={() => onSelect(item)}>
              {renderSuggestion(item)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};