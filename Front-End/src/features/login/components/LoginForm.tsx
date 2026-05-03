import React from 'react';
import Button from '@/components/common/Button';
import { PasswordInput } from './PasswordInput';
import { LoginFormData, LoginFormErrors } from '../models/LoginModel';

interface LoginFormProps {
  formData: LoginFormData;
  errors: LoginFormErrors;
  showPassword: boolean;
  isLoading: boolean;
  onFieldChange: (field: keyof LoginFormData, value: string) => void;
  onTogglePassword: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

/**
 * Componente puro do formulário de login
 * Recebe tudo via props, zero lógica interna
 */
export const LoginForm: React.FC<LoginFormProps> = ({
  formData,
  errors,
  showPassword,
  isLoading,
  onFieldChange,
  onTogglePassword,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="login-form" noValidate>
      {/* Campo de Email */}
      <div className="form-field">
        <label htmlFor="email" className="form-label">E-mail</label>
        <div className={`form-input-wrapper ${errors.email ? 'form-input-wrapper--error' : ''}`}>
          <span className="form-input-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </span>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => onFieldChange('email', e.target.value)}
            placeholder="seu@email.com"
            autoComplete="email"
            className="form-input"
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
        </div>
        {errors.email && (
          <span id="email-error" className="form-error" role="alert">
            {errors.email}
          </span>
        )}
      </div>

      {/* Campo de Senha (componente reutilizável) */}
      <PasswordInput
        id="password"
        label="Senha"
        value={formData.password}
        onChange={(value) => onFieldChange('password', value)}
        showPassword={showPassword}
        onToggleVisibility={onTogglePassword}
        error={errors.password}
      />

      {/* Botão de Submit */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        isLoading={isLoading}
      >
        Entrar
      </Button>
    </form>
  );
};