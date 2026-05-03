// src/pages/UserFormPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { useLoading } from '../context/LoadingContext';
import Button from '../components/common/Button';
import './UserFormPage.scss';
import { Role, UserRequest } from '@/services/user/types';
import { AuthService } from '@/services/auth/AuthService';

const roles: { value: Role; label: string; desc: string }[] = [
  { value: 'ROLE_ALUNO',       label: 'Aluno',          desc: 'Pode buscar livros, fazer reservas e acompanhar empréstimos' },
  { value: 'ROLE_PROFESSOR',   label: 'Professor',      desc: 'Pode buscar livros, fazer reservas e acompanhar empréstimos' },
  { value: 'ROLE_FUNCIONARIO', label: 'Funcionário',    desc: 'Pode gerenciar empréstimos, renovações e devoluções' },
  { value: 'ROLE_ADMIN',       label: 'Administrador',  desc: 'Acesso total ao sistema, incluindo cadastro de livros e usuários' },
];

const UserFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { withLoading } = useLoading();

  const [formData, setFormData] = useState<UserRequest>({
    name: '', email: '', password: '', role: 'ROLE_ALUNO',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword]       = useState(false);
  const [showConfirm, setShowConfirm]         = useState(false);
  const [errors, setErrors]                   = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.name.trim())   e.name     = 'Nome é obrigatório';
    if (!formData.email.trim())  e.email    = 'E-mail é obrigatório';
    if (!formData.password)      e.password = 'Senha é obrigatória';
    else if (formData.password.length < 3) e.password = 'Mínimo de 3 caracteres';
    if (formData.password !== confirmPassword) e.confirmPassword = 'As senhas não coincidem';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    try {
      // ✅ AuthService.register em vez de authApi.register
      await withLoading(AuthService.register(formData));
      showToast('Usuário cadastrado com sucesso!', 'success');
      navigate('/admin');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Erro ao cadastrar usuário', 'error');
    }
  };

  const change = (field: keyof UserRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <div className="form-page">
      {/* Resto do JSX permanece igual */}
    </div>
  );
};

export default UserFormPage;