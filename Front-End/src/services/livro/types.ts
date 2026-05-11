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
  urlImg?: string;
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
  autorId: number;
  generoId: number;
  catalogacaoId: number;
}

export interface AutorDto {
  id: number;
  autor: string;
}

export interface GeneroDto {
  id: number;
  genero: string;
}

export interface CatalogacaoDto {
  id: number;
  catalogacao: string;
}

export interface AutorResponse {
  id: number;
  autor: string;
}

export interface GeneroResponse {
  id: number;
  genero: string;
}

export interface CatalogacaoResponse {
  id: number;
  catalogacao: string;
}