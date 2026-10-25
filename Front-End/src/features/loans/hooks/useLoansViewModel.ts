import { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";
import { EmprestimoService } from "../../../services/emprestimo/EmprestimoService";
import { SolicitacaoService } from "../../../services/solicitacao/SolicitacaoService";
import { UserService } from "../../../services/user/UserService";
import { LivroService } from "../../../services/livro/LivroService";
import {
  EmprestimoResponse,
  StatusEmprestimo,
} from "../../../services/emprestimo/types";
import { SolicitacaoPendenteDto } from "../../../services/solicitacao/types";
import { UserResponse } from "../../../services/user/types";
import {
  LoansTab,
  NewLoanFormData,
  INITIAL_NEW_LOAN,
  LoansHelpers,
} from "../models/LoansModel";
import { useGenericAutocomplete } from "../../../hooks/useGenericAutocomplete";
import { useExemplarLoader } from "./useExemplarLoader";

export const useLoansViewModel = () => {
  const { user: authUser } = useAuth();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusEmprestimo | "">("");
  const [activeTab, setActiveTab] = useState<LoansTab>("emprestimos");

  const [selectedSolic, setSelectedSolic] =
    useState<SolicitacaoPendenteDto | null>(null);
  const [observacao, setObservacao] = useState("");
  const [selectedLoan, setSelectedLoan] = useState<EmprestimoResponse | null>(
    null,
  );

  const [showRenewModal, setShowRenewModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showNewLoanModal, setShowNewLoanModal] = useState(false);
  const [showAprovarModal, setShowAprovarModal] = useState(false);
  const [showRejeitarModal, setShowRejeitarModal] = useState(false);

  const [newLoan, setNewLoan] = useState<NewLoanFormData>(INITIAL_NEW_LOAN);

  const loansQuery = useQuery({
    queryKey: ["emprestimos"],
    queryFn: () => EmprestimoService.getAll(),
  });

  const pendentesQuery = useQuery({
    queryKey: ["solicitacoes", "pendentes"],
    queryFn: () => SolicitacaoService.getPendentes(),
  });

  useEffect(() => {
    if (loansQuery.isError) {
      showToast("Erro ao carregar empréstimos", "error");
    }
  }, [loansQuery.isError, showToast]);

  useEffect(() => {
    if (pendentesQuery.isError) {
      showToast("Erro ao carregar solicitações", "error");
    }
  }, [pendentesQuery.isError, showToast]);

  const loans = loansQuery.data ?? [];
  const pendentes = pendentesQuery.data ?? [];

  const searchUserFn = useCallback(
    (query: string) => UserService.getUserName(query),
    [],
  );

  const searchBookFn = useCallback(
    (query: string) => LivroService.searchByFilter("titulo", query),
    [],
  );

  const userAutocomplete = useGenericAutocomplete<UserResponse>({
    searchFn: searchUserFn,
    isSelected: !!newLoan.userId,
    minChars: 3,
  });

  const bookAutocomplete = useGenericAutocomplete({
    searchFn: searchBookFn,
    isSelected: !!newLoan.livroId,
    minChars: 3,
  });

  const { exemplares, loading: loadingExemplares } = useExemplarLoader(
    newLoan.livroId,
  );

  const invalidateLoans = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["emprestimos"] });
    queryClient.invalidateQueries({
      queryKey: ["exemplares", "disponiveis"],
    });
  }, [queryClient]);

  const invalidatePendentes = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ["solicitacoes", "pendentes"],
    });
  }, [queryClient]);

  const renewMutation = useMutation({
    mutationFn: (loanId: number) => EmprestimoService.renovar(loanId),
    onSuccess: () => {
      showToast("Empréstimo renovado!", "success");
      setShowRenewModal(false);
      invalidateLoans();
    },
    onError: (error: any) => {
      showToast(error.response?.data?.message || "Erro ao renovar", "error");
    },
  });

  const returnMutation = useMutation({
    mutationFn: (loanId: number) => EmprestimoService.devolver(loanId),
    onSuccess: () => {
      showToast("Devolução registrada!", "success");
      setShowReturnModal(false);
      invalidateLoans();
    },
    onError: (error: any) => {
      showToast(error.response?.data?.message || "Erro ao devolver", "error");
    },
  });

  const createLoanMutation = useMutation({
    mutationFn: (form: NewLoanFormData) =>
      EmprestimoService.create({
        userId: Number(form.userId),
        livroId: Number(form.livroId),
        exemplarId: form.exemplarId ? Number(form.exemplarId) : undefined,
      }),
    onSuccess: () => {
      showToast("Empréstimo criado com sucesso!", "success");
      setShowNewLoanModal(false);
      setNewLoan(INITIAL_NEW_LOAN);
      userAutocomplete.setSearchTerm("");
      bookAutocomplete.setSearchTerm("");
      invalidateLoans();
      invalidatePendentes();
    },
    onError: (error: any) => {
      showToast(
        error.response?.data?.message || "Erro ao criar empréstimo",
        "error",
      );
    },
  });

  const approveMutation = useMutation({
    mutationFn: (solic: SolicitacaoPendenteDto) => {
      if (!authUser) throw new Error("Usuário não autenticado");
      return SolicitacaoService.aprovar(solic.id, authUser.email);
    },
    onSuccess: () => {
      showToast("Solicitação aprovada!", "success");
      setShowAprovarModal(false);
      invalidatePendentes();
      invalidateLoans();
    },
    onError: () => {
      showToast("Erro ao aprovar solicitação", "error");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({
      solic,
      motivo,
    }: {
      solic: SolicitacaoPendenteDto;
      motivo?: string;
    }) => {
      if (!authUser) throw new Error("Usuário não autenticado");
      return SolicitacaoService.rejeitar(solic.id, authUser.email, motivo);
    },
    onSuccess: () => {
      showToast("Solicitação rejeitada.", "success");
      setShowRejeitarModal(false);
      setObservacao("");
      invalidatePendentes();
    },
    onError: () => {
      showToast("Erro ao rejeitar solicitação", "error");
    },
  });

  const filtered = useMemo(() => {
    let result = loans;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (l) =>
          l.user.name.toLowerCase().includes(term) ||
          l.livro.titulo.toLowerCase().includes(term),
      );
    }

    if (statusFilter) {
      result = result.filter((l) => l.status === statusFilter);
    }

    return result;
  }, [loans, searchTerm, statusFilter]);

  const handleRenewLoan = useCallback(() => {
    if (selectedLoan) renewMutation.mutate(selectedLoan.id);
  }, [selectedLoan, renewMutation]);

  const handleReturnLoan = useCallback(() => {
    if (selectedLoan) returnMutation.mutate(selectedLoan.id);
  }, [selectedLoan, returnMutation]);

  const handleCreateLoan = useCallback(() => {
    if (!LoansHelpers.isNewLoanValid(newLoan)) {
      showToast(LoansHelpers.getValidationError(newLoan), "error");
      return;
    }
    createLoanMutation.mutate(newLoan);
  }, [newLoan, createLoanMutation, showToast]);

  const handleApproveRequest = useCallback(() => {
    if (selectedSolic) approveMutation.mutate(selectedSolic);
  }, [selectedSolic, approveMutation]);

  const handleRejectRequest = useCallback(() => {
    if (selectedSolic) {
      rejectMutation.mutate({
        solic: selectedSolic,
        motivo: observacao || undefined,
      });
    }
  }, [selectedSolic, observacao, rejectMutation]);

  const handleTabChange = useCallback((tab: LoansTab) => {
    setActiveTab(tab);
  }, []);

  const handleOpenRenewModal = useCallback((loan: EmprestimoResponse) => {
    setSelectedLoan(loan);
    setShowRenewModal(true);
  }, []);

  const handleOpenReturnModal = useCallback((loan: EmprestimoResponse) => {
    setSelectedLoan(loan);
    setShowReturnModal(true);
  }, []);

  const handleOpenNewLoanModal = useCallback(() => {
    setShowNewLoanModal(true);
  }, []);

  const handleOpenApproveModal = useCallback(
    (solic: SolicitacaoPendenteDto) => {
      setSelectedSolic(solic);
      setShowAprovarModal(true);
    },
    [],
  );

  const handleOpenRejectModal = useCallback((solic: SolicitacaoPendenteDto) => {
    setSelectedSolic(solic);
    setShowRejeitarModal(true);
  }, []);

  const handleCloseRenewModal = useCallback(() => {
    setShowRenewModal(false);
  }, []);

  const handleCloseReturnModal = useCallback(() => {
    setShowReturnModal(false);
  }, []);

  const handleCloseAprovarModal = useCallback(() => {
    setShowAprovarModal(false);
  }, []);

  const handleCloseRejeitarModal = useCallback(() => {
    setShowRejeitarModal(false);
  }, []);

  const handleCloseNewLoanModal = useCallback(() => {
    setShowNewLoanModal(false);
    setNewLoan(INITIAL_NEW_LOAN);
    userAutocomplete.setSearchTerm("");
    bookAutocomplete.setSearchTerm("");
  }, [userAutocomplete, bookAutocomplete]);

  const handleNewLoanFormChange = useCallback(
    (data: Partial<NewLoanFormData>) => {
      setNewLoan((prev) => ({ ...prev, ...data }));
    },
    [],
  );

  const handleObservacaoChange = useCallback((value: string) => {
    setObservacao(value);
  }, []);

  const handleSelectUser = useCallback(
    (userId: number, userName: string) => {
      userAutocomplete.setSearchTerm(userName);
      setNewLoan((prev) => ({ ...prev, userId: String(userId) }));
      userAutocomplete.clearSuggestions();
    },
    [userAutocomplete],
  );

  const handleSelectBook = useCallback(
    (bookId: number, bookTitle: string) => {
      bookAutocomplete.setSearchTerm(bookTitle);
      setNewLoan((prev) => ({ ...prev, livroId: String(bookId) }));
      bookAutocomplete.clearSuggestions();
    },
    [bookAutocomplete],
  );

  const handleClearUser = useCallback(() => {
    setNewLoan((prev) => ({ ...prev, userId: "" }));
  }, []);

  const handleClearBook = useCallback(() => {
    setNewLoan((prev) => ({ ...prev, livroId: "", exemplarId: "" }));
  }, []);

  const ativosCount = loans.filter((l) => l.status !== "DEVOLVIDO").length;

  return {
    loans: filtered,
    searchTerm,
    statusFilter,
    setSearchTerm,
    setStatusFilter,

    pendentes,
    selectedSolic,
    observacao,
    handleObservacaoChange,

    activeTab,
    ativosCount,
    handleTabChange,

    showRenewModal,
    showReturnModal,
    showNewLoanModal,
    showAprovarModal,
    showRejeitarModal,
    handleOpenNewLoanModal,
    handleCloseRenewModal,
    handleCloseReturnModal,
    handleCloseNewLoanModal,
    handleCloseAprovarModal,
    handleCloseRejeitarModal,

    handleRenewLoan,
    handleReturnLoan,
    handleCreateLoan,
    handleOpenRenewModal,
    handleOpenReturnModal,

    handleApproveRequest,
    handleRejectRequest,
    handleOpenApproveModal,
    handleOpenRejectModal,

    newLoan,
    handleNewLoanFormChange,
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
