import React from "react";
import { useAdminViewModel } from "../../features/admin/hooks/useAdminViewModel";
import { AdminTabs } from "../../features/admin/components/AdminTabs";
import { AdminSection } from "../../features/admin/components/AdminSection";
import "./AdminPage.scss";

const AdminPage: React.FC = () => {
  // Pega toda a lógica do ViewModel
  const viewModel = useAdminViewModel();

  return (
    <div className="admin-page">
      <div className="container">
        {/* Cabeçalho */}
        <div className="admin-header">
          <div className="admin-header__text">
            <h1>Painel Administrativo</h1>
            <p>Gerencie livros, usuários e configurações do sistema</p>
          </div>
        </div>

        {/* Abas de navegação */}
        <AdminTabs
          tabs={viewModel.tabs}
          activeTab={viewModel.activeTab}
          onTabChange={viewModel.handleTabChange}
        />

        {/* Seção ativa (genérica para ambas as abas) */}
        <AdminSection
          title={viewModel.sectionInfo.title}
          description={viewModel.sectionInfo.description}
          createRoute={viewModel.createRoute}
          createButtonLabel={viewModel.createButtonLabel}
          cards={viewModel.currentCards}
          onNavigate={viewModel.handleNavigate}
        />
      </div>
    </div>
  );
};

export default AdminPage;
