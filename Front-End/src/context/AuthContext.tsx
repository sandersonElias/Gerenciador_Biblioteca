import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { User, Role } from '../types';
import { authApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ senhaAlterada: boolean }>;
  logout: () => void;
  hasRole: (roles: Role[]) => boolean;
  hasAnyRole: (roles: Role[]) => boolean;
  /** Marca a senha como alterada — chamado pela página de troca de senha após sucesso. */
  marcarSenhaAlterada: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Decodifica o payload de um JWT (sem validar a assinatura).
 * Usado apenas para extrair claims já confiáveis (o servidor valida o token a cada request).
 */
function decodeJwtPayload(token: string): Record<string, any> | null {
  try {
    // Aceita token com ou sem prefixo "Bearer"
    const cleanToken = token.replace(/^Bearer\s+/i, '').trim();
    const parts = cleanToken.split('.');
    if (parts.length !== 3) return null;

    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/**
 * Remove o prefixo "Bearer " do token, caso exista.
 * O backend retorna o token JÁ com "Bearer " na frente; armazenamos sem o prefixo
 * e o axios interceptor adiciona ao montar o header.
 */
function stripBearer(token: string): string {
  return token.replace(/^Bearer\s+/i, '').trim();
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Inicializa o estado de autenticação a partir do localStorage
  useEffect(() => {
    const initAuth = () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('auth_token');

      if (storedUser && token) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          localStorage.removeItem('user');
          localStorage.removeItem('auth_token');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    // ✅ Backend agora retorna { token, senhaAlterada }
    const { token, senhaAlterada } = await authApi.login({ email, password });

    // Salva o token PURO (sem "Bearer ") — o interceptor adiciona o prefixo
    const cleanToken = stripBearer(token);
    localStorage.setItem('auth_token', cleanToken);

    // Decodifica o token para extrair claims emitidos pelo backend (email, id, roles)
    const payload = decodeJwtPayload(cleanToken) ?? {};
    const roles: string[] = Array.isArray(payload.roles) ? payload.roles : [];
    const tokenEmail: string = typeof payload.email === 'string' ? payload.email : email;
    const tokenId: number = payload.jti ? parseInt(payload.jti, 10) : 0;

    const userData: User = {
      id: Number.isFinite(tokenId) ? tokenId : 0,
      // Note: o JWT atual não carrega o nome — usamos o email como fallback de display.
      // Quando houver endpoint /user/me retornando o nome real, atualizar aqui.
      name: tokenEmail,
      email: tokenEmail,
      role: (roles[0] as Role) || 'ROLE_ALUNO',
      senhaAlterada,
    };

    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));

    return { senhaAlterada };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }, []);

  const marcarSenhaAlterada = useCallback(() => {
    setUser((prev) => {
      if (!prev) return prev;
      const atualizado = { ...prev, senhaAlterada: true };
      localStorage.setItem('user', JSON.stringify(atualizado));
      return atualizado;
    });
  }, []);

  const hasRole = useCallback((roles: Role[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  }, [user]);

  const hasAnyRole = useCallback((roles: Role[]): boolean => {
    if (!user) return false;
    return roles.some((role) => user.role === role);
  }, [user]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    hasRole,
    hasAnyRole,
    marcarSenhaAlterada,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Role-based route guard hook
export const useRoleGuard = (allowedRoles: Role[]) => {
  const { hasAnyRole, isAuthenticated, isLoading } = useAuth();

  return {
    canAccess: isAuthenticated && hasAnyRole(allowedRoles),
    isLoading,
    isAuthenticated,
  };
};