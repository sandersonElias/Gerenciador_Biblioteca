import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import './AdminPage.scss';

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'books' | 'users'>('books');

  return (
    <div className="admin-page">
      <div className="container">
        <div className="page-header">
          <h1>Painel Administrativo</h1>
          <p>Gerencie livros, usuários e configurações do sistema</p>
        </div>

        <div className="admin-tabs">
          <button
            className={`tab ${activeTab === 'books' ? 'active' : ''}`}
            onClick={() => setActiveTab('books')}
          >
            📚 Livros
          </button>
          <button
            className={`tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            👤 Usuários
          </button>
        </div>

        {activeTab === 'books' && (
          <div className="admin-section">
            <div className="section-header">
              <h2>Gerenciamento de Livros</h2>
              <Button 
                variant="primary" 
                onClick={() => navigate('/admin/livros/novo')}
              >
                + Cadastrar Livro
              </Button>
            </div>
            
            <div className="admin-cards">
              <div 
                className="admin-card"
                onClick={() => navigate('/admin/livros/novo')}
              >
                <div className="card-icon">➕</div>
                <h3>Cadastrar Livro</h3>
                <p>Adicione novos livros ao catálogo da biblioteca</p>
              </div>
              
              <div 
                className="admin-card"
                onClick={() => navigate('/buscar')}
              >
                <div className="card-icon">✏️</div>
                <h3>Editar Livros</h3>
                <p>Atualize informações de livros existentes</p>
              </div>
              
              <div 
                className="admin-card"
                onClick={() => navigate('/relatorios')}
              >
                <div className="card-icon">📊</div>
                <h3>Relatórios</h3>
                <p>Visualize estatísticas e relatórios de uso</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="admin-section">
            <div className="section-header">
              <h2>Gerenciamento de Usuários</h2>
              <Button 
                variant="primary" 
                onClick={() => navigate('/admin/usuarios/novo')}
              >
                + Cadastrar Usuário
              </Button>
            </div>
            
            <div className="admin-cards">
              <div 
                className="admin-card"
                onClick={() => navigate('/admin/usuarios/novo')}
              >
                <div className="card-icon">👤</div>
                <h3>Cadastrar Usuário</h3>
                <p>Crie novas contas de alunos, funcionários ou administradores</p>
              </div>
              
              <div 
                className="admin-card"
                onClick={() => navigate('/emprestimos')}
              >
                <div className="card-icon">📋</div>
                <h3>Gerenciar Empréstimos</h3>
                <p>Visualize e gerencie todos os empréstimos ativos</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;