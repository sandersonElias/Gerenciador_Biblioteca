import React from 'react';
import { Link } from 'react-router-dom';
import { useLoginViewModel } from '../../features/login/hooks/useLoginViewModel';
import { LoginForm } from '../../features/login/components/LoginForm';
import { LoginIllustration } from '../../features/login/components/LoginIllustration';
import './LoginPage.scss';

/**
 * Página de Login (Orquestrador)
 * Apenas conecta o ViewModel às Views
 */
const LoginPage: React.FC = () => {
  // Pega toda a lógica do ViewModel
  const viewModel = useLoginViewModel();

  return (
    <div className="login-page">
      {/* Botão de fechar */}
      <Link to="/" className="login-close" aria-label="Voltar para o início">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </Link>

      <div className="login-container">
        {/* Ilustração (componente puro) */}
        <LoginIllustration />

        {/* Formulário (componente puro) */}
        <div className="login-form-section">
          <div className="login-form-wrapper">
            <div className="login-header">
              <div className="login-logo-mark">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>
              <h1>Bem-vindo de volta</h1>
              <p className="login-subtitle">Entre com suas credenciais para acessar o sistema</p>
            </div>

            {/* Passa tudo do ViewModel para o Form via props */}
            <LoginForm
              formData={viewModel.formData}
              errors={viewModel.errors}
              showPassword={viewModel.showPassword}
              isLoading={viewModel.isLoading}
              onFieldChange={viewModel.updateField}
              onTogglePassword={viewModel.togglePasswordVisibility}
              onSubmit={viewModel.handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;