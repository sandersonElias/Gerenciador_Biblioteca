export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export type Role = 'ROLE_ADMIN' | 'ROLE_FUNCIONARIO' | 'ROLE_ALUNO';

export interface UserLoginDto {
  email: string;
  password: string;
}

export interface UserRequest {
  name: string;
  email: string;
  password: string;
  role: Role;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
}

export interface UserMinDto {
  name: string;
  email: string;
}

// Book Types
export interface Livro {
  id: number;
  titulo: string;
  editora: string;
  totalExemplares: number;
  quantidadeDisponivel: number;
  cdd: string;
  localizacao: string;
  descricao: string;
  urlImg: string;
  contadorEmprestimos: number;
  autor: AutorDto;
  genero: GeneroDto;
  catalogacao: CatalogacaoDto;
}

export interface LivroMinDto {
  id: number;
  titulo: string;
}

export interface LivroRequest {
  titulo: string;
  editora: string;
  totalExemplares: number;
  quantidadeDisponivel: number;
  cdd: string;
  localizacao: string;
  descricao: string;
  urlImg: string;
  contadorEmprestimos?: number;
  autor: string;
  genero: string;
  catalogacao: string;
}

export interface AutorDto {
  autor: string;
}

export interface GeneroDto {
  genero: string;
}

export interface CatalogacaoDto {
  catalogacao: string;
}

// Loan Types
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

export type StatusEmprestimo = 'ATIVO' | 'ATRASADO' | 'DEVOLVIDO';

export interface EmprestimoRequest {
  id?: number;
  dataEmprestimo?: string;
  dataDevolucao?: string;
  dataDevolvido?: string;
  renovacoes?: number;
  status?: StatusEmprestimo;
  livroId: number;
  userId: number;
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
}

// Reservation Types
export interface Reserva {
  id: number;
  dataReserva: string;
  dataExpiracao?: string;
  dataDisponivel?: string;
  status: StatusReserva;
  livro: Livro;
  user: User;
}

export type StatusReserva = 'ATIVA' | 'DISPONIVEL' | 'CONCLUIDA' | 'EXPIRADA' | 'CANCELADA';

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
    user: UserMinDto
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

// Search Filters
export interface BookFilters {
  titulo?: string;
  autor?: string;
  genero?: string;
  catalogacao?: string;
}

export type BookFilterType = 'titulo' | 'autor' | 'genero' | 'catalogacao';

// Pagination
export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// Chart Data Types
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

export interface ReportData {
  ultimosEmprestimos: Emprestimo[];
  ultimasReservas: Reserva[];
  livrosMaisPopulares: Livro[];
  alunosMaisEmprestimos: { usuario: UserMinDto; quantidade: number }[];
}
