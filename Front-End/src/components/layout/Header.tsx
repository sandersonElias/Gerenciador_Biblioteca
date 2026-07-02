import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LogoImg from "../assets/logo_monsa.png";
import { Role } from "../../services/user/types";
import { useAuth } from "../../context/AuthContext";
import "./Header.scss";

const Header: React.FC = () => {
  const { user, isAuthenticated, logout, hasAnyRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    setUserMenuOpen(false);
    navigate("/");
  };

  // Fecha o dropdown do usuário ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fecha menu mobile ao navegar
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  const userInitial = user?.email?.charAt(0).toUpperCase() || "?";

  const navLinks: {
    to: string;
    label: string;
    always?: boolean;
    roles?: Role[];
  }[] = [
    { to: "/", label: "Home", always: true },
    { to: "/buscar", label: "Buscar Livro", always: true },
    {
      to: "/emprestimos",
      label: "Empréstimos",
      roles: ["ROLE_FUNCIONARIO", "ROLE_ADMIN"],
    },
    {
      to: "/relatorios",
      label: "Relatórios",
      roles: ["ROLE_FUNCIONARIO", "ROLE_ADMIN"],
    },
    {
      to: "/meu-perfil",
      label: "Meu Perfil",
      roles: ["ROLE_ALUNO", "ROLE_FUNCIONARIO", "ROLE_ADMIN"],
    },
    { to: "/admin", label: "Admin", roles: ["ROLE_ADMIN"] },
  ];

  const visibleLinks = navLinks.filter(
    (l) => l.always || (isAuthenticated && l.roles && hasAnyRole(l.roles)),
  );

  return (
    <>
      <header className="header" role="banner">
        <div className="header-container">
          {/* Logo */}
          <Link to="/" className="header-logo">
            <img
              className="logo-img"
              src={LogoImg}
              alt="Logo Biblioteca Monsa"
            />
            <span className="logo-text">Biblioteca Monsa</span>
          </Link>

          {/* Nav desktop */}
          <nav
            className="header-nav"
            role="navigation"
            aria-label="Navegação principal"
          >
            {visibleLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`nav-link ${
                  isActive(l.to) ? "nav-link--active" : ""
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Ações desktop */}
          <div className="header-actions">
            {isAuthenticated ? (
              <div className="user-menu" ref={userMenuRef}>
                <button
                  className="user-avatar"
                  onClick={() => setUserMenuOpen((v) => !v)}
                  aria-label="Menu do usuário"
                  aria-expanded={userMenuOpen}
                >
                  {userInitial}
                </button>

                {userMenuOpen && (
                  <div className="user-dropdown">
                    <p className="user-dropdown__email">{user?.email}</p>
                    <hr className="user-dropdown__divider" />
                    <button
                      className="user-dropdown__logout"
                      onClick={handleLogout}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-login">
                Entrar
              </Link>
            )}
          </div>

          {/* Hambúrguer mobile */}
          <button
            className={`mobile-menu-btn ${
              mobileOpen ? "mobile-menu-btn--open" : ""
            }`}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* Drawer mobile */}
      <>
        {/* Overlay */}
        <div
          className={`mobile-overlay ${
            mobileOpen ? "mobile-overlay--visible" : ""
          }`}
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />

        {/* Painel lateral */}
        <div
          className={`mobile-drawer ${mobileOpen ? "mobile-drawer--open" : ""}`}
          role="dialog"
          aria-label="Menu de navegação"
        >
          <div className="mobile-drawer__header">
            <img className="logo-img" src={LogoImg} alt="Logo" />
            <span className="mobile-drawer__title">Biblioteca Monsa</span>
            <button
              className="mobile-drawer__close"
              onClick={() => setMobileOpen(false)}
              aria-label="Fechar menu"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <nav className="mobile-drawer__nav">
            {visibleLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`mobile-nav-link ${
                  isActive(l.to) ? "mobile-nav-link--active" : ""
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="mobile-drawer__footer">
            {isAuthenticated ? (
              <>
                <p className="mobile-drawer__email">{user?.email}</p>
                <button
                  className="mobile-drawer__logout"
                  onClick={handleLogout}
                >
                  Sair
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="btn-login"
                onClick={() => setMobileOpen(false)}
              >
                Entrar
              </Link>
            )}
          </div>
        </div>
      </>
    </>
  );
};

export default Header;
