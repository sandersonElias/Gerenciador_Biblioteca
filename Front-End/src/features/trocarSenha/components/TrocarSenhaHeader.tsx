import React from 'react';

interface TrocarSenhaHeaderProps {
  senhaAlterada?: boolean;
}

const TrocarSenhaHeader: React.FC<TrocarSenhaHeaderProps> = ({ senhaAlterada }) => (
  <div className="trocar-senha-card__header">
    <div className="trocar-senha-card__icon" aria-hidden="true">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    </div>
    <h1>Trocar senha</h1>
    <p className="trocar-senha-card__subtitle">
      {senhaAlterada
        ? 'Atualize sua senha de acesso ao sistema.'
        : 'Você está usando a senha padrão. Defina uma nova senha para continuar com segurança.'}
    </p>
  </div>
);

export default TrocarSenhaHeader;
