export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginFormErrors {
  email?: string;
  password?: string;
}

export interface LoginResult {
  senhaAlterada: boolean;
}

/**
 * Classe com lógica de validação pura (sem React)
 * Isso facilita testes unitários
 */
export class LoginValidator {
  /**
   * Valida os dados do formulário
   */
  static validate(data: LoginFormData): LoginFormErrors {
    const errors: LoginFormErrors = {};
    
    // Validação de email
    if (!data.email) {
      errors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Email inválido';
    }
    
    // Validação de senha
    if (!data.password) {
      errors.password = 'Senha é obrigatória';
    } else if (data.password.length < 3) {
      errors.password = 'Senha deve ter no mínimo 3 caracteres';
    }
    
    return errors;
  }
  
  /**
   * Verifica se há erros
   */
  static hasErrors(errors: LoginFormErrors): boolean {
    return Object.keys(errors).length > 0;
  }
}