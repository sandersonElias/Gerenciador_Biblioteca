import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPage.scss';

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'books' | 'users'>('books');

  return (
    <div className="admin-page">
      <div className="container">

        {/* ── Cabeçalho ── */}
        <div className="admin-header">
          <div className="admin-header__text">
            <h1>Painel Administrativo</h1>
            <p>Gerencie livros, usuários e configurações do sistema</p>
          </div>
        </div>

        {/* ── Abas ── */}
        <div className="admin-tabs">
          <button
            className={`admin-tab ${activeTab === 'books' ? 'admin-tab--active' : ''}`}
            onClick={() => setActiveTab('books')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
            Livros
          </button>
          <button
            className={`admin-tab ${activeTab === 'users' ? 'admin-tab--active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            Usuários
          </button>
        </div>

        {/* ── Seção Livros ── */}
        {activeTab === 'books' && (
          <div className="admin-section">
            <div className="admin-section__header">
              <div>
                <h2>Gerenciamento de Livros</h2>
                <p>Cadastre, edite e acompanhe o acervo da biblioteca</p>
              </div>
              <button className="btn-primary" onClick={() => navigate('/admin/livros/novo')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Cadastrar Livro
              </button>
            </div>

            <div className="admin-cards">
              <div className="admin-card admin-card--blue" onClick={() => navigate('/admin/livros/novo')}>
                <div className="admin-card__icon">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </div>
                <div className="admin-card__body">
                  <h3>Cadastrar Livro</h3>
                  <p>Adicione novos livros ao catálogo da biblioteca</p>
                </div>
                <svg className="admin-card__arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </div>

              <div className="admin-card admin-card--teal" onClick={() => navigate('/buscar')}>
                <div className="admin-card__icon">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </div>
                <div className="admin-card__body">
                  <h3>Editar Livros</h3>
                  <p>Atualize informações de livros existentes no acervo</p>
                </div>
                <svg className="admin-card__arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </div>

              <div className="admin-card admin-card--amber" onClick={() => navigate('/relatorios')}>
                <div className="admin-card__icon">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
                    <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
                  </svg>
                </div>
                <div className="admin-card__body">
                  <h3>Relatórios</h3>
                  <p>Visualize estatísticas e relatórios de uso do sistema</p>
                </div>
                <svg className="admin-card__arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* ── Seção Usuários ── */}
        {activeTab === 'users' && (
          <div className="admin-section">
            <div className="admin-section__header">
              <div>
                <h2>Gerenciamento de Usuários</h2>
                <p>Crie e gerencie contas de alunos e funcionários</p>
              </div>
              <button className="btn-primary" onClick={() => navigate('/admin/usuarios/novo')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Cadastrar Usuário
              </button>
            </div>

            <div className="admin-cards">
              <div className="admin-card admin-card--blue" onClick={() => navigate('/admin/usuarios/novo')}>
                <div className="admin-card__icon">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="8.5" cy="7" r="4"/>
                    <line x1="20" y1="8" x2="20" y2="14"/><line x1="17" y1="11" x2="23" y2="11"/>
                  </svg>
                </div>
                <div className="admin-card__body">
                  <h3>Cadastrar Usuário</h3>
                  <p>Crie novas contas de alunos, funcionários ou administradores</p>
                </div>
                <svg className="admin-card__arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </div>

              <div className="admin-card admin-card--teal" onClick={() => navigate('/emprestimos')}>
                <div className="admin-card__icon">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10 9 9 9 8 9"/>
                  </svg>
                </div>
                <div className="admin-card__body">
                  <h3>Gerenciar Empréstimos</h3>
                  <p>Visualize e gerencie todos os empréstimos ativos do sistema</p>
                </div>
                <svg className="admin-card__arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminPage;