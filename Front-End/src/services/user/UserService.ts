import { UserResponse } from "./types";
import { CadastrarProfessorRequest, TrocarSenhaRequest } from "../auth/types";
import apiClient from "../api/api";

export class UserService {
  static async getUserName(name: string): Promise<UserResponse[]> {
    const response = await apiClient.get(`/user/name/${encodeURIComponent(name)}`);
    return response.data;
  }

  static async getUserEmail(email: string): Promise<UserResponse[]> {
    const response = await apiClient.get(`/user/email/${encodeURIComponent(email)}`);
    return response.data;
  }

  static async trocarSenha(request: TrocarSenhaRequest): Promise<void> {
    await apiClient.post('/user/me/trocar-senha', request);
  }
}

export class AdminUsuariosService {
  static async cadastrarProfessor(request: CadastrarProfessorRequest): Promise<UserResponse> {
    const response = await apiClient.post<UserResponse>(
      '/admin/usuarios/cadastrar-professor',
      request,
    );
    return response.data;
  }
}