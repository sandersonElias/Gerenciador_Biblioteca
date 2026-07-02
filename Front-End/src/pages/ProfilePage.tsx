import React from "react";
import { useProfileViewModel } from "../features/profile/hooks/useProfileViewModel";
import { CardProfile } from "../features/profile/components/CardProfile";
import { EmprestimosAtivos } from "../features/profile/components/EmprestimosAtivos";
import { HistorioLeitura } from "../features/profile/components/HistorioLeitura";
import { MinhasReservas } from "../features/profile/components/MinhasReservas";
import { ModalReserva } from "../features/profile/components/ModalReserva";
import "./ProfilePage.scss";

export const ProfilePage: React.FC = () => {
  const vm = useProfileViewModel();

  return (
    <div className="profile-page">
      <div className="container">
        {/* ── Card de perfil ── */}
        <CardProfile
          userInitial={vm.userInitial}
          emprestimos={vm.meusEmprestimos}
          reservas={vm.reservas}
          user={vm.user}
          cancelTarget={vm.cancelTarget?.id}
          showCancelModal={vm.showCancelModal}
          isAluno={vm.isAluno}
        />

        {/* ── Empréstimos Ativos ── */}
        <EmprestimosAtivos
          emprestimos={vm.meusEmprestimos}
          isAluno={vm.isAluno}
          isSolicitandoRenovacao={vm.isSolicitandoRenovacao}
          handleSolicitarRenovacao={vm.handleSolicitarRenovacao}
        />

        {/* ── Histórico de empréstimos ── */}
        <HistorioLeitura meusEmprestimos={vm.meusEmprestimos} />

        {/* ── Minhas Reservas ── */}
        <MinhasReservas
          reservas={vm.reservas}
          onCancelarReserva={vm.handleShowCancelModal}
        />
      </div>

      {/* ── Modal cancelar reserva ── */}
      <ModalReserva
        handleCancelarReserva={vm.handleCancelarReserva}
        handleCloseCancelModal={vm.handleCloseCancelModal}
        showCancelModal={vm.showCancelModal}
        cancelTarget={vm.cancelTarget}
        isCancelandoReserva={vm.isCancelandoReserva}
      />
    </div>
  );
};
