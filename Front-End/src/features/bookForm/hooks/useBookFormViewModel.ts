import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../../context/ToastContext";
import {
  LivroService,
  AutorService,
  GeneroService,
  CatalogacaoService,
} from "../../../services/livro/LivroService";
import {
  AutorResponse,
  GeneroResponse,
  CatalogacaoResponse,
} from "../../../services/livro/types";
import {
  BookFormData,
  BookFormMode,
  BookFormHelpers,
  INITIAL_BOOK_FORM,
} from "../models/BookFormModel";
import { useGenericAutocomplete } from "./useGenericAutocomplete";

interface UseBookFormViewModelParams {
  bookId?: number;
}

export const useBookFormViewModel = ({
  bookId,
}: UseBookFormViewModelParams) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const mode: BookFormMode = bookId ? "edit" : "create";
  const isEdit = mode === "edit";

  const [form, setForm] = useState<BookFormData>(INITIAL_BOOK_FORM);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // ─────────────────────────────────────────────────────────
  // Query: buscar livro existente (modo edit)
  // ─────────────────────────────────────────────────────────
  const { data: existingBook, isLoading: isLoadingBook } = useQuery({
    queryKey: ["livro", bookId],
    queryFn: () => LivroService.getById(bookId!),
    enabled: isEdit && !!bookId,
  });

  // ─────────────────────────────────────────────────────────
  // Funções de busca memoizadas — ANTES dos autocompletes
  // ─────────────────────────────────────────────────────────
  const searchAutorFn = useCallback(
    (query: string) => AutorService.getByAutor(query),
    [],
  );
  const searchGeneroFn = useCallback(
    (query: string) => GeneroService.getByGenero(query),
    [],
  );
  const searchCatalogacaoFn = useCallback(
    (query: string) => CatalogacaoService.getByCatalogacao(query),
    [],
  );

  // ─────────────────────────────────────────────────────────
  // Autocompletes — ANTES do useEffect que os usa
  // ─────────────────────────────────────────────────────────
  const autorAutocomplete = useGenericAutocomplete<AutorResponse>({
    searchFn: searchAutorFn,
    isSelected: !!form.autorId,
    initialTerm: existingBook?.autor?.autor ?? "",
  });

  const generoAutocomplete = useGenericAutocomplete<GeneroResponse>({
    searchFn: searchGeneroFn,
    isSelected: !!form.generoId,
    initialTerm: existingBook?.genero?.genero ?? "",
  });

  const catalogacaoAutocomplete = useGenericAutocomplete<CatalogacaoResponse>({
    searchFn: searchCatalogacaoFn,
    isSelected: !!form.catalogacaoId,
    initialTerm: existingBook?.catalogacao?.catalogacao ?? "",
  });

  // ─────────────────────────────────────────────────────────
  // useEffect: popula form quando livro carrega (modo edit)
  // DEVE vir DEPOIS dos autocompletes!
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (existingBook) {
      // ✅ Popula o form com os IDs corretos
      setForm(BookFormHelpers.fromLivro(existingBook));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingBook]);

  // ✅ WORKAROUND: Busca os IDs pelos nomes (porque o backend não retorna)
  useEffect(() => {
    if (!existingBook) return;

    const buscarIds = async () => {
      try {
        // Buscar ID do autor pelo nome
        if (existingBook.autor?.autor && !form.autorId) {
          const autores = await AutorService.getByAutor(
            existingBook.autor.autor,
          );
          const autorMatch = autores.find(
            (a) => a.autor === existingBook.autor.autor,
          );
          if (autorMatch) {
            setForm((prev) => ({ ...prev, autorId: String(autorMatch.id) }));
          }
        }

        // Buscar ID do gênero pelo nome
        if (existingBook.genero?.genero && !form.generoId) {
          const generos = await GeneroService.getByGenero(
            existingBook.genero.genero,
          );
          const generoMatch = generos.find(
            (g) => g.genero === existingBook.genero.genero,
          );
          if (generoMatch) {
            setForm((prev) => ({ ...prev, generoId: String(generoMatch.id) }));
          }
        }

        // Buscar ID da catalogação pelo nome
        if (existingBook.catalogacao?.catalogacao && !form.catalogacaoId) {
          const cats = await CatalogacaoService.getByCatalogacao(
            existingBook.catalogacao.catalogacao,
          );
          const catMatch = cats.find(
            (c) => c.catalogacao === existingBook.catalogacao.catalogacao,
          );
          if (catMatch) {
            setForm((prev) => ({
              ...prev,
              catalogacaoId: String(catMatch.id),
            }));
          }
        }
      } catch (err) {
        console.error("Erro ao buscar IDs:", err);
      }
    };

    buscarIds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingBook]);

  // ─────────────────────────────────────────────────────────
  // Mutations
  // ─────────────────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: () => LivroService.create(BookFormHelpers.toRequest(form)),
    onSuccess: () => {
      showToast("Livro cadastrado com sucesso!", "success");
      queryClient.invalidateQueries({ queryKey: ["livros"] });
      navigate("/admin/livros");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        error.response?.data?.erro ||
        "Erro ao cadastrar livro";
      showToast(message, "error");
    },
  });

  const updateMutation = useMutation({
    mutationFn: () =>
      LivroService.update(bookId!, BookFormHelpers.toRequest(form)),
    onSuccess: () => {
      showToast("Livro atualizado com sucesso!", "success");
      queryClient.invalidateQueries({ queryKey: ["livro", bookId] });
      queryClient.invalidateQueries({ queryKey: ["livros"] });
      navigate(`/livro/${bookId}`);
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        error.response?.data?.erro ||
        "Erro ao atualizar livro";
      showToast(message, "error");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => LivroService.delete(bookId!),
    onSuccess: () => {
      showToast("Livro excluído com sucesso!", "success");
      queryClient.invalidateQueries({ queryKey: ["livros"] });
      queryClient.removeQueries({ queryKey: ["livro", bookId] });
      navigate("/admin/livros");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        error.response?.data?.erro ||
        "Erro ao excluir livro";
      showToast(message, "error");
      setShowDeleteModal(false);
    },
  });

  // ─────────────────────────────────────────────────────────
  // Handlers
  // ─────────────────────────────────────────────────────────
  const handleFormChange = useCallback((updates: Partial<BookFormData>) => {
    setForm((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleSubmit = useCallback(() => {
    const errors = BookFormHelpers.validate(form);
    if (errors.length > 0) {
      showToast(errors[0], "error");
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
      navigate("/admin/livros");
    }
  }, [isEdit, bookId, navigate]);

  const handleSelectAutor = useCallback(
    (autor: AutorResponse) => {
      autorAutocomplete.setSearchTerm(autor.autor);
      setForm((prev) => ({ ...prev, autorId: String(autor.id) }));
      autorAutocomplete.clearSuggestions();
    },
    [autorAutocomplete],
  );

  const handleClearAutor = useCallback(() => {
    setForm((prev) => ({ ...prev, autorId: "" }));
  }, []);

  const handleSelectGenero = useCallback(
    (genero: GeneroResponse) => {
      generoAutocomplete.setSearchTerm(genero.genero);
      setForm((prev) => ({ ...prev, generoId: String(genero.id) }));
      generoAutocomplete.clearSuggestions();
    },
    [generoAutocomplete],
  );

  const handleClearGenero = useCallback(() => {
    setForm((prev) => ({ ...prev, generoId: "" }));
  }, []);

  const handleSelectCatalogacao = useCallback(
    (cat: CatalogacaoResponse) => {
      catalogacaoAutocomplete.setSearchTerm(cat.catalogacao);
      setForm((prev) => ({ ...prev, catalogacaoId: String(cat.id) }));
      catalogacaoAutocomplete.clearSuggestions();
    },
    [catalogacaoAutocomplete],
  );

  const handleClearCatalogacao = useCallback(() => {
    setForm((prev) => ({ ...prev, catalogacaoId: "" }));
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
    mode,
    isEdit,
    form,
    showDeleteModal,
    isLoadingBook,
    existingBook,
    isSaving: createMutation.isPending || updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    handleFormChange,
    handleSubmit,
    handleCancel,
    autorAutocomplete,
    generoAutocomplete,
    catalogacaoAutocomplete,
    handleSelectAutor,
    handleClearAutor,
    handleSelectGenero,
    handleClearGenero,
    handleSelectCatalogacao,
    handleClearCatalogacao,
    handleOpenDeleteModal,
    handleCloseDeleteModal,
    handleConfirmDelete,
  };
};
