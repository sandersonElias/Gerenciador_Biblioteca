import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { LivroService } from '@/services/livro/LivroService';
import { ReservaService } from '@/services/reserva/ReservaService';
import { ExemplarService } from '@/services/exemplar/ExemplarService';
import { BookDetailHelpers, BookDetailPermissions } from '../models/BookDetailModel';
import { Livro } from '@/services/livro/types';
import { ReservaResponse } from '@/services/reserva/types';
import { Exemplar } from '@/services/exemplar/types';

interface UseBookDetailViewModelParams {
  bookId: number;
}

/**
 * ViewModel da BookDetailPage
 * Gerencia TODA a lógica de negócio e estado
 */
export const useBookDetailViewModel = ({ bookId }: UseBookDetailViewModelParams) => {
  // ─────────────────────────────────────────────────────────
  // Hooks externos
  // ─────────────────────────────────────────────────────────
  const { user, isAuthenticated, hasAnyRole } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // ─────────────────────────────────────────────────────────
  // Estado local
  // ─────────────────────────────────────────────────────────
  const [showReserveModal, setShowReserveModal] = useState(false);

  // ─────────────────────────────────────────────────────────
  // Validação de ID
  // ─────────────────────────────────────────────────────────
  const isValidId = !isNaN(bookId);

  // ─────────────────────────────────────────────────────────
  // Queries - Busca de dados
  // ─────────────────────────────────────────────────────────
  
  const { data: book, isLoading: isLoadingBook } = useQuery<Livro>({
    queryKey: ['livro', bookId],
    queryFn: () => LivroService.getById(bookId),
    enabled: isValidId,
  });

  const { data: reservations = [] } = useQuery<ReservaResponse[]>({
    queryKey: ['reservas', 'livro', bookId],
    queryFn: () => ReservaService.getByLivro(bookId),
    enabled: isValidId && hasAnyRole(['ROLE_FUNCIONARIO', 'ROLE_ADMIN']),
  });

  const { data: exemplares = [] } = useQuery<Exemplar[]>({
    queryKey: ['exemplares', 'livro', bookId],
    queryFn: () => ExemplarService.listarPorLivro(bookId),
    enabled: isValidId && hasAnyRole(['ROLE_FUNCIONARIO', 'ROLE_ADMIN']),
  });

  // ─────────────────────────────────────────────────────────
  // Mutation - Criar reserva
  // ─────────────────────────────────────────────────────────
  
  const reservarMutation = useMutation({
    mutationFn: () => {
      // ✅ VALIDAÇÕES MAIS ROBUSTAS
      if (!book) {
        throw new Error('Livro não encontrado');
      }
      
      if (!user || !user.id) {
        throw new Error('Usuário não autenticado corretamente');
      }

      // ✅ LOG PARA DEBUG
      console.log('📤 Criando reserva:', {
        livroId: book.id,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
      });

      // ✅ VALIDAÇÃO EXTRA: userId deve ser > 0
      if (user.id === 0) {
        console.error('❌ ERRO CRÍTICO: user.id é 0!', user);
        throw new Error('ID do usuário inválido. Faça logout e login novamente.');
      }

      return ReservaService.create({ 
        livroId: book.id, 
        userId: user.id 
      });
    },
    onSuccess: () => {
      showToast('Livro reservado com sucesso!', 'success');
      setShowReserveModal(false);
      queryClient.invalidateQueries({ queryKey: ['livro', bookId] });
      queryClient.invalidateQueries({ queryKey: ['reservas', 'livro', bookId] });
      queryClient.invalidateQueries({ queryKey: ['reservas', 'minhas'] });
    },
    onError: (error: any) => {
      console.error('❌ Erro ao reservar:', error);
      showToast(
        error.response?.data?.message || error.message || 'Erro ao reservar livro',
        'error'
      );
    },
  });

  // ─────────────────────────────────────────────────────────
  // Dados derivados (calculados)
  // ─────────────────────────────────────────────────────────

  const permissions: BookDetailPermissions = {
    canReserve: isAuthenticated && hasAnyRole(['ROLE_ALUNO', 'ROLE_PROFESSOR', 'ROLE_FUNCIONARIO', 'ROLE_ADMIN']),
    canViewReservations: hasAnyRole(['ROLE_FUNCIONARIO', 'ROLE_ADMIN']),
    canEdit: isAuthenticated && hasAnyRole(['ROLE_ADMIN']),
  };

  const availability = book
    ? BookDetailHelpers.getAvailabilityInfo(book)
    : null;

  // ─────────────────────────────────────────────────────────
  // Handlers (ações que a View pode chamar)
  // ─────────────────────────────────────────────────────────

  const handleOpenReserveModal = useCallback(() => {
    // ✅ VALIDAÇÃO ANTES DE ABRIR O MODAL
    if (!user || !user.id || user.id === 0) {
      showToast('Erro de autenticação. Faça logout e login novamente.', 'error');
      return;
    }
    setShowReserveModal(true);
  }, [user, showToast]);

  const handleCloseReserveModal = useCallback(() => {
    setShowReserveModal(false);
  }, []);

  const handleConfirmReserve = useCallback(() => {
    reservarMutation.mutate();
  }, [reservarMutation]);

  const handleEdit = useCallback(() => {
    if (!book) return;
    navigate(`/admin/livros/editar/${book.id}`);
  }, [book, navigate]);

  // ─────────────────────────────────────────────────────────
  // Interface pública do ViewModel
  // ─────────────────────────────────────────────────────────
  return {
    // Dados
    book,
    reservations,
    exemplares,
    availability,
    permissions,
    
    // Estado UI
    showReserveModal,
    isLoadingBook,
    isReserving: reservarMutation.isPending,
    isValidId,
    
    // Ações
    handleOpenReserveModal,
    handleCloseReserveModal,
    handleConfirmReserve,
    handleEdit,
  };
};