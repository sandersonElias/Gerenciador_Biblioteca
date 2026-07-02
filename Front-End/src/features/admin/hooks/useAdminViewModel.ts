import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  AdminTab,
  ADMIN_TABS,
  BOOKS_CARDS,
  USERS_CARDS,
} from "../models/AdminModel";

export const useAdminViewModel = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>("books");
  const navigate = useNavigate();

  const handleTabChange = useCallback((tab: AdminTab) => {
    setActiveTab(tab);
  }, []);

  const handleNavigate = useCallback(
    (route: string) => {
      navigate(route);
    },
    [navigate],
  );

  const getCreateRoute = useCallback((): string => {
    return activeTab === "books"
      ? "/admin/livros/novo"
      : "/admin/usuarios/novo";
  }, [activeTab]);

  const getCreateButtonLabel = useCallback((): string => {
    return activeTab === "books" ? "Cadastrar Livro" : "Cadastrar Usuário";
  }, [activeTab]);

  const getCurrentCards = useCallback(() => {
    return activeTab === "books" ? BOOKS_CARDS : USERS_CARDS;
  }, [activeTab]);

  const getSectionInfo = useCallback(() => {
    if (activeTab === "books") {
      return {
        title: "Gerenciamento de Livros",
        description: "Cadastre, edite e acompanhe o acervo da biblioteca",
      };
    }
    return {
      title: "Gerenciamento de Usuários",
      description: "Crie e gerencie contas de alunos e funcionários",
    };
  }, [activeTab]);

  return {
    activeTab,
    tabs: ADMIN_TABS,
    currentCards: getCurrentCards(),
    sectionInfo: getSectionInfo(),
    createRoute: getCreateRoute(),
    createButtonLabel: getCreateButtonLabel(),
    handleTabChange,
    handleNavigate,
  };
};
