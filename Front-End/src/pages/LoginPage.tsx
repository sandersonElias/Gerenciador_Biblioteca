import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import LoginImg from '../components/assets/login-img.png';
import './LoginPage.scss';

const EyeIcon = ({ open }: { open: boolean }) =>
  open ? (
    // Olho aberto
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    // Olho fechado
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!email) newErrors.email = 'Email é obrigatório';
    if (!password) newErrors.password = 'Senha é obrigatória';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await login(email, password);
      showToast('Login realizado com sucesso!', 'success');
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Credenciais inválidas', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Botão X — volta para o home */}
      <Link to="/" className="login-close" aria-label="Voltar para o início">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </Link>

      <div className="login-container">
        {/* Painel esquerdo — ilustração */}
        <div className="login-illustration">
          <div className="illustration-content">
            <img className="illustration-icon" src={LoginImg} alt="Ilustração biblioteca" />
            <h2>Biblioteca Monsa</h2>
            <p>Conectando alunos ao conhecimento</p>
          </div>
        </div>

        {/* Painel direito — formulário */}
        <div className="login-form-section">
          <div className="login-form-wrapper">

            {/* Cabeçalho do form */}
            <div className="login-header">
              <div className="login-logo-mark">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>
              <h1>Bem-vindo de volta</h1>
              <p className="login-subtitle">Entre com suas credenciais para acessar o sistema</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form" noValidate>
              {/* Campo e-mail */}
              <div className="form-field">
                <label htmlFor="email" className="form-label">
                  E-mail
                </label>
                <div className={`form-input-wrapper ${errors.email ? 'form-input-wrapper--error' : ''}`}>
                  <span className="form-input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </span>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                    }}
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

              {/* Campo senha */}
              <div className="form-field">
                <label htmlFor="password" className="form-label">
                  Senha
                </label>
                <div className={`form-input-wrapper ${errors.password ? 'form-input-wrapper--error' : ''}`}>
                  <span className="form-input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                    }}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="form-input form-input--password"
                    aria-describedby={errors.password ? 'password-error' : undefined}
                  />
                  <button
                    type="button"
                    className="form-eye-btn"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
                {errors.password && (
                  <span id="password-error" className="form-error" role="alert">
                    {errors.password}
                  </span>
                )}
              </div>

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

          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;