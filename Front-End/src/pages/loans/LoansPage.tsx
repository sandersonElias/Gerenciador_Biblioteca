import React from 'react';
import { useLoansViewModel } from '../../features/loans/hooks/useLoansViewModel';
import { LoansHeader } from '../../features/loans/components/LoansHeader';
import { LoansTabs } from '../../features/loans/components/LoansTabs';
import { LoansFilters } from '../../features/loans/components/LoansFilters';
import { LoansTable } from '../../features/loans/components/LoansTable';
import { SolicitacoesTab } from '../../features/loans/components/SolicitacoesTab';
import { RenewLoanModal } from '../../features/loans/components/modals/RenewLoanModal';
import { ReturnLoanModal } from '../../features/loans/components/modals/ReturnLoanModal';
import { NewLoanModal } from '../../features/loans/components/modals/NewLoanModal';
import { ApproveRequestModal } from '../../features/loans/components/modals/ApproveRequestModal';
import { RejectRequestModal } from '../../features/loans/components/modals/RejectRequestModal';
import './LoansPage.scss';

const LoansPage: React.FC = () => {
  // Pega toda a lógica do ViewModel
  const vm = useLoansViewModel();

  return (
    <div className="loans-page">
      <div className="container">
        {/* Header */}
        <LoansHeader onNewLoan={() => vm.setShowNewLoanModal(true)} />

        {/* Abas de navegação */}
        <LoansTabs
          activeTab={vm.activeTab}
          ativosCount={vm.ativosCount}
          pendentesCount={vm.pendentes.length}
          onTabChange={vm.handleTabChange}
        />

        {/* Aba de Empréstimos */}
        {vm.activeTab === 'emprestimos' && (
          <>
            <LoansFilters
              searchTerm={vm.searchTerm}
              statusFilter={vm.statusFilter}
              onSearchChange={vm.setSearchTerm}
              onStatusChange={vm.setStatusFilter}
            />
            <LoansTable
              loans={vm.loans}
              onRenew={vm.handleOpenRenewModal}
              onReturn={vm.handleOpenReturnModal}
            />
          </>
        )}

        {/* Aba de Solicitações */}
        {vm.activeTab === 'solicitacoes' && (
          <SolicitacoesTab
            pendentes={vm.pendentes}
            onAprovar={vm.handleOpenApproveModal}
            onRejeitar={vm.handleOpenRejectModal}
          />
        )}
      </div>

      {/* Modal: Renovar Empréstimo */}
      <RenewLoanModal
        isOpen={vm.showRenewModal}
        loan={vm.selectedLoan}
        onClose={() => vm.setShowRenewModal(false)}
        onConfirm={vm.handleRenewLoan}
      />

      {/* Modal: Devolver Empréstimo */}
      <ReturnLoanModal
        isOpen={vm.showReturnModal}
        loan={vm.selectedLoan}
        onClose={() => vm.setShowReturnModal(false)}
        onConfirm={vm.handleReturnLoan}
      />

      {/* Modal: Novo Empréstimo */}
      <NewLoanModal
        isOpen={vm.showNewLoanModal}
        formData={vm.newLoan}
        onClose={vm.handleCloseNewLoanModal}
        onConfirm={vm.handleCreateLoan}
        onFormChange={(data) => vm.setNewLoan({ ...vm.newLoan, ...data })}
        
        userSearchTerm={vm.userAutocomplete.searchTerm}
        userSuggestions={vm.userAutocomplete.suggestions}
        onUserSearchChange={vm.userAutocomplete.setSearchTerm}
        onUserSelect={vm.handleSelectUser}
        onUserClear={vm.handleClearUser}
        
        bookSearchTerm={vm.bookAutocomplete.searchTerm}
        bookSuggestions={vm.bookAutocomplete.suggestions}
        onBookSearchChange={vm.bookAutocomplete.setSearchTerm}
        onBookSelect={vm.handleSelectBook}
        onBookClear={vm.handleClearBook}
        
        exemplares={vm.exemplares}
        loadingExemplares={vm.loadingExemplares}
      />

      {/* Modal: Aprovar Solicitação */}
      <ApproveRequestModal
        isOpen={vm.showAprovarModal}
        solicitacao={vm.selectedSolic}
        onClose={() => vm.setShowAprovarModal(false)}
        onConfirm={vm.handleApproveRequest}
      />

      {/* Modal: Rejeitar Solicitação */}
      <RejectRequestModal
        isOpen={vm.showRejeitarModal}
        solicitacao={vm.selectedSolic}
        observacao={vm.observacao}
        onClose={() => vm.setShowRejeitarModal(false)}
        onConfirm={vm.handleRejectRequest}
        onObservacaoChange={vm.setObservacao}
      />
    </div>
  );
};

export default LoansPage;