import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { useLoading } from '../../context/LoadingContext';
import Button from '../../components/common/Button';
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
      <div className="container">

        {/* Cabeçalho com botão voltar */}
        <div className="form-page__header">
          <button className="btn-back" onClick={() => navigate('/admin')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Voltar
          </button>
          <div>
            <h1>Cadastrar Novo Usuário</h1>
            <p>Crie uma nova conta para acesso ao sistema</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="form-card" noValidate>

          {/* Informações pessoais */}
          <div className="form-section">
            <div className="form-section__title">
              <div className="form-section__icon form-section__icon--blue">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              Informações Pessoais
            </div>

            <div className="field-group">
              <div className={`field ${errors.name ? 'field--error' : ''}`}>
                <label className="field__label">Nome Completo *</label>
                <input
                  className="field__input"
                  value={formData.name}
                  onChange={e => change('name', e.target.value)}
                  placeholder="Digite o nome completo"
                />
                {errors.name && <span className="field__error">{errors.name}</span>}
              </div>

              <div className={`field ${errors.email ? 'field--error' : ''}`}>
                <label className="field__label">E-mail *</label>
                <input
                  className="field__input"
                  type="email"
                  value={formData.email}
                  onChange={e => change('email', e.target.value)}
                  placeholder="email@exemplo.com"
                />
                {errors.email && <span className="field__error">{errors.email}</span>}
              </div>
            </div>
          </div>

          {/* Tipo de usuário */}
          <div className="form-section">
            <div className="form-section__title">
              <div className="form-section__icon form-section__icon--amber">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              Tipo de Acesso
            </div>

            <div className="role-cards">
              {roles.map(r => (
                <label key={r.value} className={`role-card ${formData.role === r.value ? 'role-card--selected' : ''}`}>
                  <input
                    type="radio"
                    name="role"
                    value={r.value}
                    checked={formData.role === r.value}
                    onChange={() => change('role', r.value)}
                    className="role-card__radio"
                  />
                  <div className="role-card__check">
                    {formData.role === r.value && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="role-card__label">{r.label}</p>
                    <p className="role-card__desc">{r.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Segurança */}
          <div className="form-section">
            <div className="form-section__title">
              <div className="form-section__icon form-section__icon--green">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              Segurança
            </div>

            <div className="field-group">
              <div className={`field ${errors.password ? 'field--error' : ''}`}>
                <label className="field__label">Senha *</label>
                <div className="field__input-wrap">
                  <input
                    className="field__input"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={e => { change('password', e.target.value); }}
                    placeholder="Mínimo 3 caracteres"
                  />
                  <button type="button" className="field__eye" onClick={() => setShowPassword(v => !v)}>
                    {showPassword
                      ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
                {errors.password && <span className="field__error">{errors.password}</span>}
              </div>

              <div className={`field ${errors.confirmPassword ? 'field--error' : ''}`}>
                <label className="field__label">Confirmar Senha *</label>
                <div className="field__input-wrap">
                  <input
                    className="field__input"
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Repita a senha"
                  />
                  <button type="button" className="field__eye" onClick={() => setShowConfirm(v => !v)}>
                    {showConfirm
                      ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
                {errors.confirmPassword && <span className="field__error">{errors.confirmPassword}</span>}
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="form-actions">
            <Button type="button" variant="ghost" onClick={() => navigate('/admin')}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" size="lg">
              Cadastrar Usuário
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormPage;