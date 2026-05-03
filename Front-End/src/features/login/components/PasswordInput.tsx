import React from 'react';

interface PasswordInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  showPassword: boolean;
  onToggleVisibility: () => void;
  error?: string;
  placeholder?: string;
}

const EyeIcon = ({ open }: { open: boolean }) =>
  open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

/**
 * Componente puro de input de senha
 * Sem lógica, só apresentação
 */
export const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  label,
  value,
  onChange,
  showPassword,
  onToggleVisibility,
  error,
  placeholder = '••••••••',
}) => {
  return (
    <div className="form-field">
      <label htmlFor={id} className="form-label">{label}</label>
      <div className={`form-input-wrapper ${error ? 'form-input-wrapper--error' : ''}`}>
        <span className="form-input-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </span>
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete="current-password"
          className="form-input form-input--password"
          aria-describedby={error ? `${id}-error` : undefined}
        />
        <button
          type="button"
          className="form-eye-btn"
          onClick={onToggleVisibility}
          aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
        >
          <EyeIcon open={showPassword} />
        </button>
      </div>
      {error && (
        <span id={`${id}-error`} className="form-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};