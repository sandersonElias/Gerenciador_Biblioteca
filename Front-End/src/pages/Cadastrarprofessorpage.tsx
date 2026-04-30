import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { adminUsuariosApi } from '../services/api';
import Button from '../components/common/Button';
import './Cadastrarprofessorpage.scss';

const CadastrarProfessorPage: React.FC = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [matricula, setMatricula] = useState('');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!matricula.trim()) {
      newErrors.matricula = 'Matrícula é obrigatória';
    }

    if (!nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    } else if (nome.trim().length < 3) {
      newErrors.nome = 'Nome deve ter pelo menos 3 caracteres';
    }

    if (!email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[\w.+\-]+@[\w.\-]+\.\w+$/.test(email)) {
      newErrors.email = 'Email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await adminUsuariosApi.cadastrarProfessor({
        matricula: matricula.trim(),
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
      });

      showToast(`Professor ${nome} cadastrado com sucesso!`, 'success');
      navigate('/admin', { replace: true });
    } catch (error: any) {
      const apiMessage = error?.response?.data?.message;
      showToast(apiMessage || 'Não foi possível cadastrar o professor.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="cadastrar-professor-page">
      <div className="cadastrar-professor-card">
        <div className="cadastrar-professor-card__header">
          <h1>Cadastrar Professor</h1>
          <p className="cadastrar-professor-card__subtitle">
            A senha padrão será a matrícula. O professor será solicitado a trocar a senha
            no primeiro acesso.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="cadastrar-professor-form" noValidate>
          {/* Matrícula */}
          <div className="form-field">
            <label htmlFor="matricula" className="form-label">Matrícula</label>
            <div className={`form-input-wrapper ${errors.matricula ? 'form-input-wrapper--error' : ''}`}>
              <input
                id="matricula"
                type="text"
                value={matricula}
                onChange={(e) => {
                  setMatricula(e.target.value);
                  if (errors.matricula) setErrors((p) => ({ ...p, matricula: '' }));
                }}
                placeholder="Ex: PROF001 ou ID funcional SEE"
                className="form-input"
                autoComplete="off"
              />
            </div>
            {errors.matricula && <span className="form-error" role="alert">{errors.matricula}</span>}
          </div>

          {/* Nome */}
          <div className="form-field">
            <label htmlFor="nome" className="form-label">Nome completo</label>
            <div className={`form-input-wrapper ${errors.nome ? 'form-input-wrapper--error' : ''}`}>
              <input
                id="nome"
                type="text"
                value={nome}
                onChange={(e) => {
                  setNome(e.target.value);
                  if (errors.nome) setErrors((p) => ({ ...p, nome: '' }));
                }}
                placeholder="Maria das Dores Silva"
                className="form-input"
                autoComplete="name"
              />
            </div>
            {errors.nome && <span className="form-error" role="alert">{errors.nome}</span>}
          </div>

          {/* Email */}
          <div className="form-field">
            <label htmlFor="email" className="form-label">Email</label>
            <div className={`form-input-wrapper ${errors.email ? 'form-input-wrapper--error' : ''}`}>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((p) => ({ ...p, email: '' }));
                }}
                placeholder="professor@exemplo.com"
                className="form-input"
                autoComplete="email"
              />
            </div>
            {errors.email && <span className="form-error" role="alert">{errors.email}</span>}
          </div>

          <div className="cadastrar-professor-form__actions">
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={() => navigate('/admin')}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
            >
              Cadastrar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CadastrarProfessorPage;