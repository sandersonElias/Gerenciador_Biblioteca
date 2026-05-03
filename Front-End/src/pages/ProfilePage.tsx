import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import './ProfilePage.scss';
import { EmprestimoService } from '@/services/emprestimo/EmprestimoService';
import { ReservaService } from '@/services/reserva/ReservaService';
import { SolicitacaoService } from '@/services/solicitacao/SolicitacaoService';
import { EmprestimosAtivoDto, MeusEmprestimosResponse } from '@/services/emprestimo/types';
import { ReservaResponse } from '@/services/reserva/types';

// ── helpers ───────────────────────────────────────────────────────────────────
const roleLabel = (role: string) => {
  switch (role) {
    case 'ROLE_ADMIN':       return 'Administrador';
    case 'ROLE_FUNCIONARIO': return 'Funcionário';
    case 'ROLE_ALUNO':       return 'Aluno';
    case 'ROLE_PROFESSOR':   return 'Professor';
    default:                 return role;
  }
};

const fmt = (date?: string | null) =>
  date ? new Date(date).toLocaleDateString('pt-BR') : '—';

const statusReservaLabel = (s: string) => {
  const map: Record<string, string> = {
    ATIVA: 'Na fila', DISPONIVEL: 'Disponível para retirada',
    CONCLUIDA: 'Concluída', EXPIRADA: 'Expirada', CANCELADA: 'Cancelada',
  };
  return map[s] ?? s;
};

const statusReservaClass = (s: string) => {
  const map: Record<string, string> = {
    ATIVA: 'badge--warn', DISPONIVEL: 'badge--success',
    CONCLUIDA: 'badge--info', EXPIRADA: 'badge--danger', CANCELADA: 'badge--danger',
  };
  return map[s] ?? '';
};

