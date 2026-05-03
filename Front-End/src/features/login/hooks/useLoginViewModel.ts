import { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { 
  LoginFormData, 
  LoginFormErrors, 
  LoginValidator 
} from '../models/LoginModel';

/**
 * ViewModel da tela de Login
 * Gerencia todo o estado e lógica de negócio
 */
export const useLoginViewModel = () => {
  // ─────────────────────────────────────────────────────────
  // Estado local
  // ─────────────────────────────────────────────────────────
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ─────────────────────────────────────────────────────────
  // Dependências externas (Contexts, Hooks)
  // ─────────────────────────────────────────────────────────
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // ─────────────────────────────────────────────────────────
  // Ações (métodos que a View pode chamar)
  // ─────────────────────────────────────────────────────────

  /**
   * Atualiza um campo do formulário
   */
  const updateField = useCallback((field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpa o erro do campo quando o usuário começa a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  /**
   * Alterna visibilidade da senha
   */
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  /**
   * Valida o formulário
   * @returns true se válido, false se inválido
   */
  const validateForm = useCallback((): boolean => {
    const validationErrors = LoginValidator.validate(formData);
    setErrors(validationErrors);
    return !LoginValidator.hasErrors(validationErrors);
  }, [formData]);

  /**
   * Submete o formulário de login
   */
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Valida antes de enviar
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Faz login
      const { senhaAlterada } = await login(formData.email, formData.password);

      // Lógica de redirecionamento
      if (!senhaAlterada) {
        // Senha padrão (matrícula): força troca
        showToast('Bem-vindo! Por favor, defina uma nova senha.', 'info');
        navigate('/trocar-senha', { replace: true });
      } else {
        // Login normal: redireciona para onde veio ou home
        showToast('Login realizado com sucesso!', 'success');
        const from = (location.state as any)?.from?.pathname || '/';
        navigate(from, { replace: true });
      }
    } catch (error: any) {
      // Tratamento de erro
      const message = error.response?.data?.message || 'Credenciais inválidas';
      showToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [formData, validateForm, login, showToast, navigate, location]);

  // ─────────────────────────────────────────────────────────
  // Interface pública do ViewModel
  // ─────────────────────────────────────────────────────────
  return {
    // Estado (somente leitura para a View)
    formData,
    errors,
    showPassword,
    isLoading,
    
    // Ações (métodos que a View pode chamar)
    updateField,
    togglePasswordVisibility,
    handleSubmit,
  };
};