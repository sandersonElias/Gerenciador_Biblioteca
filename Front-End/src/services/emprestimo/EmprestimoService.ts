import { EmprestimoRequest, EmprestimoResponse, MeusEmprestimosResponse, StatusEmprestimo } from "./types";
import apiClient from "../api/api";

export class EmprestimoService {
  static async getAll(): Promise<EmprestimoResponse[]> {
    const response = await apiClient.get('/emprestimo/todos');
    return response.data;
  }

  static async getById(id: number): Promise<EmprestimoResponse> {
    const response = await apiClient.get(`/emprestimo/id/${id}`);
    return response.data;
  }

  static async create(emprestimo: EmprestimoRequest): Promise<EmprestimoResponse> {
    const response = await apiClient.post('/emprestimo', emprestimo);
    return response.data;
  }

  static async renovar(id: number): Promise<EmprestimoResponse> {
    const response = await apiClient.put(`/emprestimo/renovar/${id}`);
    return response.data;
  }

  static async devolver(id: number): Promise<void> {
    await apiClient.put(`/emprestimo/devolver/${id}`);
  }

  static async searchByUser(nome: string): Promise<EmprestimoResponse[]> {
    const response = await apiClient.get(`/emprestimo/user/${encodeURIComponent(nome)}`);
    return response.data;
  }

  static async searchByLivro(titulo: string): Promise<EmprestimoResponse[]> {
    const response = await apiClient.get(`/emprestimo/livro/${encodeURIComponent(titulo)}`);
    return response.data;
  }

  static async searchByStatus(status: StatusEmprestimo): Promise<EmprestimoResponse[]> {
    const response = await apiClient.get(`/emprestimo/status/${status}`);
    return response.data;
  }

  static async getDevolucoesDoDia(data: string): Promise<EmprestimoResponse[]> {
    const response = await apiClient.get(`/emprestimo/devolucao/${data}`);
    return response.data;
  }

  static async getMeusEmprestimos(email: string): Promise<MeusEmprestimosResponse> {
    const response = await apiClient.get(`/emprestimo/minha-conta/${encodeURIComponent(email)}`);
    return response.data;
  }
}