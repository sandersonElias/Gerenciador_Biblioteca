import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '@/services/auth/AuthService';
import { User, Role } from '@/services/user/types';
import { LoginResponse } from '@/services/auth/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<LoginResponse>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasAnyRole: (roles: Role[]) => boolean
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
      const userData: User = {
        id: 0,
        name: email.split('@')[0],
        email,
        role: (response.role as Role) ?? 'ROLE_ALUNO',
        senhaAlterada: response.senhaAlterada,
      };

      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
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