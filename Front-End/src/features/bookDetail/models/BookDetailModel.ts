import { Livro } from '@/services/livro/types';

/**
 * Estado das permissões do usuário
 */
export interface BookDetailPermissions {
  canReserve: boolean;
  canEdit: boolean;
  canViewReservations: boolean;
}

/**
 * Estado de disponibilidade do livro
 */
export interface BookAvailability {
  isAvailable: boolean;
  percentage: number;
  availableCount: number;
  totalCount: number;
}

/**
 * Helpers do BookDetail
 * Funções puras sem React
 */
export class BookDetailHelpers {
  /**
   * Calcula a porcentagem de disponibilidade
   */
  static calculateAvailabilityPercentage(
    available: number,
    total: number
  ): number {
    return total > 0 ? (available / total) * 100 : 0;
  }

  /**
   * Verifica se o livro está disponível
   */
  static isBookAvailable(book: Livro): boolean {
    return book.quantidadeDisponivel > 0;
  }

  /**
   * Monta objeto de disponibilidade
   */
  static getAvailabilityInfo(book: Livro): BookAvailability {
    return {
      isAvailable: this.isBookAvailable(book),
      percentage: this.calculateAvailabilityPercentage(
        book.quantidadeDisponivel,
        book.totalExemplares
      ),
      availableCount: book.quantidadeDisponivel,
      totalCount: book.totalExemplares,
    };
  }

  /**
   * Formata status de reserva para exibição
   */
  static getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      PENDENTE: 'Pendente',
      ATIVA: 'Ativa',
      CANCELADA: 'Cancelada',
      RETIRADA: 'Retirada',
    };
    return labels[status] || status;
  }

  /**
   * Formata status de exemplar
   */
  static getExemplarStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      DISPONIVEL: 'Disponível',
      EMPRESTADO: 'Emprestado',
      RESERVADO: 'Reservado',
    };
    return labels[status] || status;
  }
}