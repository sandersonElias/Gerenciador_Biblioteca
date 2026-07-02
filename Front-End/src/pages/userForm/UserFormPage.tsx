import React from "react";
import { useUserFormViewModel } from "../../features/userForm/hooks/useUserFormViewModel";
import { ROLE_OPTIONS } from "../../features/userForm/models/UserFormModel";
import Button from "../../components/common/Button";
import "./UserFormPage.scss";

const UserFormPage: React.FC = () => {
  const vm = useUserFormViewModel();

  return (
    <div className="form-page">
      <div className="container">
        {/* Cabeçalho com botão voltar */}
        <div className="form-page__header">
          <button className="btn-back" onClick={vm.handleBack}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Voltar
          </button>
          <div>
            <h1>Cadastrar Novo Usuário</h1>
            <p>Crie uma nova conta para acesso ao sistema</p>
          </div>
        </div>

        <form onSubmit={vm.handleSubmit} className="form-card" noValidate>
          {/* Informações pessoais */}
          <div className="form-section">
            <div className="form-section__title">
              <div className="form-section__icon form-section__icon--blue">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              Informações Pessoais
            </div>

            <div className="field-group">
              <div className={`field ${vm.errors.name ? "field--error" : ""}`}>
                <label className="field__label">Nome Completo *</label>
                <input
                  className="field__input"
                  value={vm.form.name}
                  onChange={(e) => vm.handleChange("name", e.target.value)}
                  placeholder="Digite o nome completo"
                />
                {vm.errors.name && (
                  <span className="field__error">{vm.errors.name}</span>
                )}
              </div>

              <div className={`field ${vm.errors.email ? "field--error" : ""}`}>
                <label className="field__label">E-mail *</label>
                <input
                  className="field__input"
                  type="email"
                  value={vm.form.email}
                  onChange={(e) => vm.handleChange("email", e.target.value)}
                  placeholder="email@exemplo.com"
                />
                {vm.errors.email && (
                  <span className="field__error">{vm.errors.email}</span>
                )}
              </div>
            </div>
          </div>

          {/* Tipo de usuário */}
          <div className="form-section">
            <div className="form-section__title">
              <div className="form-section__icon form-section__icon--amber">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              Tipo de Acesso
            </div>

            <div className="role-cards">
              {ROLE_OPTIONS.map((r) => (
                <label
                  key={r.value}
                  className={`role-card ${
                    vm.form.role === r.value ? "role-card--selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={r.value}
                    checked={vm.form.role === r.value}
                    onChange={() => vm.handleChange("role", r.value)}
                    className="role-card__radio"
                  />
                  <div className="role-card__check">
                    {vm.form.role === r.value && (
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
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
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              Segurança
            </div>

            <div className="field-group">
              <div
                className={`field ${
                  vm.errors.password ? "field--error" : ""
                }`}
              >
                <label className="field__label">Senha *</label>
                <div className="field__input-wrap">
                  <input
                    className="field__input"
                    type={vm.showPassword ? "text" : "password"}
                    value={vm.form.password}
                    onChange={(e) => vm.handleChange("password", e.target.value)}
                    placeholder="Mínimo 3 caracteres"
                  />
                  <button
                    type="button"
                    className="field__eye"
                    onClick={vm.toggleShowPassword}
                  >
                    {vm.showPassword ? (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                {vm.errors.password && (
                  <span className="field__error">{vm.errors.password}</span>
                )}
              </div>

              <div
                className={`field ${
                  vm.errors.confirmPassword ? "field--error" : ""
                }`}
              >
                <label className="field__label">Confirmar Senha *</label>
                <div className="field__input-wrap">
                  <input
                    className="field__input"
                    type={vm.showConfirm ? "text" : "password"}
                    value={vm.form.confirmPassword}
                    onChange={(e) =>
                      vm.handleChange("confirmPassword", e.target.value)
                    }
                    placeholder="Repita a senha"
                  />
                  <button
                    type="button"
                    className="field__eye"
                    onClick={vm.toggleShowConfirm}
                  >
                    {vm.showConfirm ? (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                {vm.errors.confirmPassword && (
                  <span className="field__error">
                    {vm.errors.confirmPassword}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="form-actions">
            <Button
              type="button"
              variant="ghost"
              onClick={vm.handleBack}
            >
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
