export type LoansTab = 'emprestimos' | 'solicitacoes';

export interface NewLoanFormData {
  userId: string;
  livroId: string;
  dataDevolucao: string;
  exemplarId: string;
}

export const INITIAL_NEW_LOAN: NewLoanFormData = {
  userId: '',
  livroId: '',
  dataDevolucao: '',
  exemplarId: '',
};

export class LoansHelpers {
  
  static formatDate(date?: string): string {
    return date ? new Date(date).toLocaleDateString('pt-BR') : '—';
  }

  static getStatusClass(status: string): string {
    const map: Record<string, string> = {
      ATIVO: 'badge--active',
      ATRASADO: 'badge--overdue',
      DEVOLVIDO: 'badge--returned',
    };
    return map[status] || '';
  }

  static getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      ATIVO: 'Ativo',
      ATRASADO: 'Atrasado',
      DEVOLVIDO: 'Devolvido',
    };
    return map[status] || status;
  }

  static isNewLoanValid(form: NewLoanFormData): boolean {
    return form.userId !== '' && form.livroId !== '';
  }

  static getValidationError(form: NewLoanFormData): string {
    if (!form.userId) return 'Selecione um usuário';
    if (!form.livroId) return 'Selecione um livro';
    return '';
  }
}