import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/context/AuthContext';

const TestComponent = () => {
  const { isAuthenticated, user } = useAuth();
  return (
    <div>
      <span data-testid="auth-status">
        {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
      </span>
      {user && <span data-testid="user-name">{user.name}</span>}
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('provides unauthenticated state by default', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
  });

  it('restores auth state from localStorage', async () => {
    const mockUser = { id: 1, name: 'Test User', email: 'test@test.com', role: 'ROLE_ALUNO' };
    localStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.setItem('auth_token', 'mock-token');

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    });
  });
});
