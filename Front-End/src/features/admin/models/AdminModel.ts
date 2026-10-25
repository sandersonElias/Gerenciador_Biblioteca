export type AdminIconName =
  | "book"
  | "user"
  | "plus"
  | "edit"
  | "chart"
  | "userPlus"
  | "document"
  | "arrowRight";

export type AdminTab = "books" | "users";

export interface TabConfig {
  id: AdminTab;
  label: string;
  icon: AdminIconName;
}

export interface AdminCardConfig {
  id: string;
  title: string;
  description: string;
  icon: AdminIconName;
  route: string;
  variant: "blue" | "teal" | "amber";
}

export const ADMIN_TABS: TabConfig[] = [
  {
    id: "books",
    label: "Livros",
    icon: "book",
  },
  {
    id: "users",
    label: "Usuários",
    icon: "user",
  },
];

export const BOOKS_CARDS: AdminCardConfig[] = [
  {
    id: "create-book",
    title: "Cadastrar Livro",
    description: "Adicione novos livros ao catálogo da biblioteca",
    icon: "plus",
    route: "/admin/livros/novo",
    variant: "blue",
  },
  {
    id: "edit-books",
    title: "Editar Livros",
    description: "Atualize informações de livros existentes no acervo",
    icon: "edit",
    route: "/buscar",
    variant: "teal",
  },
  {
    id: "reports",
    title: "Relatórios",
    description: "Visualize estatísticas e relatórios de uso do sistema",
    icon: "chart",
    route: "/relatorios",
    variant: "amber",
  },
];

export const USERS_CARDS: AdminCardConfig[] = [
  {
    id: "create-user",
    title: "Cadastrar Usuário",
    description: "Crie novas contas de alunos, funcionários ou administradores",
    icon: "userPlus",
    route: "/admin/usuarios/novo",
    variant: "blue",
  },
  {
    id: "manage-loans",
    title: "Gerenciar Empréstimos",
    description: "Visualize e gerencie todos os empréstimos ativos do sistema",
    icon: "document",
    route: "/emprestimos",
    variant: "teal",
  },
];
