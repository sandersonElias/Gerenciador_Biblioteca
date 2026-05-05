import { LoginResponse } from "./types";
import { UserLoginDto, UserRequest, UserResponse } from "../user/types";
import apiClient from "../api/api";

export class AuthService {
  static async login(credentials: UserLoginDto): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth', credentials);
    
    if (response.data.token) {
      const tokenLimpo = response.data.token.replace(/^Bearer\s+/i, '');
      localStorage.setItem('auth_token', tokenLimpo);
    }
    
    return response.data;
  }

  static async register(userData: UserRequest): Promise<UserResponse> {
    const response = await apiClient.post('/auth/registrar', userData);
    return response.data;
  }

  static logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }

  static getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
}