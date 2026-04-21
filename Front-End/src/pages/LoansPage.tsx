import React, { useEffect, useState, useCallback } from 'react';
import { EmprestimoResponse, Livro, StatusEmprestimo, UserResponse } from '../types';
import { emprestimoApi, userApi, livroApi } from '../services/api';
import {
  solicitacaoRenovacaoApi,
  SolicitacaoRenovacaoResponse,
} from '../services/api';
import { useToast } from '../context/ToastContext';
import { useLoading } from '../context/LoadingContext';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import './LoansPage.scss';

// ── tipos locais ──────────────────────────────────────────────────────────────
interface SolicitacaoPendenteDto {
  id: number;
  emprestimoId: number;
  livroTitulo: string;
  solicitanteNome: string;
  solicitanteEmail: string;
  dataEmprestimo: string;
  dataDevolucaoPrevista: string;
  renovacoesRealizadas: number;
  dataSolicitacao: string;
}

// ── helpers ───────────────────────────────────────────────────────────────────
const fmt = (d?: string) =>
  d ? new Date(d).toLocaleDateString('pt-BR') : '—';

const getStatusClass = (status: string) => {
  switch (status) {
    case 'ATIVO':     return 'badge--active';
    case 'ATRASADO':  return 'badge--overdue';
    case 'DEVOLVIDO': return 'badge--returned';
    default:          return '';
  }
};

const statusLabel = (s: string) => {
  const map: Record<string, string> = {
    ATIVO: 'Ativo', ATRASADO: 'Atrasado', DEVOLVIDO: 'Devolvido',
  };
  return map[s] ?? s;
};

