import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { LoadingProvider } from './context/LoadingContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import BookSearchPage from './pages/BookSearchPage';
import BookDetailPage from './pages/BookDetailPage';
import LoginPage from './pages/LoginPage';
import LoansPage from './pages/LoansPage';
import ReportsPage from './pages/ReportsPage';
import AdminPage from './pages/AdminPage';
import BookFormPage from './pages/BookFormPage';
import UserFormPage from './pages/UserFormPage';
import ProfilePage from './pages/ProfilePage';
import TrocarSenhaPage from './pages/Trocarsenhapage';

import './App.scss';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <LoadingProvider>
          <Router>
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

              {/* ✅ Trocar senha — apenas ALUNO (mesma regra do backend) */}
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
          </Router>
        </LoadingProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;