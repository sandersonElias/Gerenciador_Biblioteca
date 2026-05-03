import React, { useEffect, useState, useCallback } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { useToast } from '../context/ToastContext';
import { useLoading } from '../context/LoadingContext';
import './ReportsPage.scss';
import { Livro } from '@/services/livro/types';
import { EmprestimoResponse } from '@/services/emprestimo/types';
import { ReservaResponse } from '@/services/reserva/types';
import { EmprestimoService } from '@/services/emprestimo/EmprestimoService';
import { ReservaService } from '@/services/reserva/ReservaService';
import { LivroService } from '@/services/livro/LivroService';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

// ── helpers ───────────────────────────────────────────────────────────────────
const fmt = (date?: string) =>
  date ? new Date(date).toLocaleDateString('pt-BR') : '—';

const statusLoanClass = (s: string) => {
  if (s === 'ATIVO')     return 'badge--success';
  if (s === 'ATRASADO')  return 'badge--danger';
  if (s === 'DEVOLVIDO') return 'badge--info';
  return '';
};

const statusResClass = (s: string) => {
  if (s === 'ATIVA')      return 'badge--warn';
  if (s === 'DISPONIVEL') return 'badge--success';
  if (s === 'CONCLUIDA')  return 'badge--info';
  if (s === 'EXPIRADA' || s === 'CANCELADA') return 'badge--danger';
  return '';
};

const statusLabel = (s: string) => {
  const map: Record<string, string> = {
    ATIVO: 'Ativo', ATRASADO: 'Atrasado', DEVOLVIDO: 'Devolvido',
    ATIVA: 'Na fila', DISPONIVEL: 'Disponível', CONCLUIDA: 'Concluída',
    EXPIRADA: 'Expirada', CANCELADA: 'Cancelada',
  };
  return map[s] ?? s;
};

