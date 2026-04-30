import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { userApi } from '../services/api';
import Button from '../components/common/Button';
import './Trocarsenhapage.scss';

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

const MIN_LENGTH = 6;

const TrocarSenhaPage: React.FC = () => {
  const { user, marcarSenhaAlterada } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');

  const [showAtual, setShowAtual] = useState(false);
  const [showNova, setShowNova] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!senhaAtual) newErrors.senhaAtual = 'Senha atual é obrigatória';
    if (!novaSenha) {
      newErrors.novaSenha = 'Nova senha é obrigatória';
    } else if (novaSenha.length < MIN_LENGTH) {
      newErrors.novaSenha = `A nova senha deve ter no mínimo ${MIN_LENGTH} caracteres`;
    } else if (novaSenha === senhaAtual) {
      newErrors.novaSenha = 'A nova senha deve ser diferente da atual';
    }

    if (!confirmacao) {
      newErrors.confirmacao = 'Confirme a nova senha';
    } else if (confirmacao !== novaSenha) {
      newErrors.confirmacao = 'A confirmação não confere com a nova senha';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await userApi.trocarSenha({
        senhaAtual,
        novaSenha,
        confirmacaoNovaSenha: confirmacao,
      });

      marcarSenhaAlterada();
      showToast('Senha alterada com sucesso!', 'success');
      navigate('/', { replace: true });
    } catch (error: any) {
      const apiMessage = error?.response?.data?.message;
      showToast(apiMessage || 'Não foi possível trocar a senha. Tente novamente.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="trocar-senha-page">
      <div className="trocar-senha-card">
        <div className="trocar-senha-card__header">
          <div className="trocar-senha-card__icon" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h1>Trocar senha</h1>
          <p className="trocar-senha-card__subtitle">
            {user?.senhaAlterada
              ? 'Atualize sua senha de acesso ao sistema.'
              : 'Você está usando a senha padrão. Defina uma nova senha para continuar com segurança.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="trocar-senha-form" noValidate>
          {/* Senha atual */}
          <div className="form-field">
            <label htmlFor="senhaAtual" className="form-label">Senha atual</label>
            <div className={`form-input-wrapper ${errors.senhaAtual ? 'form-input-wrapper--error' : ''}`}>
              <input
                id="senhaAtual"
                type={showAtual ? 'text' : 'password'}
                value={senhaAtual}
                onChange={(e) => {
                  setSenhaAtual(e.target.value);
                  if (errors.senhaAtual) setErrors((p) => ({ ...p, senhaAtual: '' }));
                }}
                placeholder={user?.senhaAlterada ? 'Sua senha atual' : 'Sua matrícula'}
                autoComplete="current-password"
                className="form-input form-input--password"
              />
              <button
                type="button"
                className="form-eye-btn"
                onClick={() => setShowAtual((v) => !v)}
                aria-label={showAtual ? 'Ocultar senha' : 'Mostrar senha'}
              >
                <EyeIcon open={showAtual} />
              </button>
            </div>
            {errors.senhaAtual && <span className="form-error" role="alert">{errors.senhaAtual}</span>}
          </div>

          {/* Nova senha */}
          <div className="form-field">
            <label htmlFor="novaSenha" className="form-label">Nova senha</label>
            <div className={`form-input-wrapper ${errors.novaSenha ? 'form-input-wrapper--error' : ''}`}>
              <input
                id="novaSenha"
                type={showNova ? 'text' : 'password'}
                value={novaSenha}
                onChange={(e) => {
                  setNovaSenha(e.target.value);
                  if (errors.novaSenha) setErrors((p) => ({ ...p, novaSenha: '' }));
                }}
                placeholder={`Mínimo ${MIN_LENGTH} caracteres`}
                autoComplete="new-password"
                className="form-input form-input--password"
              />
              <button
                type="button"
                className="form-eye-btn"
                onClick={() => setShowNova((v) => !v)}
                aria-label={showNova ? 'Ocultar senha' : 'Mostrar senha'}
              >
                <EyeIcon open={showNova} />
              </button>
            </div>
            {errors.novaSenha && <span className="form-error" role="alert">{errors.novaSenha}</span>}
          </div>

          {/* Confirmação */}
          <div className="form-field">
            <label htmlFor="confirmacao" className="form-label">Confirmar nova senha</label>
            <div className={`form-input-wrapper ${errors.confirmacao ? 'form-input-wrapper--error' : ''}`}>
              <input
                id="confirmacao"
                type={showConfirm ? 'text' : 'password'}
                value={confirmacao}
                onChange={(e) => {
                  setConfirmacao(e.target.value);
                  if (errors.confirmacao) setErrors((p) => ({ ...p, confirmacao: '' }));
                }}
                placeholder="Repita a nova senha"
                autoComplete="new-password"
                className="form-input form-input--password"
              />
              <button
                type="button"
                className="form-eye-btn"
                onClick={() => setShowConfirm((v) => !v)}
                aria-label={showConfirm ? 'Ocultar senha' : 'Mostrar senha'}
              >
                <EyeIcon open={showConfirm} />
              </button>
            </div>
            {errors.confirmacao && <span className="form-error" role="alert">{errors.confirmacao}</span>}
          </div>

          <div className="trocar-senha-form__actions">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
            >
              Alterar senha
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrocarSenhaPage;