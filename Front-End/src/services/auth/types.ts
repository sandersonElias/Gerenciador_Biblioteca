export interface LoginResponse {
  token: string;
  senhaAlterada: boolean;
}

export interface TrocarSenhaRequest {
  senhaAtual: string;
  novaSenha: string;
  confirmacaoNovaSenha: string;
}

export interface CadastrarProfessorRequest {
  matricula: string;
  nome: string;
  email: string;
}