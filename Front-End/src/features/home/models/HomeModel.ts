import { Livro } from '@/services/livro/types';

/**
 * Constantes da HomePage
 */
export const ANIMATED_WORDS = [
  'Leitura',
  'Conhecimento',
  'Aprendizado',
  'Descoberta',
  'Cultura'
] as const;

export const CAROUSEL_AUTO_PLAY_DELAY = 5000; // 5 segundos
export const CAROUSEL_ANIMATION_DURATION = 350; // ms
export const WORD_CHANGE_INTERVAL = 3000; // 3 segundos

/**
 * Tipos relacionados ao carrossel
 */
export type CarouselDirection = 'next' | 'prev';

export interface CarouselState {
  currentIndex: number;
  isAnimating: boolean;
  direction: CarouselDirection;
}

/**
 * Estatísticas do hero
 */
export interface HeroStats {
  totalLivros: number;
  emprestimosDoMes: number;
  usuariosAtivos: number;
}

/**
 * Props para busca
 */
export interface SearchParams {
  filter: string;
  term: string;
}

/**
 * Helpers do Model
 */
export class HomeHelpers {
  /**
   * Formata URL de busca
   */
  static buildSearchUrl(params: SearchParams): string {
    return `/buscar?filter=${params.filter}&term=${encodeURIComponent(params.term)}`;
  }

  /**
   * Calcula próximo índice do carrossel
   */
  static getNextIndex(current: number, total: number): number {
    return (current + 1) % total;
  }

  /**
   * Calcula índice anterior do carrossel
   */
  static getPrevIndex(current: number, total: number): number {
    return (current - 1 + total) % total;
  }

  /**
   * Verifica se livro está disponível
   */
  static isBookAvailable(book: Livro): boolean {
    return book.quantidadeDisponivel > 0;
  }
}