import { LivroMinDto } from "../livro/types";
import { UserMinDto } from "../user/types";

export interface Emprestimo {
  id: number;
  dataEmprestimo: string;
  dataDevolucao: string;
  dataDevolvido?: string;
  renovacoes: number;
  status: StatusEmprestimo;
  livro: LivroMinDto;
  user: UserMinDto;
}

export type StatusEmprestimo = "ATIVO" | "ATRASADO" | "DEVOLVIDO";

export interface EmprestimoRequest {
  id?: number;
  dataEmprestimo?: string;
  dataDevolucao?: string;
  dataDevolvido?: string;
  renovacoes?: number;
  status?: StatusEmprestimo;
  livroId: number;
  userId: number;
  exemplarId?: number;
}

export interface EmprestimoResponse {
  id: number;
  dataEmprestimo: string;
  dataDevolucao: string;
  dataDevolvido?: string;
  renovacoes: number;
  status: string;
  livro: LivroMinDto;
  user: UserMinDto;
  exemplar?: { id: number; codigo: string } | null;
}

export interface EmprestimosAtivoDto {
  id: number;
  livro: LivroMinDto;
  dataEmprestimo: string;
  dataDevolucao: string;
  renovacoes: number;
  status: string;
  diasRestantes: number;
  podeRenovar: boolean;
}

export interface EmprestimoHistoricoDto {
  id: number;
  livro: LivroMinDto;
  dataEmprestimo: string;
  dataDevolvido: string;
  renovacoes: number;
  status: string;
}

export interface MeusEmprestimosResponse {
  emprestimosAtivo: EmprestimosAtivoDto | null;
  historico: EmprestimoHistoricoDto[];
}