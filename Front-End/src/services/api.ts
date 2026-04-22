import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { 
  UserLoginDto, 
  UserRequest, 
  UserResponse, 
  Livro, 
  LivroRequest,
  EmprestimoRequest,
  EmprestimoResponse,
  ReservaRequest,
  ReservaResponse,
  StatusEmprestimo,
  BookFilterType,
  GeneroDto,
  GeneroResponse,
  AutorResponse,
  AutorDto,
  CatalogacaoDto,
  CatalogacaoResponse
} from '@/types';

// ── Tipos adicionais para Meu Perfil ──────────────────────────────────────────
export interface LivroMinDto {
  id: number;
  titulo: string;
  urlImg?: string;
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

export interface SolicitacaoRenovacaoResponse {
  id: number;
  emprestimoId: number;
  livroTitulo: string;
  status: string;
  dataSolicitacao: string;
}

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: Number(process.env.REACT_APP_API_TIMEOUT) || 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Injeta o token em todas as requisições
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Trata 401 globalmente
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authApi = {
  login: async (credentials: UserLoginDto): Promise<string> => {
    const response = await apiClient.post('/auth', credentials);
    return response.data;
  },
  register: async (userData: UserRequest): Promise<UserResponse> => {
    const response = await apiClient.post('/auth/registrar', userData);
    return response.data;
  },
};

// ── User ──────────────────────────────────────────────────────────────────────
export const userApi = {
  getUserName: async (name: string): Promise<UserResponse[]> => {
    const response = await apiClient.get(`/user/name/${encodeURIComponent(name)}`);
    return response.data;
  },
};

// ── Livro ─────────────────────────────────────────────────────────────────────
export const livroApi = {
  getAll: async (): Promise<Livro[]> => {
    const response = await apiClient.get('/livro/todos');
    return response.data;
  },
  getById: async (id: number): Promise<Livro> => {
    const response = await apiClient.get(`/livro/id/${id}`);
    return response.data;
  },
  searchByFilter: async (filter: BookFilterType, term: string): Promise<Livro[]> => {
    const response = await apiClient.get(`/livro/buscar/${filter}/${encodeURIComponent(term)}`);
    return response.data;
  },
  getPopulares: async (limite: number = 5): Promise<Livro[]> => {
    const response = await apiClient.get(`/livro/populares?limite=${limite}`);
    return response.data;
  },
  create: async (livro: LivroRequest): Promise<Livro> => {
    const response = await apiClient.post('/livro', livro);
    return response.data;
  },
  update: async (id: number, livro: LivroRequest): Promise<Livro> => {
    const response = await apiClient.put(`/livro/${id}`, livro);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/livro/${id}`);
  },
};

// ── Autor ─────────────────────────────────────────────────────────────────────
export const autorApi = {
  create: async (autor: AutorDto): Promise<AutorResponse> => {
    const response = await apiClient.post('/autor', autor);
    return response.data;
  },
  // ✅ backend retorna List<AutorResponse> — tipagem corrigida para array
  getByAutor: async (autor: string): Promise<AutorResponse[]> => {
    const response = await apiClient.get(`/autor/buscar/${encodeURIComponent(autor)}`);
    return response.data;
  },
};

// ── Gênero ────────────────────────────────────────────────────────────────────
export const generoApi = {
  create: async (genero: GeneroDto): Promise<GeneroResponse> => {
    const response = await apiClient.post('/genero', genero);
    return response.data;
  },
  // ✅ backend retorna List<GeneroResponse> — tipagem corrigida para array
  getByGenero: async (genero: string): Promise<GeneroResponse[]> => {
    const response = await apiClient.get(`/genero/buscar/${encodeURIComponent(genero)}`);
    return response.data;
  },
};

// ── Catalogação ───────────────────────────────────────────────────────────────
export const catalogacaoApi = {
  create: async (catalogacao: CatalogacaoDto): Promise<CatalogacaoResponse> => {
    const response = await apiClient.post('/catalogacao', catalogacao);
    return response.data;
  },
  // ✅ backend retorna List<CatalogacaoResponse> — tipagem corrigida para array
  getByCatalogacao: async (catalogacao: string): Promise<CatalogacaoResponse[]> => {
    const response = await apiClient.get(`/catalogacao/buscar/${encodeURIComponent(catalogacao)}`);
    return response.data;
  },
};

// ── Empréstimo ────────────────────────────────────────────────────────────────
export const emprestimoApi = {
  getAll: async (): Promise<EmprestimoResponse[]> => {
    const response = await apiClient.get('/emprestimo/todos');
    return response.data;
  },
  getById: async (id: number): Promise<EmprestimoResponse> => {
    const response = await apiClient.get(`/emprestimo/id/${id}`);
    return response.data;
  },
  create: async (emprestimo: EmprestimoRequest): Promise<EmprestimoResponse> => {
    const response = await apiClient.post('/emprestimo', emprestimo);
    return response.data;
  },
  renovar: async (id: number): Promise<EmprestimoResponse> => {
    const response = await apiClient.put(`/emprestimo/renovar/${id}`);
    return response.data;
  },
  devolver: async (id: number): Promise<void> => {
    await apiClient.put(`/emprestimo/devolver/${id}`);
  },
  searchByUser: async (nome: string): Promise<EmprestimoResponse[]> => {
    const response = await apiClient.get(`/emprestimo/user/${encodeURIComponent(nome)}`);
    return response.data;
  },
  searchByLivro: async (titulo: string): Promise<EmprestimoResponse[]> => {
    const response = await apiClient.get(`/emprestimo/livro/${encodeURIComponent(titulo)}`);
    return response.data;
  },
  searchByStatus: async (status: StatusEmprestimo): Promise<EmprestimoResponse[]> => {
    const response = await apiClient.get(`/emprestimo/status/${status}`);
    return response.data;
  },
  getDevolucoesDoDia: async (data: string): Promise<EmprestimoResponse[]> => {
    const response = await apiClient.get(`/emprestimo/devolucao/${data}`);
    return response.data;
  },
};

// ── Reserva ───────────────────────────────────────────────────────────────────
export const reservaApi = {
  getAll: async (): Promise<ReservaResponse[]> => {
    const response = await apiClient.get('/reserva/todos');
    return response.data;
  },
  getReservaEmail: async (email: string): Promise<ReservaResponse[]> => {
    const response = await apiClient.get(`/reserva/useremail/${encodeURIComponent(email)}`);
    return response.data;
  },
  create: async (reserva: ReservaRequest): Promise<ReservaResponse> => {
    const response = await apiClient.post('/reserva', reserva);
    return response.data;
  },
  cancelar: async (reservaId: number): Promise<void> => {
    await apiClient.delete(`/reserva/${reservaId}`);
  },
  getByLivro: async (livroId: number): Promise<ReservaResponse[]> => {
    const response = await apiClient.get(`/reserva/livro/${livroId}`);
    return response.data;
  },
};

// ── Meus Empréstimos — email obrigatório na URL ───────────────────────────────
export const meusEmprestimosApi = {
  getMeusEmprestimos: async (email: string): Promise<MeusEmprestimosResponse> => {
    const response = await apiClient.get(`/emprestimo/minha-conta/${encodeURIComponent(email)}`);
    return response.data;
  },
};

// ── Solicitação de Renovação — email obrigatório na URL ───────────────────────
export const solicitacaoRenovacaoApi = {
  solicitar: async (emprestimoId: number, email: string): Promise<SolicitacaoRenovacaoResponse> => {
    const response = await apiClient.post(
      `/solicitacoes-renovacao/${encodeURIComponent(email)}`,
      { emprestimoId }
    );
    return response.data;
  },
};

export default apiClient;