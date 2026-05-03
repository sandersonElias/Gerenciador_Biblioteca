// src/pages/TrocarSenhaPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
// import Button from '../components/common/Button';
import './Trocarsenhapage.scss';
import { UserService } from '@/services/user/UserService';

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
      // ✅ UserService.trocarSenha em vez de userApi.trocarSenha
      await UserService.trocarSenha({
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
      {/* Resto do JSX permanece igual */}
    </div>
  );
};

export default TrocarSenhaPage;