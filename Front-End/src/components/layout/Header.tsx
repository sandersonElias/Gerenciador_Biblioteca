import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LogoImg from '../assets/logo_monsa.png';
import './Header.scss';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout, hasAnyRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header" role="banner">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <div className="logo-icon">
            <img className='logo-img' src={LogoImg} alt="" />
          </div>
          <span>Biblioteca Monsa</span>
        </Link>

        <nav className="header-nav" role="navigation" aria-label="Navegação principal">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/buscar" className="nav-link">Buscar Livro</Link>
          
          {isAuthenticated && hasAnyRole(['ROLE_FUNCIONARIO', 'ROLE_ADMIN']) && (
            <>
              <Link to="/emprestimos" className="nav-link">Empréstimos</Link>
              <Link to="/relatorios" className="nav-link">Relatórios</Link>
            </>
          )}
          
          {isAuthenticated && hasAnyRole(['ROLE_ALUNO', 'ROLE_FUNCIONARIO', 'ROLE_ADMIN']) && (
            <Link to="/reservas" className="nav-link">Minhas Reservas</Link>
          )}
          
          {isAuthenticated && hasAnyRole(['ROLE_ADMIN']) && (
            <Link to="/admin" className="nav-link">Admin</Link>
          )}
        </nav>

        <div className="header-actions">
          {isAuthenticated ? (
            <div className="user-menu">
              <span className="user-name">{user?.email}</span>
              <button 
                onClick={handleLogout}
                className="btn-logout"
                aria-label="Sair"
              >
                Sair
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-login">
              Entrar
            </Link>
          )}
        </div>

        <button 
          className="mobile-menu-btn"
          aria-label="Abrir menu"
          aria-expanded="false"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
};

export default Header;