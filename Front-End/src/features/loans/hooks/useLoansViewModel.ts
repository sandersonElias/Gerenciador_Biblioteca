import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useLoading } from '@/context/LoadingContext';
import { EmprestimoService } from '@/services/emprestimo/EmprestimoService';
import { SolicitacaoService } from '@/services/solicitacao/SolicitacaoService';
import { UserService } from '@/services/user/UserService';
import { LivroService } from '@/services/livro/LivroService';
import { EmprestimoResponse, StatusEmprestimo } from '@/services/emprestimo/types';
import { SolicitacaoPendenteDto } from '@/services/solicitacao/types';
import { LoansTab, NewLoanFormData, INITIAL_NEW_LOAN, LoansHelpers } from '../models/LoansModel';
import { useAutocomplete } from './useAutocomplete';
import { useExemplarLoader } from './useExemplarLoader';

export const useLoansViewModel = () => {
  
  const { user: authUser } = useAuth();
  const { showToast } = useToast();
  const { withLoading } = useLoading();

  const [loans, setLoans] = useState<EmprestimoResponse[]>([]);
  const [filtered, setFiltered] = useState<EmprestimoResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusEmprestimo | ''>('');

  const [pendentes, setPendentes] = useState<SolicitacaoPendenteDto[]>([]);
  const [selectedSolic, setSelectedSolic] = useState<SolicitacaoPendenteDto | null>(null);
  const [observacao, setObservacao] = useState('');

  const [activeTab, setActiveTab] = useState<LoansTab>('emprestimos');
  const [selectedLoan, setSelectedLoan] = useState<EmprestimoResponse | null>(null);

  const [showRenewModal, setShowRenewModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showNewLoanModal, setShowNewLoanModal] = useState(false);
  const [showAprovarModal, setShowAprovarModal] = useState(false);
  const [showRejeitarModal, setShowRejeitarModal] = useState(false);

  const [newLoan, setNewLoan] = useState<NewLoanFormData>(INITIAL_NEW_LOAN);

  const searchUserFn = useCallback(
    (query: string) => UserService.getUserName(query),
    []
  );

  const searchBookFn = useCallback(
    (query: string) => LivroService.searchByFilter('titulo', query),
    []
  );

  const userAutocomplete = useAutocomplete({
    searchFn: searchUserFn,
    isSelected: !!newLoan.userId,
  });

  const bookAutocomplete = useAutocomplete({
    searchFn: searchBookFn,
    isSelected: !!newLoan.livroId,
  });

  const { exemplares, loading: loadingExemplares } = useExemplarLoader(newLoan.livroId);

  const loadLoans = useCallback(async () => {
    try {
      const data = await withLoading(EmprestimoService.getAll());
      setLoans(data);
    } catch {
      showToast('Erro ao carregar empréstimos', 'error');
    }
  }, [withLoading, showToast]);

  const loadPendentes = useCallback(async () => {
    try {
      const data = await SolicitacaoService.getPendentes();
      setPendentes(data);
    } catch {
      showToast('Erro ao carregar solicitações', 'error');
    }
  }, [showToast]);

  useEffect(() => {
    loadLoans();
    loadPendentes();
  }, [loadLoans, loadPendentes]);

  useEffect(() => {
    let result = loans;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (l) =>
          l.user.name.toLowerCase().includes(term) ||
          l.livro.titulo.toLowerCase().includes(term)
      );
    }

    if (statusFilter) {
      result = result.filter((l) => l.status === statusFilter);
    }

    setFiltered(result);
  }, [loans, searchTerm, statusFilter]);

  // ─────────────────────────────────────────────────────────
  // Handlers - Empréstimos
  // ─────────────────────────────────────────────────────────
  const handleRenewLoan = useCallback(async () => {
    if (!selectedLoan) return;
    try {
      await EmprestimoService.renovar(selectedLoan.id);
      showToast('Empréstimo renovado!', 'success');
      setShowRenewModal(false);
      loadLoans();
    } catch (e: any) {
      showToast(e.response?.data?.message || 'Erro ao renovar', 'error');
    }
  }, [selectedLoan, showToast, loadLoans]);

  const handleReturnLoan = useCallback(async () => {
    if (!selectedLoan) return;
    try {
      await EmprestimoService.devolver(selectedLoan.id);
      showToast('Devolução registrada!', 'success');
      setShowReturnModal(false);
      loadLoans();
    } catch (e: any) {
      showToast(e.response?.data?.message || 'Erro ao devolver', 'error');
    }
  }, [selectedLoan, showToast, loadLoans]);

  const handleCreateLoan = useCallback(async () => {
    if (!LoansHelpers.isNewLoanValid(newLoan)) {
      const error = LoansHelpers.getValidationError(newLoan);
      showToast(error, 'error');
      return;
    }

    try {
      await EmprestimoService.create({
        userId: Number(newLoan.userId),
        livroId: Number(newLoan.livroId),
        dataDevolucao: newLoan.dataDevolucao || undefined,
        exemplarId: newLoan.exemplarId ? Number(newLoan.exemplarId) : undefined,
      });
      showToast('Empréstimo criado com sucesso!', 'success');
      
      setShowNewLoanModal(false);
      setNewLoan(INITIAL_NEW_LOAN);
      userAutocomplete.setSearchTerm('');
      bookAutocomplete.setSearchTerm('');
      
      loadLoans();
    } catch (e: any) {
      showToast(e.response?.data?.message || 'Erro ao criar empréstimo', 'error');
    }
  }, [newLoan, showToast, loadLoans, userAutocomplete, bookAutocomplete]);

  // ─────────────────────────────────────────────────────────
  // Handlers - Solicitações
  // ─────────────────────────────────────────────────────────
  const handleApproveRequest = useCallback(async () => {
    if (!selectedSolic || !authUser) return;
    try {
      await SolicitacaoService.aprovar(selectedSolic.id, authUser.email);
      showToast('Solicitação aprovada!', 'success');
      setShowAprovarModal(false);
      loadPendentes();
      loadLoans();
    } catch {
      showToast('Erro ao aprovar solicitação', 'error');
    }
  }, [selectedSolic, authUser, showToast, loadPendentes, loadLoans]);

  const handleRejectRequest = useCallback(async () => {
    if (!selectedSolic || !authUser) return;
    try {
      await SolicitacaoService.rejeitar(
        selectedSolic.id,
        authUser.email,
        observacao || undefined
      );
      showToast('Solicitação rejeitada.', 'success');
      setShowRejeitarModal(false);
      setObservacao('');
      loadPendentes();
    } catch {
      showToast('Erro ao rejeitar solicitação', 'error');
    }
  }, [selectedSolic, authUser, observacao, showToast, loadPendentes]);

  // ─────────────────────────────────────────────────────────
  // Handlers - UI
  // ─────────────────────────────────────────────────────────
  const handleTabChange = useCallback((tab: LoansTab) => {
    setActiveTab(tab);
    if (tab === 'solicitacoes') {
      loadPendentes();
    }
  }, [loadPendentes]);

  const handleOpenRenewModal = useCallback((loan: EmprestimoResponse) => {
    setSelectedLoan(loan);
    setShowRenewModal(true);
  }, []);

  const handleOpenReturnModal = useCallback((loan: EmprestimoResponse) => {
    setSelectedLoan(loan);
    setShowReturnModal(true);
  }, []);

  const handleOpenApproveModal = useCallback((solic: SolicitacaoPendenteDto) => {
    setSelectedSolic(solic);
    setShowAprovarModal(true);
  }, []);

  const handleOpenRejectModal = useCallback((solic: SolicitacaoPendenteDto) => {
    setSelectedSolic(solic);
    setShowRejeitarModal(true);
  }, []);

  const handleCloseNewLoanModal = useCallback(() => {
    setShowNewLoanModal(false);
    setNewLoan(INITIAL_NEW_LOAN);
    userAutocomplete.setSearchTerm('');
    bookAutocomplete.setSearchTerm('');
  }, [userAutocomplete, bookAutocomplete]);

  // Handlers de autocomplete
  const handleSelectUser = useCallback((userId: number, userName: string) => {
    userAutocomplete.setSearchTerm(userName);
    setNewLoan((prev) => ({ ...prev, userId: String(userId) }));
    userAutocomplete.clearSuggestions();
  }, [userAutocomplete]);

  const handleSelectBook = useCallback((bookId: number, bookTitle: string) => {
    bookAutocomplete.setSearchTerm(bookTitle);
    setNewLoan((prev) => ({ ...prev, livroId: String(bookId) }));
    bookAutocomplete.clearSuggestions();
  }, [bookAutocomplete]);

  const handleClearUser = useCallback(() => {
    setNewLoan((prev) => ({ ...prev, userId: '' }));
  }, []);

  const handleClearBook = useCallback(() => {
    setNewLoan((prev) => ({ ...prev, livroId: '', exemplarId: '' }));
  }, []);

  // ─────────────────────────────────────────────────────────
  // Dados derivados
  // ─────────────────────────────────────────────────────────
  const ativosCount = loans.filter((l) => l.status !== 'DEVOLVIDO').length;

  return {
    // Dados - Empréstimos
    loans: filtered,
    searchTerm,
    statusFilter,
    setSearchTerm,
    setStatusFilter,

    // Dados - Solicitações
    pendentes,
    selectedSolic,
    observacao,
    setObservacao,

    // UI
    activeTab,
    ativosCount,
    handleTabChange,

    // Modals
    showRenewModal,
    showReturnModal,
    showNewLoanModal,
    showAprovarModal,
    showRejeitarModal,
    setShowRenewModal,
    setShowReturnModal,
    setShowNewLoanModal,
    setShowAprovarModal,
    setShowRejeitarModal,

    // Handlers - Empréstimos
    handleRenewLoan,
    handleReturnLoan,
    handleCreateLoan,
    handleOpenRenewModal,
    handleOpenReturnModal,

    // Handlers - Solicitações
    handleApproveRequest,
    handleRejectRequest,
    handleOpenApproveModal,
    handleOpenRejectModal,

    // Novo Empréstimo
    newLoan,
    setNewLoan,
    handleCloseNewLoanModal,
    userAutocomplete,
    bookAutocomplete,
    handleSelectUser,
    handleSelectBook,
    handleClearUser,
    handleClearBook,
    exemplares,
    loadingExemplares,
    selectedLoan,
  };
};