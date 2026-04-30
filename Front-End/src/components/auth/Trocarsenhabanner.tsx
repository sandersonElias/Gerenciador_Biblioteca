import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Trocarsenhabanner.scss';

const TrocarSenhaBanner: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) return null;
  if (user.senhaAlterada) return null;
  if (location.pathname === '/trocar-senha') return null;

  return (
    <div className="trocar-senha-banner" role="status">
      <div className="trocar-senha-banner__content">
        <span className="trocar-senha-banner__icon" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          </svg>
        </span>

        <div className="trocar-senha-banner__text">
          <strong>Sua senha ainda é a padrão.</strong>
          <span> Por motivos de segurança, recomendamos a troca da sua senha.</span>
        </div>

        <Link to="/trocar-senha" className="trocar-senha-banner__action">
          Trocar agora
        </Link>
      </div>
    </div>
  );
};

export default TrocarSenhaBanner;