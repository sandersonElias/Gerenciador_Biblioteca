import React from "react";

export type AdminTab = "books" | "users";

export interface TabConfig {
  id: AdminTab;
  label: string;
  icon: React.ReactNode;
}

export interface AdminCardConfig {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  route: string;
  variant: "blue" | "teal" | "amber";
}

export class AdminIcons {
  static BookIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );

  static UserIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );

  static PlusIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );

  static EditIcon = () => (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );

  static ChartIcon = () => (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
      <line x1="2" y1="20" x2="22" y2="20" />
    </svg>
  );

  static UserPlusIcon = () => (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <line x1="20" y1="8" x2="20" y2="14" />
      <line x1="17" y1="11" x2="23" y2="11" />
    </svg>
  );

  static DocumentIcon = () => (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );

  static ArrowRightIcon = () => (
    <svg
      className="admin-card__arrow"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

/**
 * Configuração das abas
 */
export const ADMIN_TABS: TabConfig[] = [
  {
    id: "books",
    label: "Livros",
    icon: <AdminIcons.BookIcon />,
  },
  {
    id: "users",
    label: "Usuários",
    icon: <AdminIcons.UserIcon />,
  },
];

/**
 * Configuração dos cards da seção de Livros
 */
export const BOOKS_CARDS: AdminCardConfig[] = [
  {
    id: "create-book",
    title: "Cadastrar Livro",
    description: "Adicione novos livros ao catálogo da biblioteca",
    icon: <AdminIcons.PlusIcon />,
    route: "/admin/livros/novo",
    variant: "blue",
  },
  {
    id: "edit-books",
    title: "Editar Livros",
    description: "Atualize informações de livros existentes no acervo",
    icon: <AdminIcons.EditIcon />,
    route: "/buscar",
    variant: "teal",
  },
  {
    id: "reports",
    title: "Relatórios",
    description: "Visualize estatísticas e relatórios de uso do sistema",
    icon: <AdminIcons.ChartIcon />,
    route: "/relatorios",
    variant: "amber",
  },
];

/**
 * Configuração dos cards da seção de Usuários
 */
export const USERS_CARDS: AdminCardConfig[] = [
  {
    id: "create-user",
    title: "Cadastrar Usuário",
    description: "Crie novas contas de alunos, funcionários ou administradores",
    icon: <AdminIcons.UserPlusIcon />,
    route: "/admin/usuarios/novo",
    variant: "blue",
  },
  {
    id: "manage-loans",
    title: "Gerenciar Empréstimos",
    description: "Visualize e gerencie todos os empréstimos ativos do sistema",
    icon: <AdminIcons.DocumentIcon />,
    route: "/emprestimos",
    variant: "teal",
  },
];