// ── componente ────────────────────────────────────────────────────────────────
const ReportsPage: React.FC = () => {
  const [loans, setLoans]             = useState<EmprestimoResponse[]>([]);
  const [reservations, setReservations] = useState<ReservaResponse[]>([]);
  const [popularBooks, setPopularBooks] = useState<Livro[]>([]);

  const { showToast } = useToast();
  const { withLoading } = useLoading();

  const loadData = useCallback(async () => {
    try {
      // ✅ Usa as classes Service em vez das APIs antigas
      const [loansData, reservationsData, popularData] = await Promise.all([
        withLoading(EmprestimoService.getAll()),
        withLoading(ReservaService.getAll()),
        withLoading(LivroService.getPopulares(8)),
      ]);
      setLoans(loansData);
      setReservations(reservationsData);
      setPopularBooks(popularData);
    } catch {
      showToast('Erro ao carregar dados dos relatórios', 'error');
    }
  }, [withLoading, showToast]);

  useEffect(() => { loadData(); }, [loadData]);

  // ── métricas ───────────────────────────────────────────────────────────────
  const ativos    = loans.filter(l => l.status === 'ATIVO').length;
  const atrasados = loans.filter(l => l.status === 'ATRASADO').length;
  const devolvidos = loans.filter(l => l.status === 'DEVOLVIDO').length;
  const reservasAtivas = reservations.filter(r => ['ATIVA', 'DISPONIVEL'].includes(r.status)).length;

  // ── top usuários ───────────────────────────────────────────────────────────
  const borrowerCounts = loans.reduce<Record<string, { name: string; email: string; count: number }>>(
    (acc, loan) => {
      const key = loan.user.email;
      if (!acc[key]) acc[key] = { name: loan.user.name, email: loan.user.email, count: 0 };
      acc[key].count += 1;
      return acc;
    }, {}
  );
  const topBorrowers = Object.values(borrowerCounts).sort((a, b) => b.count - a.count).slice(0, 5);

  // ── dados gráfico barra ────────────────────────────────────────────────────
  const barData = {
    labels: popularBooks.map(b => b.titulo.length > 18 ? b.titulo.slice(0, 18) + '…' : b.titulo),
    datasets: [{
      label: 'Empréstimos',
      data: popularBooks.map(b => b.contadorEmprestimos),
      backgroundColor: 'rgba(30, 111, 191, 0.75)',
      borderColor: '#1E6FBF',
      borderWidth: 1.5,
      borderRadius: 6,
    }],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: { callbacks: { label: (ctx: any) => ` ${ctx.parsed.y} empréstimos` } },
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: 'rgba(0,0,0,0.05)' } },
      x: { grid: { display: false } },
    },
  };

  // ── dados gráfico donut ────────────────────────────────────────────────────
  const donutData = {
    labels: ['Ativos', 'Atrasados', 'Devolvidos'],
    datasets: [{
      data: [ativos, atrasados, devolvidos],
      backgroundColor: ['rgba(16,185,129,0.85)', 'rgba(220,38,38,0.85)', 'rgba(30,111,191,0.85)'],
      borderColor:     ['#10B981', '#DC2626', '#1E6FBF'],
      borderWidth: 2,
      hoverOffset: 8,
    }],
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '62%',
    plugins: {
      legend: { position: 'bottom' as const, labels: { padding: 16, font: { size: 12 } } },
      title: { display: false },
    },
  };

  return (
    <div className="reports-page">
      <div className="container">

        {/* ── Cabeçalho ── */}
        <div className="reports-header">
          <div>
            <h1>Relatórios</h1>
            <p>Estatísticas e visão geral da biblioteca</p>
          </div>
        </div>

        {/* ── Stat cards ── */}
        <div className="stats-grid">

          <div className="stat-card stat-card--blue">
            <div className="stat-card__icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
            </div>
            <div className="stat-card__body">
              <span className="stat-card__value">{loans.length}</span>
              <span className="stat-card__label">Total empréstimos</span>
            </div>
          </div>

          <div className="stat-card stat-card--green">
            <div className="stat-card__icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div className="stat-card__body">
              <span className="stat-card__value">{ativos}</span>
              <span className="stat-card__label">Ativos agora</span>
            </div>
          </div>

          <div className="stat-card stat-card--red">
            <div className="stat-card__icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <div className="stat-card__body">
              <span className="stat-card__value">{atrasados}</span>
              <span className="stat-card__label">Atrasados</span>
            </div>
          </div>

          <div className="stat-card stat-card--amber">
            <div className="stat-card__icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <div className="stat-card__body">
              <span className="stat-card__value">{reservasAtivas}</span>
              <span className="stat-card__label">Reservas ativas</span>
            </div>
          </div>

        </div>

        {/* ── Gráficos ── */}
        <div className="charts-grid">
          <div className="chart-card">
            <div className="chart-card__header">
              <h3>Livros Mais Populares</h3>
              <span className="chart-card__sub">por número de empréstimos</span>
            </div>
            <div className="chart-container">
              <Bar data={barData} options={barOptions} />
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-card__header">
              <h3>Status dos Empréstimos</h3>
              <span className="chart-card__sub">distribuição atual</span>
            </div>
            <div className="chart-container chart-container--donut">
              <Doughnut data={donutData} options={donutOptions} />
              {/* Número central */}
              <div className="donut-center">
                <span className="donut-center__value">{loans.length}</span>
                <span className="donut-center__label">total</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tabelas ── */}
        <div className="tables-grid">

          {/* Últimos empréstimos */}
          <div className="table-card">
            <div className="table-card__header">
              <h3>Últimos Empréstimos</h3>
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Livro</th>
                    <th>Usuário</th>
                    <th>Devolução</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loans.slice(0, 6).map(loan => (
                    <tr key={loan.id}>
                      <td className="td-title">{loan.livro.titulo}</td>
                      <td>
                        <span className="td-name">{loan.user.name}</span>
                        <span className="td-email">{loan.user.email}</span>
                      </td>
                      <td className="td-date">{fmt(loan.dataDevolucao)}</td>
                      <td>
                        <span className={`badge ${statusLoanClass(loan.status)}`}>
                          {statusLabel(loan.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Últimas reservas */}
          <div className="table-card">
            <div className="table-card__header">
              <h3>Últimas Reservas</h3>
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Livro</th>
                    <th>Usuário</th>
                    <th>Data</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.slice(0, 6).map(res => (
                    <tr key={res.id}>
                      <td className="td-title">{res.livro.titulo}</td>
                      <td>
                        <span className="td-name">{res.user.name}</span>
                      </td>
                      <td className="td-date">{fmt(res.dataReserva)}</td>
                      <td>
                        <span className={`badge ${statusResClass(res.status)}`}>
                          {statusLabel(res.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top usuários */}
          <div className="table-card table-card--full">
            <div className="table-card__header">
              <h3>Top Usuários</h3>
              <span className="table-card__sub">por total de empréstimos</span>
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Usuário</th>
                    <th>E-mail</th>
                    <th>Empréstimos</th>
                  </tr>
                </thead>
                <tbody>
                  {topBorrowers.map((item, i) => (
                    <tr key={i}>
                      <td>
                        <span className={`rank-badge ${i === 0 ? 'rank-badge--gold' : i === 1 ? 'rank-badge--silver' : i === 2 ? 'rank-badge--bronze' : ''}`}>
                          {i + 1}
                        </span>
                      </td>
                      <td className="td-name">{item.name}</td>
                      <td className="td-email">{item.email}</td>
                      <td>
                        <div className="loan-bar">
                          <div
                            className="loan-bar__fill"
                            style={{ width: `${(item.count / (topBorrowers[0]?.count || 1)) * 100}%` }}
                          />
                          <span className="loan-bar__label">{item.count}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ReportsPage;