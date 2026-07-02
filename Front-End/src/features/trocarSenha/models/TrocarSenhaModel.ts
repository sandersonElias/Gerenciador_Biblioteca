export const MIN_PASSWORD_LENGTH = 6;

export interface TrocarSenhaFormData {
  senhaAtual: string;
  novaSenha: string;
  confirmacao: string;
}

export const INITIAL_TROCAR_SENHA: TrocarSenhaFormData = {
  senhaAtual: '',
  novaSenha: '',
  confirmacao: '',
};

export const validateTrocarSenha = (form: TrocarSenhaFormData): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!form.senhaAtual) {
    errors.senhaAtual = 'Senha atual é obrigatória';
  }

  if (!form.novaSenha) {
    errors.novaSenha = 'Nova senha é obrigatória';
  } else if (form.novaSenha.length < MIN_PASSWORD_LENGTH) {
    errors.novaSenha = `A nova senha deve ter no mínimo ${MIN_PASSWORD_LENGTH} caracteres`;
  } else if (form.novaSenha === form.senhaAtual) {
    errors.novaSenha = 'A nova senha deve ser diferente da atual';
  }

  if (!form.confirmacao) {
    errors.confirmacao = 'Confirme a nova senha';
  } else if (form.confirmacao !== form.novaSenha) {
    errors.confirmacao = 'A confirmação não confere com a nova senha';
  }

  return errors;
};
