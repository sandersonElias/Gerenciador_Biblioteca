// src/services/livro/LivroService.ts
import { AutorDto, AutorResponse, CatalogacaoDto, CatalogacaoResponse, GeneroDto, GeneroResponse, Livro, LivroRequest } from "./types";
import { BookFilterType } from "@/types/filters";
import apiClient from "../api/api";

export class LivroService {
  static async getAll(): Promise<Livro[]> {
    const response = await apiClient.get('/livro/todos');
    return response.data;
  }

  static async getById(id: number): Promise<Livro> {
    const response = await apiClient.get(`/livro/id/${id}`);
    return response.data;
  }

  static async searchByFilter(filter: BookFilterType, term: string): Promise<Livro[]> {
    const response = await apiClient.get(`/livro/buscar/${filter}/${encodeURIComponent(term)}`);
    return response.data;
  }

  static async getPopulares(limite: number = 5): Promise<Livro[]> {
    const response = await apiClient.get(`/livro/populares?limite=${limite}`);
    return response.data;
  }

  static async create(livro: LivroRequest): Promise<Livro> {
    const response = await apiClient.post('/livro', livro);
    return response.data;
  }

  static async update(id: number, livro: LivroRequest): Promise<Livro> {
    const response = await apiClient.put(`/livro/${id}`, livro);
    return response.data;
  }

  static async delete(id: number): Promise<void> {
    await apiClient.delete(`/livro/${id}`);
  }
}

export class AutorService {
  static async create(autor: AutorDto): Promise<AutorResponse> {
    const response = await apiClient.post('/autor', autor);
    return response.data;
  }

  static async getByAutor(autor: string): Promise<AutorResponse[]> {
    const response = await apiClient.get(`/autor/buscar/${encodeURIComponent(autor)}`);
    return response.data;
  }
}

export class GeneroService {
  static async create(genero: GeneroDto): Promise<GeneroResponse> {
    const response = await apiClient.post('/genero', genero);
    return response.data;
  }

  static async getByGenero(genero: string): Promise<GeneroResponse[]> {
    const response = await apiClient.get(`/genero/buscar/${encodeURIComponent(genero)}`);
    return response.data;
  }
}

export class CatalogacaoService {
  static async create(catalogacao: CatalogacaoDto): Promise<CatalogacaoResponse> {
    const response = await apiClient.post('/catalogacao', catalogacao);
    return response.data;
  }

  static async getByCatalogacao(catalogacao: string): Promise<CatalogacaoResponse[]> {
    const response = await apiClient.get(`/catalogacao/buscar/${encodeURIComponent(catalogacao)}`);
    return response.data;
  }
}