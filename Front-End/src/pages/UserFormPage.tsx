import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRequest, Role } from '../types';
import { authApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useLoading } from '../context/LoadingContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import './UserFormPage.scss';

const UserFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { withLoading } = useLoading();
  
  const [formData, setFormData] = useState<UserRequest>({
    name: '',
    email: '',
    password: '',
    role: 'ROLE_ALUNO',
  });
  
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const roles: { value: Role; label: string }[] = [
    { value: 'ROLE_ALUNO', label: 'Aluno' },
    { value: 'ROLE_FUNCIONARIO', label: 'Funcion�rio' },
    { value: 'ROLE_ADMIN', label: 'Administrador' },
  ];

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Nome � obrigat�rio';
    if (!formData.email.trim()) {
      newErrors.email = 'Email � obrigat�rio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inv�lido';
    }
    if (!formData.password) {
      newErrors.password = 'Senha � obrigat�ria';
    } else if (formData.password.length < 3) {
      newErrors.password = 'Senha deve ter pelo menos 3 caracteres';
    }
    if (formData.password !== confirmPassword) {
      newErrors.confirmPassword = 'As senhas n�o coincidem';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    try {
      await withLoading(authApi.register(formData));
      showToast('Usu�rio cadastrado com sucesso!', 'success');
      navigate('/admin');
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Erro ao cadastrar usu�rio', 'error');
    }
  };

  const handleChange = (field: keyof UserRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="user-form-page">
      <div className="container">
        <div className="form-header">
          <h1>Cadastrar Novo Usu�rio</h1>
          <p>Crie uma nova conta para acesso ao sistema</p>
        </div>

        <form onSubmit={handleSubmit} className="user-form">
          <div className="form-section">
            <h3>Informa��es Pessoais</h3>
            
            <Input
              label="Nome Completo *"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              error={errors.name}
              placeholder="Digite o nome completo"
            />
            
            <Input
              label="Email *"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={errors.email}
              placeholder="email@exemplo.com"
            />
          </div>

          <div className="form-section">
            <h3>Tipo de Usu�rio</h3>
            
            <div className="select-group">
              <label htmlFor="role">Perfil *</label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => handleChange('role', e.target.value as Role)}
                className="form-select"
              >
                {roles.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
              <p className="select-help">
                Escolha o n�vel de acesso do usu�rio no sistema
              </p>
            </div>
          </div>

          <div className="form-section">
            <h3>Seguran�a</h3>
            
            <Input
              label="Senha *"
              type="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              error={errors.password}
              placeholder="��������"
            />
            
            <Input
              label="Confirmar Senha *"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
              placeholder="��������"
            />
          </div>

          <div className="form-actions">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => navigate('/admin')}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary" size="lg">
              Cadastrar Usu�rio
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormPage;
