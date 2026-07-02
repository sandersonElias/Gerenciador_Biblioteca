import { Role, UserRequest } from "../../../services/user/types";

export interface UserFormFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: Role;
}

export interface RoleOption {
  value: Role;
  label: string;
  desc: string;
}

export const INITIAL_USER_FORM: UserFormFormData = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "ROLE_ALUNO",
};

export const ROLE_OPTIONS: RoleOption[] = [
  {
    value: "ROLE_ALUNO",
    label: "Aluno",
    desc: "Pode buscar livros, fazer reservas e acompanhar empréstimos",
  },
  {
    value: "ROLE_PROFESSOR",
    label: "Professor",
    desc: "Pode buscar livros, fazer reservas e acompanhar empréstimos",
  },
  {
    value: "ROLE_FUNCIONARIO",
    label: "Funcionário",
    desc: "Pode gerenciar empréstimos, renovações e devoluções",
  },
  {
    value: "ROLE_ADMIN",
    label: "Administrador",
    desc: "Acesso total ao sistema, incluindo cadastro de livros e usuários",
  },
];

export const MIN_PASSWORD_LENGTH = 3;

export function validateUserForm(
  form: UserFormFormData,
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!form.name.trim()) errors.name = "Nome é obrigatório";
  if (!form.email.trim()) errors.email = "E-mail é obrigatório";
  if (!form.password) errors.password = "Senha é obrigatória";
  else if (form.password.length < MIN_PASSWORD_LENGTH)
    errors.password = "Mínimo de 3 caracteres";
  if (form.password !== form.confirmPassword)
    errors.confirmPassword = "As senhas não coincidem";

  return errors;
}

export function toUserRequest(
  form: UserFormFormData,
): UserRequest {
  return {
    name: form.name,
    email: form.email,
    password: form.password,
    role: form.role,
  };
}