// ── componente ────────────────────────────────────────────────────────────────
const LoansPage: React.FC = () => {
  // empréstimos
  const [loans, setLoans]               = useState<EmprestimoResponse[]>([]);
  const [filtered, setFiltered]         = useState<EmprestimoResponse[]>([]);
  const [searchTerm, setSearchTerm]     = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusEmprestimo | ''>('');

  // solicitações
  const [pendentes, setPendentes]               = useState<SolicitacaoPendenteDto[]>([]);
  const [activeTab, setActiveTab]               = useState<'emprestimos' | 'solicitacoes'>('emprestimos');
  const [selectedSolic, setSelectedSolic]       = useState<SolicitacaoPendenteDto | null>(null);
  const [showAprovarModal, setShowAprovarModal] = useState(false);
  const [showRejeitarModal, setShowRejeitarModal] = useState(false);
  const [observacao, setObservacao]             = useState('');

  // modais de empréstimo
  const [selectedLoan, setSelectedLoan]         = useState<EmprestimoResponse | null>(null);
  const [showRenewModal, setShowRenewModal]     = useState(false);
  const [showReturnModal, setShowReturnModal]   = useState(false);
  const [showNewLoanModal, setShowNewLoanModal] = useState(false);
  const [newLoan, setNewLoan] = useState({ userId: '', livroId: '', dataDevolucao: '' });

  // autocomplete
  const [userSearch, setUserSearch]           = useState('');
  const [bookSearch, setBookSearch]           = useState('');
  const [userSuggestions, setUserSuggestions] = useState<UserResponse[]>([]);
  const [bookSuggestions, setBookSuggestions] = useState<Livro[]>([]);

  const { showToast } = useToast();
  const { withLoading } = useLoading();

  // ── loaders ───────────────────────────────────────────────────────────────

  const loadLoans = useCallback(async () => {
    try {
      const data = await withLoading(emprestimoApi.getAll());
      setLoans(data);
    } catch {
      showToast('Erro ao carregar empréstimos', 'error');
    }
  }, [withLoading, showToast]);

  const loadPendentes = useCallback(async () => {
    try {
      const res = await fetch('/solicitacoes-renovacao/pendentes', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });
      if (res.ok) {
        const data: SolicitacaoPendenteDto[] = await res.json();
        setPendentes(data);
      }
    } catch {
      // silencioso — badge simplesmente não aparece
    }
  }, []);

  useEffect(() => { loadLoans(); loadPendentes(); }, [loadLoans, loadPendentes]);

  // ── filtro ────────────────────────────────────────────────────────────────

  useEffect(() => {
    let f = loans;
    if (searchTerm) {
      const t = searchTerm.toLowerCase();
      f = f.filter(l =>
        l.user.name.toLowerCase().includes(t) ||
        l.livro.titulo.toLowerCase().includes(t)
      );
    }
    if (statusFilter) f = f.filter(l => l.status === statusFilter);
    setFiltered(f);
  }, [loans, searchTerm, statusFilter]);

  // ── autocomplete ──────────────────────────────────────────────────────────

  useEffect(() => {
    const delay = setTimeout(async () => {
      try {
        if (userSearch.trim().length >= 3) {
          setUserSuggestions(await userApi.getUserName(userSearch) ?? []);
        } else setUserSuggestions([]);

        if (bookSearch.trim().length >= 3) {
          setBookSuggestions(await livroApi.searchByFilter('titulo', bookSearch) ?? []);
        } else setBookSuggestions([]);
      } catch {
        setUserSuggestions([]); setBookSuggestions([]);
      }
    }, 400);
    return () => clearTimeout(delay);
  }, [userSearch, bookSearch]);

  // ── handlers empréstimo ───────────────────────────────────────────────────

  const handleRenew = async () => {
    if (!selectedLoan) return;
    try {
      await emprestimoApi.renovar(selectedLoan.id);
      showToast('Empréstimo renovado!', 'success');
      setShowRenewModal(false);
      loadLoans();
    } catch (e: any) {
      showToast(e.response?.data?.message || 'Erro ao renovar', 'error');
    }
  };

  const handleReturn = async () => {
    if (!selectedLoan) return;
    try {
      await emprestimoApi.devolver(selectedLoan.id);
      showToast('Devolução registrada!', 'success');
      setShowReturnModal(false);
      loadLoans();
    } catch (e: any) {
      showToast(e.response?.data?.message || 'Erro ao devolver', 'error');
    }
  };

  const handleNewLoan = async () => {
    if (!newLoan.userId || !newLoan.livroId) {
      showToast('Selecione usuário e livro válidos', 'error');
      return;
    }
    try {
      await emprestimoApi.create({
        userId: Number(newLoan.userId),
        livroId: Number(newLoan.livroId),
        dataDevolucao: newLoan.dataDevolucao || undefined,
      });
      showToast('Empréstimo criado!', 'success');
      setShowNewLoanModal(false);
      setNewLoan({ userId: '', livroId: '', dataDevolucao: '' });
      setUserSearch(''); setBookSearch('');
      loadLoans();
    } catch (e: any) {
      showToast(e.response?.data?.message || 'Erro ao criar empréstimo', 'error');
    }
  };

  // ── handlers solicitação ──────────────────────────────────────────────────

  const handleAprovar = async () => {
    if (!selectedSolic) return;
    try {
      const token = localStorage.getItem('auth_token') ?? '';
      // pega email do funcionário do token (payload base64)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const email = payload.email as string;

      await fetch(`/solicitacoes-renovacao/${selectedSolic.id}/aprovar/${encodeURIComponent(email)}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast('Solicitação aprovada!', 'success');
      setShowAprovarModal(false);
      loadPendentes(); loadLoans();
    } catch {
      showToast('Erro ao aprovar solicitação', 'error');
    }
  };

  const handleRejeitar = async () => {
    if (!selectedSolic) return;
    try {
      const token = localStorage.getItem('auth_token') ?? '';
      const payload = JSON.parse(atob(token.split('.')[1]));
      const email = payload.email as string;

      await fetch(`/solicitacoes-renovacao/${selectedSolic.id}/rejeitar/${encodeURIComponent(email)}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ observacao }),
      });
      showToast('Solicitação rejeitada.', 'success');
      setShowRejeitarModal(false);
      setObservacao('');
      loadPendentes();
    } catch {
      showToast('Erro ao rejeitar solicitação', 'error');
    }
  };

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <div className="loans-page">
      <div className="container">

        {/* ── Header ── */}
        <div className="lp-header">
          <div className="lp-header__text">
            <h1>Empréstimos</h1>
            <p>Gerencie empréstimos, renovações e devoluções</p>
          </div>
          <Button variant="primary" onClick={() => setShowNewLoanModal(true)}>
            + Novo Empréstimo
          </Button>
        </div>

        {/* ── Tabs ── */}
        <div className="lp-tabs">
          <button
            className={`lp-tab ${activeTab === 'emprestimos' ? 'lp-tab--active' : ''}`}
            onClick={() => setActiveTab('emprestimos')}
          >
            📋 Empréstimos
            <span className="lp-tab__count">{loans.filter(l => l.status !== 'DEVOLVIDO').length}</span>
          </button>
          <button
            className={`lp-tab ${activeTab === 'solicitacoes' ? 'lp-tab--active' : ''}`}
            onClick={() => { setActiveTab('solicitacoes'); loadPendentes(); }}
          >
            🔔 Solicitações de Renovação
            {pendentes.length > 0 && (
              <span className="lp-tab__badge">{pendentes.length}</span>
            )}
          </button>
        </div>

        {/* ══════════════ ABA EMPRÉSTIMOS ══════════════ */}
        {activeTab === 'emprestimos' && (
          <>
            {/* Filtros */}
            <div className="lp-filters">
              <div className="lp-search">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  type="text"
                  placeholder="Buscar por usuário ou livro…"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="lp-select"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as StatusEmprestimo)}
              >
                <option value="">Todos os status</option>
                <option value="ATIVO">Ativo</option>
                <option value="ATRASADO">Atrasado</option>
                <option value="DEVOLVIDO">Devolvido</option>
              </select>
            </div>

            {/* Tabela */}
            <div className="lp-table-wrap">
              <table className="lp-table">
                <thead>
                  <tr>
                    <th>Livro</th>
                    <th>Usuário</th>
                    <th>Emprestado em</th>
                    <th>Devolver até</th>
                    <th>Renov.</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(loan => (
                    <tr key={loan.id} className={loan.status === 'ATRASADO' ? 'row--overdue' : ''}>
                      <td className="cell-book">
                        <strong>{loan.livro.titulo}</strong>
                      </td>
                      <td className="cell-user">
                        <span className="user-name">{loan.user.name}</span>
                        <span className="user-email">{loan.user.email}</span>
                      </td>
                      <td>{fmt(loan.dataEmprestimo)}</td>
                      <td>{fmt(loan.dataDevolucao)}</td>
                      <td className="cell-center">{loan.renovacoes}/3</td>
                      <td>
                        <span className={`lp-badge ${getStatusClass(loan.status)}`}>
                          {statusLabel(loan.status)}
                        </span>
                      </td>
                      <td>
                        {loan.status !== 'DEVOLVIDO' && (
                          <div className="lp-actions">
                            <button
                              className="lp-btn lp-btn--renew"
                              onClick={() => { setSelectedLoan(loan); setShowRenewModal(true); }}
                            >
                              Renovar
                            </button>
                            <button
                              className="lp-btn lp-btn--return"
                              onClick={() => { setSelectedLoan(loan); setShowReturnModal(true); }}
                            >
                              Devolver
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="lp-empty">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                  </svg>
                  <p>Nenhum empréstimo encontrado</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* ══════════════ ABA SOLICITAÇÕES ══════════════ */}
        {activeTab === 'solicitacoes' && (
          <div className="lp-solicitacoes">
            {pendentes.length === 0 ? (
              <div className="lp-empty">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <p>Nenhuma solicitação pendente</p>
              </div>
            ) : (
              <div className="solic-list">
                {pendentes.map(s => (
                  <div key={s.id} className="solic-card">
                    <div className="solic-card__left">
                      <div className="solic-icon">🔄</div>
                    </div>
                    <div className="solic-card__body">
                      <div className="solic-card__top">
                        <span className="solic-livro">{s.livroTitulo}</span>
                        <span className="solic-badge">Pendente</span>
                      </div>
                      <div className="solic-card__meta">
                        <span>
                          <strong>Aluno:</strong> {s.solicitanteNome}
                          <em> ({s.solicitanteEmail})</em>
                        </span>
                        <span><strong>Emprestado em:</strong> {fmt(s.dataEmprestimo)}</span>
                        <span><strong>Devolução prevista:</strong> {fmt(s.dataDevolucaoPrevista)}</span>
                        <span><strong>Renovações feitas:</strong> {s.renovacoesRealizadas}/3</span>
                        <span><strong>Solicitado em:</strong> {new Date(s.dataSolicitacao).toLocaleString('pt-BR')}</span>
                      </div>
                    </div>
                    <div className="solic-card__actions">
                      <button
                        className="solic-btn solic-btn--aprovar"
                        onClick={() => { setSelectedSolic(s); setShowAprovarModal(true); }}
                      >
                        ✓ Aprovar
                      </button>
                      <button
                        className="solic-btn solic-btn--rejeitar"
                        onClick={() => { setSelectedSolic(s); setShowRejeitarModal(true); }}
                      >
                        ✕ Rejeitar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Modal Renovar ── */}
      <Modal isOpen={showRenewModal} onClose={() => setShowRenewModal(false)} title="Renovar Empréstimo"
        footer={<>
          <Button variant="ghost" onClick={() => setShowRenewModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleRenew}>Confirmar Renovação</Button>
        </>}>
        <p>Renovar o empréstimo de:</p>
        <strong>{selectedLoan?.livro.titulo}</strong>
        <p>Usuário: {selectedLoan?.user.name}</p>
        <p className="modal-note">A data de devolução será estendida em 7 dias.</p>
      </Modal>

      {/* ── Modal Devolver ── */}
      <Modal isOpen={showReturnModal} onClose={() => setShowReturnModal(false)} title="Registrar Devolução"
        footer={<>
          <Button variant="ghost" onClick={() => setShowReturnModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleReturn}>Confirmar Devolução</Button>
        </>}>
        <p>Confirmar devolução do livro:</p>
        <strong>{selectedLoan?.livro.titulo}</strong>
        <p>Emprestado para: {selectedLoan?.user.name}</p>
      </Modal>

      {/* ── Modal Novo Empréstimo ── */}
      <Modal isOpen={showNewLoanModal} onClose={() => setShowNewLoanModal(false)} title="Novo Empréstimo"
        footer={<>
          <Button variant="ghost" onClick={() => setShowNewLoanModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleNewLoan}>Criar Empréstimo</Button>
        </>}>
        <div className="form-group autocomplete">
          <Input label="Nome do Usuário" type="text" value={userSearch}
            onChange={e => setUserSearch(e.target.value)} placeholder="Digite o nome do usuário" />
          {userSuggestions.length > 0 && (
            <ul className="autocomplete-list">
              {userSuggestions.map(u => (
                <li key={u.id} onClick={() => {
                  setUserSearch(u.name);
                  setNewLoan(p => ({ ...p, userId: String(u.id) }));
                  setUserSuggestions([]);
                }}>{u.name}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="form-group autocomplete">
          <Input label="Título do Livro" type="text" value={bookSearch}
            onChange={e => setBookSearch(e.target.value)} placeholder="Digite o título do livro" />
          {bookSuggestions.length > 0 && (
            <ul className="autocomplete-list">
              {bookSuggestions.map(b => (
                <li key={b.id} onClick={() => {
                  setBookSearch(b.titulo);
                  setNewLoan(p => ({ ...p, livroId: String(b.id) }));
                  setBookSuggestions([]);
                }}>{b.titulo}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="form-group">
          <Input label="Data de Devolução (opcional)" type="date" value={newLoan.dataDevolucao}
            onChange={e => setNewLoan({ ...newLoan, dataDevolucao: e.target.value })} />
        </div>
      </Modal>

      {/* ── Modal Aprovar Solicitação ── */}
      <Modal isOpen={showAprovarModal} onClose={() => setShowAprovarModal(false)} title="Aprovar Renovação"
        footer={<>
          <Button variant="ghost" onClick={() => setShowAprovarModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleAprovar}>✓ Confirmar Aprovação</Button>
        </>}>
        <p>Aprovar a solicitação de renovação de:</p>
        <strong>{selectedSolic?.livroTitulo}</strong>
        <p>Aluno: {selectedSolic?.solicitanteNome}</p>
        <p className="modal-note">A data de devolução será estendida em 7 dias.</p>
      </Modal>

      {/* ── Modal Rejeitar Solicitação ── */}
      <Modal isOpen={showRejeitarModal} onClose={() => setShowRejeitarModal(false)} title="Rejeitar Solicitação"
        footer={<>
          <Button variant="ghost" onClick={() => setShowRejeitarModal(false)}>Cancelar</Button>
          <Button variant="danger" onClick={handleRejeitar}>✕ Confirmar Rejeição</Button>
        </>}>
        <p>Rejeitar a solicitação de renovação de:</p>
        <strong>{selectedSolic?.livroTitulo}</strong>
        <p>Aluno: {selectedSolic?.solicitanteNome}</p>
        <div className="form-group" style={{ marginTop: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>
            Motivo da rejeição (opcional)
          </label>
          <textarea
            className="lp-textarea"
            rows={3}
            placeholder="Ex: Livro com alta demanda, limite de renovações atingido…"
            value={observacao}
            onChange={e => setObservacao(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
};

export default LoansPage;