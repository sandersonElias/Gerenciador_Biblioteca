import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: Role[];
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles,
  fallback 
}) => {
  const { isAuthenticated, hasAnyRole, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-page">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!hasAnyRole(allowedRoles)) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return (
      <div className="access-denied">
        <h1>Acesso Negado</h1>
        <p>Voc� n�o tem permiss�o para acessar esta p�gina.</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
