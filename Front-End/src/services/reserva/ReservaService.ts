import { ReservaRequest, ReservaResponse, Page } from './types';
import apiClient from '../api/api';

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
    if (!reserva.livroId || !reserva.userId) {
      throw new Error('livroId e userId são obrigatórios');
    }
    
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

  static async getMinhasReservas(): Promise<ReservaResponse[]> {
    const response = await apiClient.get('/reserva/minhas');
    return response.data;
  }

  static async getPage(page: number = 0, size: number = 20): Promise<Page<ReservaResponse>> {
    const response = await apiClient.get(`/reserva/pagina?page=${page}&size=${size}`);
    return response.data;
  }
}