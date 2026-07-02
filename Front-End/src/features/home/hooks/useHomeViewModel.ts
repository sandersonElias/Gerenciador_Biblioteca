import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../context/AuthContext";
import { LivroService } from "../../../services/livro/LivroService";
import { useAnimatedWords } from "./useAnimatedWords";
import { useCarousel } from "./useCarousel";
import { HomeHelpers, SearchParams } from "../models/HomeModel";

/**
 * ViewModel principal da HomePage
 * Orquestra todos os hooks e lógica de negócio
 */
export const useHomeViewModel = () => {
  // ─────────────────────────────────────────────────────────
  // Autenticação
  // ─────────────────────────────────────────────────────────
  const { isAuthenticated, hasAnyRole } = useAuth();

  // ─────────────────────────────────────────────────────────
  // Dados remotos (React Query)
  // ─────────────────────────────────────────────────────────
  const { data: popularBooks = [], isLoading: isLoadingBooks } = useQuery({
    queryKey: ["livros", "populares"],
    queryFn: () => LivroService.getPopulares(6),
  });

  // ─────────────────────────────────────────────────────────
  // Hooks customizados
  // ─────────────────────────────────────────────────────────
  const animatedWords = useAnimatedWords();
  const carousel = useCarousel({
    itemsCount: popularBooks.length,
    autoPlay: true,
  });

  // ─────────────────────────────────────────────────────────
  // Ações
  // ─────────────────────────────────────────────────────────

  /**
   * Manipula busca de livros
   */
  const handleSearch = (filter: string, term: string) => {
    const params: SearchParams = { filter, term };
    const url = HomeHelpers.buildSearchUrl(params);
    window.location.href = url;
  };

  /**
   * Verifica se usuário pode gerenciar empréstimos
   */
  const canManageLoans =
    isAuthenticated && hasAnyRole(["ROLE_FUNCIONARIO", "ROLE_ADMIN"]);

  /**
   * Livro atual do carrossel
   */
  const currentBook = popularBooks[carousel.currentIndex] || null;

  // ─────────────────────────────────────────────────────────
  // Interface pública do ViewModel
  // ─────────────────────────────────────────────────────────
  return {
    // Estado
    animatedWords,
    carousel,
    popularBooks,
    currentBook,
    isLoadingBooks,
    canManageLoans,

    // Ações
    handleSearch,
  };
};