// ── componente ────────────────────────────────────────────────────────────────
const ProfilePage: React.FC = () => {
  const { user, hasAnyRole } = useAuth();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const [cancelTarget, setCancelTarget] = useState<ReservaResponse | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const isAluno = hasAnyRole(['ROLE_ALUNO']);

  // ✅ Query 1: Empréstimos do usuário (cacheados por 5 min)
  const { data: emprestimos = null } = useQuery<MeusEmprestimosResponse | null>({
    queryKey: ['emprestimos', 'meus', user?.email],
    queryFn: () => user?.email ? EmprestimoService.getMeusEmprestimos(user.email) : Promise.resolve(null),
    enabled: !!user?.email,
  });

  // ✅ Query 2: Reservas do usuário (cacheadas por 5 min)
  const { data: reservas = [] } = useQuery<ReservaResponse[]>({
    queryKey: ['reservas', 'minhas', user?.email],
    queryFn: () => user?.email ? ReservaService.getReservaEmail(user.email) : Promise.resolve([]),
    enabled: !!user?.email,
  });

  // ✅ Mutation: Solicitar renovação
  const solicitarRenovacaoMutation = useMutation({
    mutationFn: ({ emprestimoId, email }: { emprestimoId: number; email: string }) =>
      SolicitacaoService.solicitar(emprestimoId, email),
    onSuccess: () => {
      showToast('Solicitação de renovação enviada! Aguarde a aprovação.', 'success');
      queryClient.invalidateQueries({ queryKey: ['emprestimos', 'meus'] });
    },
    onError: (err: any) => {
      showToast(err.response?.data?.message || 'Erro ao solicitar renovação', 'error');
    },
  });

  // ✅ Mutation: Cancelar reserva
  const cancelarReservaMutation = useMutation({
    mutationFn: (reservaId: number) => ReservaService.cancelar(reservaId),
    onSuccess: () => {
      showToast('Reserva cancelada com sucesso!', 'success');
      setShowCancelModal(false);
      queryClient.invalidateQueries({ queryKey: ['reservas', 'minhas'] });
    },
    onError: (err: any) => {
      showToast(err.response?.data?.message || 'Erro ao cancelar reserva', 'error');
    },
  });

  const handleSolicitarRenovacao = async (ativo: EmprestimosAtivoDto) => {
    if (!user?.email) return;
    solicitarRenovacaoMutation.mutate({ emprestimoId: ativo.id, email: user.email });
  };

  const handleCancelarReserva = async () => {
    if (!cancelTarget) return;
    cancelarReservaMutation.mutate(cancelTarget.id);
  };

  const userInitial = user?.name?.charAt(0).toUpperCase() ?? '?';

  return (
    <div className="profile-page">
      <div className="container">

        {/* ── Card de perfil ── */}
        <section className="profile-hero">
          <div className="profile-avatar">{userInitial}</div>
          <div className="profile-info">
            <h1 className="profile-name">{user?.name}</h1>
            <p className="profile-email">{user?.email}</p>
            <span className="profile-role-badge">{roleLabel(user?.role ?? '')}</span>
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
                {reservas.filter(r => ['ATIVA', 'DISPONIVEL'].includes(r.status)).length}
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

        {/* ── Empréstimo ativo ── */}
        <section className="profile-section">
          <h2 className="section-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
            Empréstimo Ativo
          </h2>

          {emprestimos?.emprestimosAtivo ? (() => {
            const a = emprestimos.emprestimosAtivo;
            const atrasado = a.diasRestantes === 0;
            return (
              <div className={`active-loan-card ${atrasado ? 'active-loan-card--late' : ''}`}>
                <div className="active-loan-cover">
                  {a.livro.urlImg
                    ? <img src={a.livro.urlImg} alt={a.livro.titulo} />
                    : <div className="cover-placeholder">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                        </svg>
                      </div>
                  }
                </div>

                <div className="active-loan-info">
                  <Link to={`/livro/${a.livro.id}`} className="active-loan-title">{a.livro.titulo}</Link>

                  <div className="active-loan-meta">
                    <div className="meta-chip">
                      <span className="meta-chip__label">Emprestado em</span>
                      <span className="meta-chip__value">{fmt(a.dataEmprestimo)}</span>
                    </div>
                    <div className="meta-chip">
                      <span className="meta-chip__label">Devolver até</span>
                      <span className="meta-chip__value">{fmt(a.dataDevolucao)}</span>
                    </div>
                    <div className="meta-chip">
                      <span className="meta-chip__label">Renovações</span>
                      <span className="meta-chip__value">{a.renovacoes}/3</span>
                    </div>
                  </div>

                  {/* Barra de prazo */}
                  <div className="deadline-bar">
                    <div
                      className={`deadline-bar__fill ${atrasado ? 'deadline-bar__fill--late' : ''}`}
                      style={{ width: atrasado ? '100%' : `${Math.min(100, ((7 - a.diasRestantes) / 7) * 100)}%` }}
                    />
                  </div>
                  <p className={`deadline-label ${atrasado ? 'deadline-label--late' : ''}`}>
                    {atrasado
                      ? '⚠️ Prazo encerrado — devolva o livro'
                      : `${a.diasRestantes} dia${a.diasRestantes !== 1 ? 's' : ''} restante${a.diasRestantes !== 1 ? 's' : ''}`
                    }
                  </p>
                </div>

                {/* Ação de renovação (apenas ALUNO) */}
                {isAluno && (
                  <div className="active-loan-action">
                    {a.podeRenovar ? (
                      <Button
                        variant="primary"
                        size="sm"
                        isLoading={solicitarRenovacaoMutation.isPending}
                        onClick={() => handleSolicitarRenovacao(a)}
                      >
                        Solicitar Renovação
                      </Button>
                    ) : (
                      <span className="renew-blocked">
                        {a.renovacoes >= 3 ? 'Limite atingido (3/3)' : atrasado ? 'Livro atrasado' : 'Renovação indisponível'}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })() : (
            <div className="empty-card">
              <p>Você não possui nenhum empréstimo ativo no momento.</p>
              <Link to="/buscar" className="btn-browse">Explorar catálogo →</Link>
            </div>
          )}
        </section>

        {/* ── Histórico de empréstimos ── */}
        {(emprestimos?.historico?.length ?? 0) > 0 && (
          <section className="profile-section">
            <h2 className="section-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="12 8 12 12 14 14"/><circle cx="12" cy="12" r="10"/>
              </svg>
              Histórico de Leituras
            </h2>

            <div className="history-list">
              {emprestimos!.historico.map(h => (
                <div key={h.id} className="history-item">
                  <div className="history-cover">
                    {h.livro.urlImg
                      ? <img src={h.livro.urlImg} alt={h.livro.titulo} />
                      : <div className="cover-placeholder cover-placeholder--sm">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                          </svg>
                        </div>
                    }
                  </div>
                  <div className="history-info">
                    <Link to={`/livro/${h.livro.id}`} className="history-title">{h.livro.titulo}</Link>
                    <div className="history-dates">
                      <span>{fmt(h.dataEmprestimo)} → {fmt(h.dataDevolvido)}</span>
                      {h.renovacoes > 0 && <span className="history-renewals">{h.renovacoes} renovação{h.renovacoes > 1 ? 'ões' : ''}</span>}
                    </div>
                  </div>
                  <span className="badge badge--info">Devolvido</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Minhas Reservas ── */}
        <section className="profile-section">
          <h2 className="section-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
            Minhas Reservas
          </h2>

          {reservas.length > 0 ? (
            <div className="reservations-list">
              {reservas.map(r => (
                <div key={r.id} className="reservation-item">
                  <div className="reservation-cover">
                    {r.livro.urlImg
                      ? <img src={r.livro.urlImg} alt={r.livro.titulo} />
                      : <div className="cover-placeholder cover-placeholder--sm">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                          </svg>
                        </div>
                    }
                  </div>
                  <div className="reservation-info">
                    <Link to={`/livro/${r.livro.id}`} className="reservation-title">{r.livro.titulo}</Link>
                    <p className="reservation-author">{r.livro.autor?.autor}</p>
                    <div className="reservation-dates">
                      <span>Reservado em {fmt(r.dataReserva)}</span>
                      {r.dataExpiracao && <span>Expira em {fmt(r.dataExpiracao)}</span>}
                    </div>
                  </div>
                  <div className="reservation-right">
                    <span className={`badge ${statusReservaClass(r.status)}`}>
                      {statusReservaLabel(r.status)}
                    </span>
                    {['ATIVA', 'DISPONIVEL'].includes(r.status) && (
                      <button
                        className="btn-cancel-reservation"
                        onClick={() => { setCancelTarget(r); setShowCancelModal(true); }}
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-card">
              <p>Você não possui reservas ativas.</p>
              <Link to="/buscar" className="btn-browse">Explorar catálogo →</Link>
            </div>
          )}
        </section>

      </div>

      {/* ── Modal cancelar reserva ── */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancelar Reserva"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowCancelModal(false)}>
              Manter Reserva
            </Button>
            <Button variant="danger" onClick={handleCancelarReserva}>
              Confirmar Cancelamento
            </Button>
          </>
        }
      >
        <p>Tem certeza que deseja cancelar a reserva do livro:</p>
        <strong>{cancelTarget?.livro.titulo}</strong>
        <p className="modal-warning">Esta ação não pode ser desfeita.</p>
      </Modal>
    </div>
  );
};

export default ProfilePage;