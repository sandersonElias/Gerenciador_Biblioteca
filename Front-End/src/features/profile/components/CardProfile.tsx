import React from "react";
import {
  EmprestimoHistoricoDto,
  EmprestimosAtivoDto,
  ReservaResponse,
} from "../../../services";
import { roleLabel } from "../models/ProfileModel";

interface CardProfileProps {
  cancelTarget?: number;
  showCancelModal: boolean;
  userInitial: string;
  isAluno: boolean;
  user?: {
    name: string;
    email: string;
    role: string;
  } | null;
  emprestimos?: {
    emprestimosAtivo: EmprestimosAtivoDto | null;
    historico: EmprestimoHistoricoDto[];
  } | null;
  reservas?: ReservaResponse[];
}

export const CardProfile: React.FC<CardProfileProps> = ({
  userInitial,
  emprestimos,
  reservas,
  user,
}) => {
  return (
    <section className="profile-hero">
      <div className="profile-avatar">{userInitial}</div>
      <div className="profile-info">
        <h1 className="profile-name">{user?.name}</h1>
        <p className="profile-email">{user?.email}</p>
        <span className="profile-role-badge">
          {roleLabel(user?.role ?? "")}
        </span>
      </div>
      <div className="profile-stats">
        <div className="profile-stat">
          <span className="profile-stat__value">
            {emprestimos?.historico?.length ?? 0}
          </span>
          <span className="profile-stat__label">Livros lidos</span>
        </div>
        <div className="profile-stat">
          <span className="profile-stat__value">
            {reservas?.filter(
              (r) => r.status === "ATIVA" || r.status === "DISPONIVEL",
            ).length ?? 0}
          </span>
          <span className="profile-stat__label">Reservas ativas</span>
        </div>
        <div className="profile-stat">
          <span className="profile-stat__value">
            {emprestimos?.emprestimosAtivo ? 1 : 0}
          </span>
          <span className="profile-stat__label">Empréstimo ativo</span>
        </div>
      </div>
    </section>
  );
};
