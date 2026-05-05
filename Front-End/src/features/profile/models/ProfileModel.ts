import { 
  Livro, 
  StatusReserva, 
  UserMinDto,
} from "@/services";

export const roleLabel = (role: string) => {
  switch (role) {
    case 'ROLE_ADMIN':       return 'Administrador';
    case 'ROLE_FUNCIONARIO': return 'Funcionário';
    case 'ROLE_ALUNO':       return 'Aluno';
    case 'ROLE_PROFESSOR':   return 'Professor';
    default:                 return role;
  }
};

export const fmt = (date?: string | null) =>
  date ? new Date(date).toLocaleDateString('pt-BR') : '—';

export const statusReservaLabel = (s: string) => {
  const map: Record<string, string> = {
    ATIVA: 'Na fila', 
    DISPONIVEL: 'Disponível para retirada',
    CONCLUIDA: 'Concluída', 
    EXPIRADA: 'Expirada', 
    CANCELADA: 'Cancelada',
  };
  return map[s] ?? s;
};

export const statusReservaClass = (s: string) => {
  const map: Record<string, string> = {
    ATIVA: 'badge--warn', 
    DISPONIVEL: 'badge--success',
    CONCLUIDA: 'badge--info', 
    EXPIRADA: 'badge--danger', 
    CANCELADA: 'badge--danger',
  };
  return map[s] ?? '';
};

export type { 
  EmprestimosAtivoDto, 
  MeusEmprestimosResponse 
} from '@/services';

export interface ReservaResponse {
  id: number;
  dataReserva: string;
  dataExpiracao: string;
  dataDisponivel: string;
  status: StatusReserva;
  livro: Livro;
  user: UserMinDto;
}