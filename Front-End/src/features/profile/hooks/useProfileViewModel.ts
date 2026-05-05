import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  EmprestimosAtivoDto,
  ReservaResponse 
} from '../models/ProfileModel';
import { 
  EmprestimoService, 
  MeusEmprestimosResponse, 
  ReservaService, 
  SolicitacaoService 
} from '@/services';

export const useProfileViewModel = () => {

  const { user, hasAnyRole } = useAuth();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const [cancelTarget, setCancelTarget] = useState<ReservaResponse | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const isAluno = hasAnyRole(['ROLE_ALUNO']);
  const userInitial = user?.name?.charAt(0).toUpperCase() ?? '?';

  const { data: meusEmprestimos = null } = useQuery<MeusEmprestimosResponse | null>({
    queryKey: ['emprestimos', 'meus', user?.email],
    queryFn: () => 
      user?.email 
        ? EmprestimoService.getMeusEmprestimos(user.email) 
        : Promise.resolve(null),
    enabled: !!user?.email,
  });

  const { data: reservas = [] } = useQuery<ReservaResponse[]>({
    queryKey: ['reservas', 'minhas', user?.email],
    queryFn: () => 
      user?.email 
        ? ReservaService.getReservaEmail(user.email) 
        : Promise.resolve([]),
    enabled: !!user?.email,
  });

  const solicitarRenovacaoMutation = useMutation({
    mutationFn: ({ emprestimoId, email }: { emprestimoId: number; email: string }) =>
      SolicitacaoService.solicitar(emprestimoId, email),
    onSuccess: () => {
      showToast('Solicitação de renovação enviada! Aguarde a aprovação.', 'success');
      queryClient.invalidateQueries({ queryKey: ['emprestimos', 'meus'] });
    },
    onError: (err: any) => {
      showToast(err.response?.data?.message || 'Erro ao solicitar renovação', 'error');
    },
  });

  const cancelarReservaMutation = useMutation({
    mutationFn: (reservaId: number) => ReservaService.cancelar(reservaId),
    onSuccess: () => {
      showToast('Reserva cancelada com sucesso!', 'success');
      setShowCancelModal(false);
      setCancelTarget(null);  // ← Limpa o target também
      queryClient.invalidateQueries({ queryKey: ['reservas', 'minhas'] });
    },
    onError: (err: any) => {
      showToast(err.response?.data?.message || 'Erro ao cancelar reserva', 'error');
    },
  });

  const handleSolicitarRenovacao = (ativo: EmprestimosAtivoDto) => {
    if (!user?.email) return;
    
    solicitarRenovacaoMutation.mutate({ 
      emprestimoId: ativo.id, 
      email: user.email 
    });
  };

  const handleCancelarReserva = () => {
    if (!cancelTarget) return;
    cancelarReservaMutation.mutate(cancelTarget.id);
  };

  const handleShowCancelModal = (reserva: ReservaResponse) => {
    setCancelTarget(reserva);
    setShowCancelModal(true);
  };

  const handleCloseCancelModal = () => {
    setShowCancelModal(false);
    setCancelTarget(null);
  };

  return {
    user,
    userInitial,
    isAluno,
    meusEmprestimos,
    reservas,
    
    cancelTarget,
    showCancelModal,
    
    isSolicitandoRenovacao: solicitarRenovacaoMutation.isPending,
    isCancelandoReserva: cancelarReservaMutation.isPending,
    
    handleSolicitarRenovacao,
    handleCancelarReserva,
    handleShowCancelModal,
    handleCloseCancelModal,
    
    solicitarRenovacaoMutation,
    cancelarReservaMutation,
  };
};