import React from 'react';

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  show: boolean;
  onToggleShow: () => void;
  error?: string;
  placeholder?: string;
  autoComplete?: string;
}

const EyeIcon = ({ open }: { open: boolean }) =>
  open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

const PasswordField: React.FC<PasswordFieldProps> = ({
  id,
  label,
  value,
  onChange,
  show,
  onToggleShow,
  error,
  placeholder,
  autoComplete,
}) => (
  <div className="form-field">
    <label htmlFor={id} className="form-label">{label}</label>
    <div className={`form-input-wrapper ${error ? 'form-input-wrapper--error' : ''}`}>
      <input
        id={id}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="form-input form-input--password"
      />
      <button
        type="button"
        className="form-eye-btn"
        onClick={onToggleShow}
        aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}
      >
        <EyeIcon open={show} />
      </button>
    </div>
    {error && <span className="form-error" role="alert">{error}</span>}
  </div>
);

export default PasswordField;
