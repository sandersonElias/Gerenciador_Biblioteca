import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { User, Role } from '../types';
import { authApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (roles: Role[]) => boolean;
  hasAnyRole: (roles: Role[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from storage
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
    try {
      const token = await authApi.login({ email, password });
      
      // Store token
      localStorage.setItem('auth_token', token);
      
      // Decode token to get user info (simplified - in production use proper JWT library)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      
      const payload = JSON.parse(jsonPayload);
      const roles: string[] = payload.roles || [];
      
      // Create user object from token
      const userData: User = {
        id: parseInt(payload.jti),
        name: payload.sub || email,
        email: email,
        role: roles[0] as Role,
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }, []);

  const hasRole = useCallback((roles: Role[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  }, [user]);

  const hasAnyRole = useCallback((roles: Role[]): boolean => {
    if (!user) return false;
    return roles.some(role => user.role === role);
  }, [user]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    hasRole,
    hasAnyRole,
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
