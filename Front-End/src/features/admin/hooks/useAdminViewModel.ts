// src/features/admin/hooks/useAdminViewModel.ts

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminTab, ADMIN_TABS, BOOKS_CARDS, USERS_CARDS } from '../models/AdminModel';

/**
 * ViewModel da AdminPage
 * Gerencia estado das abas e navegação
 */
export const useAdminViewModel = () => {
  // ─────────────────────────────────────────────────────────
  // Estado local
  // ─────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<AdminTab>('books');

  // ─────────────────────────────────────────────────────────
  // Hooks externos
  // ─────────────────────────────────────────────────────────
  const navigate = useNavigate();

  // ─────────────────────────────────────────────────────────
  // Ações
  // ─────────────────────────────────────────────────────────

  /**
   * Troca de aba ativa
   */
  const handleTabChange = useCallback((tab: AdminTab) => {
    setActiveTab(tab);
  }, []);

  /**
   * Navega para uma rota específica
   */
  const handleNavigate = useCallback((route: string) => {
    navigate(route);
  }, [navigate]);

  /**
   * Retorna a rota de criação baseada na aba ativa
   */
  const getCreateRoute = useCallback((): string => {
    return activeTab === 'books' 
      ? '/admin/livros/novo' 
      : '/admin/usuarios/novo';
  }, [activeTab]);

  /**
   * Retorna o label do botão de criação
   */
  const getCreateButtonLabel = useCallback((): string => {
    return activeTab === 'books' 
      ? 'Cadastrar Livro' 
      : 'Cadastrar Usuário';
  }, [activeTab]);

  /**
   * Retorna os cards da aba ativa
   */
  const getCurrentCards = useCallback(() => {
    return activeTab === 'books' ? BOOKS_CARDS : USERS_CARDS;
  }, [activeTab]);

  /**
   * Retorna título e descrição da seção ativa
   */
  const getSectionInfo = useCallback(() => {
    if (activeTab === 'books') {
      return {
        title: 'Gerenciamento de Livros',
        description: 'Cadastre, edite e acompanhe o acervo da biblioteca',
      };
    }
    return {
      title: 'Gerenciamento de Usuários',
      description: 'Crie e gerencie contas de alunos e funcionários',
    };
  }, [activeTab]);

  // ─────────────────────────────────────────────────────────
  // Interface pública do ViewModel
  // ─────────────────────────────────────────────────────────
  return {
    // Estado
    activeTab,
    tabs: ADMIN_TABS,
    currentCards: getCurrentCards(),
    sectionInfo: getSectionInfo(),
    createRoute: getCreateRoute(),
    createButtonLabel: getCreateButtonLabel(),

    // Ações
    handleTabChange,
    handleNavigate,
  };
};