// src/services/reserva/ReservaService.ts
import { ReservaRequest, ReservaResponse } from "./types";
import apiClient from "../api/api";

export class ReservaService {
  static async getAll(): Promise<ReservaResponse[]> {
    const response = await apiClient.get('/reserva/todos');
    return response.data;
  }

  static async getReservaEmail(email: string): Promise<ReservaResponse[]> {
    const response = await apiClient.get(`/reserva/useremail/${encodeURIComponent(email)}`);
    return response.data;
  }

  static async create(reserva: ReservaRequest): Promise<ReservaResponse> {
    const response = await apiClient.post('/reserva', reserva);
    return response.data;
  }

  static async cancelar(reservaId: number): Promise<void> {
    await apiClient.delete(`/reserva/${reservaId}`);
  }

  static async getByLivro(livroId: number): Promise<ReservaResponse[]> {
    const response = await apiClient.get(`/reserva/livro/${livroId}`);
    return response.data;
  }
}