export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  senhaAlterada: boolean;
}

export type Role = 'ROLE_ADMIN' | 'ROLE_FUNCIONARIO' | 'ROLE_ALUNO' | 'ROLE_PROFESSOR';

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