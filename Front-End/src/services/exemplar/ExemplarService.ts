// src/services/exemplar/ExemplarService.ts
import { Exemplar } from "./types";
import apiClient from "../api/api";

export class ExemplarService {
  static async listarPorLivro(livroId: number): Promise<Exemplar[]> {
    const response = await apiClient.get(`/exemplar/livro/${livroId}`);
    return response.data;
  }

  static async listarDisponiveisPorLivro(livroId: number): Promise<Exemplar[]> {
    const response = await apiClient.get(`/exemplar/livro/${livroId}/disponiveis`);
    return response.data;
  }

  static async sugerirExemplar(livroId: number): Promise<Exemplar> {
    const response = await apiClient.get(`/exemplar/livro/${livroId}/sugestao`);
    return response.data;
  }

  static async adicionarExemplares(livroId: number, quantidade: number): Promise<Exemplar[]> {
    const response = await apiClient.post(`/exemplar/livro/${livroId}/adicionar`, { quantidade });
    return response.data;
  }
}