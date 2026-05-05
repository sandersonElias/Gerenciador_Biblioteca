import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '@/services/auth/AuthService';
import { User, Role } from '@/services/user/types';
import { LoginResponse } from '@/services/auth/types';

interface JwtPayload {
  iss?: string;
  email?: string;
  jti?: string;
  roles?: string[];
  iat?: number;
  exp: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<LoginResponse>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasAnyRole: (roles: Role[]) => boolean;
  marcarSenhaAlterada: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<LoginResponse> => {
    const response = await AuthService.login({ email, password });

    if (response.token) {
      try {
        const tokenLimpo = response.token.replace(/^Bearer\s+/i, '');
        const decoded = jwtDecode<JwtPayload>(tokenLimpo);
        
        const userId = decoded.jti ? Number(decoded.jti) : null;
        
        if (!userId || isNaN(userId)) {
          console.error('❌ ID não encontrado no token JWT (campo jti):', decoded);
          throw new Error('Token JWT não contém ID do usuário');
        }

        const userRole = (decoded.roles?.[0] as Role) ?? 'ROLE_ALUNO';
        
        const userData: User = {
          id: userId,
          name: email.split('@')[0],
          email: decoded.email || email,
          role: userRole,
          senhaAlterada: response.senhaAlterada,
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      } catch (error) {
        throw new Error('Erro ao processar autenticação');
      }
    }

    return response;
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
    navigate('/login');
  };

  const hasAnyRole = (roles: Role[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const marcarSenhaAlterada = () => {
    if (!user) return;
    const updatedUser = { ...user, senhaAlterada: true };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        logout, 
        isAuthenticated: !!user,
        isLoading,
        hasAnyRole,
        marcarSenhaAlterada,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};