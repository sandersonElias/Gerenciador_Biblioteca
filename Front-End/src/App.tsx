import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryProvider } from './context/QueryProvider';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { LoadingProvider } from './context/LoadingContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import HomePage from './pages/home/HomePage';
import BookSearchPage from './pages/BookSearchPage';
import BookDetailPage from './pages/bookDetail/BookDetailPage';
import LoginPage from './pages/login/LoginPage';
import LoansPage from './pages/loans/LoansPage';
import ReportsPage from './pages/ReportsPage';
import AdminPage from './pages/admin/AdminPage';
import BookFormPage from './pages/bookForm/BookFormPage';
import UserFormPage from './pages/userForm/UserFormPage';
import TrocarSenhaPage from './pages/Trocarsenhapage';
import { ProfilePage } from './pages/ProfilePage';

import './App.scss';

function App() {
  return (
    <QueryProvider>
      <Router>  
        <ToastProvider>
          <LoadingProvider>
            <AuthProvider>
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />

                {/* Routes with Layout */}
                <Route path="/" element={<Layout><HomePage /></Layout>} />
                <Route path="/buscar" element={<Layout><BookSearchPage /></Layout>} />
                <Route path="/livro/:id" element={<Layout><BookDetailPage /></Layout>} />

                {/* Protected Routes - Aluno, Funcionario, Admin (e Professor) */}
                <Route
                  path="/meu-perfil"
                  element={
                    <Layout>
                      <ProtectedRoute allowedRoles={['ROLE_ALUNO', 'ROLE_PROFESSOR', 'ROLE_FUNCIONARIO', 'ROLE_ADMIN']}>
                        <ProfilePage />
                      </ProtectedRoute>
                    </Layout>
                  }
                />

                {/* Trocar senha — apenas ALUNO */}
                <Route
                  path="/trocar-senha"
                  element={
                    <Layout>
                      <ProtectedRoute allowedRoles={['ROLE_ALUNO']}>
                        <TrocarSenhaPage />
                      </ProtectedRoute>
                    </Layout>
                  }
                />

                {/* Protected Routes - Funcionario and Admin only */}
                <Route
                  path="/emprestimos"
                  element={
                    <Layout>
                      <ProtectedRoute allowedRoles={['ROLE_FUNCIONARIO', 'ROLE_ADMIN']}>
                        <LoansPage />
                      </ProtectedRoute>
                    </Layout>
                  }
                />

                <Route
                  path="/relatorios"
                  element={
                    <Layout>
                      <ProtectedRoute allowedRoles={['ROLE_FUNCIONARIO', 'ROLE_ADMIN']}>
                        <ReportsPage />
                      </ProtectedRoute>
                    </Layout>
                  }
                />

                {/* Protected Routes - Admin only */}
                <Route
                  path="/admin"
                  element={
                    <Layout>
                      <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                        <AdminPage />
                      </ProtectedRoute>
                    </Layout>
                  }
                />

                <Route
                  path="/admin/livros/novo"
                  element={
                    <Layout>
                      <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                        <BookFormPage />
                      </ProtectedRoute>
                    </Layout>
                  }
                />

                <Route
                  path="/admin/livros/editar/:id"
                  element={
                    <Layout>
                      <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                        <BookFormPage />
                      </ProtectedRoute>
                    </Layout>
                  }
                />

                <Route
                  path="/admin/usuarios/novo"
                  element={
                    <Layout>
                      <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                        <UserFormPage />
                      </ProtectedRoute>
                    </Layout>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AuthProvider>
          </LoadingProvider>
        </ToastProvider>
      </Router>
    </QueryProvider>
  );
}

export default App;