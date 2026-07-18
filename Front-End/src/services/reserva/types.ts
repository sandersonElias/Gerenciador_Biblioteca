import { Livro } from "../livro/types";
import { User, UserMinDto } from "../user/types";

export interface Reserva {
  id: number;
  dataReserva: string;
  dataExpiracao?: string;
  dataDisponivel?: string;
  status: StatusReserva;
  livro: Livro;
  user: User;
}

export type StatusReserva =
  | "ATIVA"
  | "DISPONIVEL"
  | "CONCLUIDA"
  | "EXPIRADA"
  | "CANCELADA";

export interface ReservaRequest {
  livroId: number;
  userId: number;
}

export interface ReservaResponse {
  id: number;
  dataReserva: string;
  dataExpiracao: string;
  dataDisponivel: string;
  status: StatusReserva;
  livro: Livro;
  user: UserMinDto;
}
// ── Paginação ──────────────────────────────────────────────────────────────

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}