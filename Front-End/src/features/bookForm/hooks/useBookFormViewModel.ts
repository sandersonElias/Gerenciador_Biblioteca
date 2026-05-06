import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/context/ToastContext';
import { 
  LivroService, 
  AutorService, 
  GeneroService, 
  CatalogacaoService 
} from '@/services/livro/LivroService';
import { 
  AutorResponse, 
  GeneroResponse, 
  CatalogacaoResponse 
} from '@/services/livro/types';
import { 
  BookFormData, 
  BookFormMode, 
  BookFormHelpers, 
  INITIAL_BOOK_FORM 
} from '../models/BookFormModel';
import { useGenericAutocomplete } from './useGenericAutocomplete';

interface UseBookFormViewModelParams {
  bookId?: number; 
}

export const useBookFormViewModel = ({ bookId }: UseBookFormViewModelParams) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const mode: BookFormMode = bookId ? 'edit' : 'create';
  const isEdit = mode === 'edit';

  const [form, setForm] = useState<BookFormData>(INITIAL_BOOK_FORM);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: existingBook, isLoading: isLoadingBook } = useQuery({
    queryKey: ['livro', bookId],
    queryFn: () => LivroService.getById(bookId!),
    enabled: isEdit && !!bookId,
  });

  useEffect(() => {
    if (existingBook) {
      setForm(BookFormHelpers.fromLivro(existingBook));
    }
  }, [existingBook]);

  const searchAutorFn = useCallback(
    (query: string) => AutorService.getByAutor(query),
    []
  );
  const searchGeneroFn = useCallback(
    (query: string) => GeneroService.getByGenero(query),
    []
  );
  const searchCatalogacaoFn = useCallback(
    (query: string) => CatalogacaoService.getByCatalogacao(query),
    []
  );

  const autorAutocomplete = useGenericAutocomplete<AutorResponse>({
    searchFn: searchAutorFn,
    isSelected: !!form.autorId,
  });

  const generoAutocomplete = useGenericAutocomplete<GeneroResponse>({
    searchFn: searchGeneroFn,
    isSelected: !!form.generoId,
  });

  const catalogacaoAutocomplete = useGenericAutocomplete<CatalogacaoResponse>({
    searchFn: searchCatalogacaoFn,
    isSelected: !!form.catalogacaoId,
  });

  useEffect(() => {
    if (existingBook) {
      autorAutocomplete.setSearchTerm(existingBook.autor?.autor ?? '');
      generoAutocomplete.setSearchTerm(existingBook.genero?.genero ?? '');
      catalogacaoAutocomplete.setSearchTerm(existingBook.catalogacao?.catalogacao ?? '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingBook]);

  const createMutation = useMutation({
    mutationFn: () => LivroService.create(BookFormHelpers.toRequest(form)),
    onSuccess: () => {
      showToast('Livro cadastrado com sucesso!', 'success');
      queryClient.invalidateQueries({ queryKey: ['livros'] });
      navigate('/admin/livros');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message 
        || error.response?.data?.erro 
        || 'Erro ao cadastrar livro';
      showToast(message, 'error');
    },
  });

  const updateMutation = useMutation({
    mutationFn: () => LivroService.update(bookId!, BookFormHelpers.toRequest(form)),
    onSuccess: () => {
      showToast('Livro atualizado com sucesso!', 'success');
      queryClient.invalidateQueries({ queryKey: ['livro', bookId] });
      queryClient.invalidateQueries({ queryKey: ['livros'] });
      navigate(`/livro/${bookId}`);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message 
        || error.response?.data?.erro 
        || 'Erro ao atualizar livro';
      showToast(message, 'error');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => LivroService.delete(bookId!),
    onSuccess: () => {
      showToast('Livro excluído com sucesso!', 'success');
      queryClient.invalidateQueries({ queryKey: ['livros'] });
      queryClient.removeQueries({ queryKey: ['livro', bookId] });
      navigate('/admin/livros');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message 
        || error.response?.data?.erro 
        || 'Erro ao excluir livro';
      showToast(message, 'error');
      setShowDeleteModal(false);
    },
  });

  const handleFormChange = useCallback((updates: Partial<BookFormData>) => {
    setForm(prev => ({ ...prev, ...updates }));
  }, []);

  const handleSubmit = useCallback(() => {
    const errors = BookFormHelpers.validate(form);
    
    if (errors.length > 0) {
      showToast(errors[0], 'error');
      return;
    }

    if (isEdit) {
      updateMutation.mutate();
    } else {
      createMutation.mutate();
    }
  }, [form, isEdit, createMutation, updateMutation, showToast]);

  const handleCancel = useCallback(() => {
    if (isEdit && bookId) {
      navigate(`/livro/${bookId}`);
    } else {
      navigate('/admin/livros');
    }
  }, [isEdit, bookId, navigate]);

  const handleSelectAutor = useCallback((autor: AutorResponse) => {
    autorAutocomplete.setSearchTerm(autor.autor);
    setForm(prev => ({ ...prev, autorId: String(autor.id) }));
    autorAutocomplete.clearSuggestions();
  }, [autorAutocomplete]);

  const handleClearAutor = useCallback(() => {
    setForm(prev => ({ ...prev, autorId: '' }));
  }, []);

  const handleSelectGenero = useCallback((genero: GeneroResponse) => {
    generoAutocomplete.setSearchTerm(genero.genero);
    setForm(prev => ({ ...prev, generoId: String(genero.id) }));
    generoAutocomplete.clearSuggestions();
  }, [generoAutocomplete]);

  const handleClearGenero = useCallback(() => {
    setForm(prev => ({ ...prev, generoId: '' }));
  }, []);

  const handleSelectCatalogacao = useCallback((cat: CatalogacaoResponse) => {
    catalogacaoAutocomplete.setSearchTerm(cat.catalogacao);
    setForm(prev => ({ ...prev, catalogacaoId: String(cat.id) }));
    catalogacaoAutocomplete.clearSuggestions();
  }, [catalogacaoAutocomplete]);

  const handleClearCatalogacao = useCallback(() => {
    setForm(prev => ({ ...prev, catalogacaoId: '' }));
  }, []);

  const handleOpenDeleteModal = useCallback(() => {
    setShowDeleteModal(true);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    deleteMutation.mutate();
  }, [deleteMutation]);

  return {
    // Modo
    mode,
    isEdit,

    // Estado
    form,
    showDeleteModal,
    isLoadingBook,
    existingBook,

    // Loading states
    isSaving: createMutation.isPending || updateMutation.isPending,
    isDeleting: deleteMutation.isPending,

    // Handlers do form
    handleFormChange,
    handleSubmit,
    handleCancel,

    // Autocompletes
    autorAutocomplete,
    generoAutocomplete,
    catalogacaoAutocomplete,

    // Handlers de autocomplete
    handleSelectAutor,
    handleClearAutor,
    handleSelectGenero,
    handleClearGenero,
    handleSelectCatalogacao,
    handleClearCatalogacao,

    // Deleção
    handleOpenDeleteModal,
    handleCloseDeleteModal,
    handleConfirmDelete,
  };
};