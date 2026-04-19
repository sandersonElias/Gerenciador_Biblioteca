import React, { useEffect, useState, useCallback } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { EmprestimoResponse, Livro, ReservaResponse } from '../types';
import { emprestimoApi, livroApi, reservaApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useLoading } from '../context/LoadingContext';
import './ReportsPage.scss';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const ReportsPage: React.FC = () => {
  const [loans, setLoans] = useState<EmprestimoResponse[]>([]);
  const [reservations, setReservations] = useState<ReservaResponse[]>([]);
  const [popularBooks, setPopularBooks] = useState<Livro[]>([]);

  const { showToast } = useToast();
  const { withLoading } = useLoading();

  const loadData = useCallback(async () => {
    try {
      const [loansData, reservationsData, popularData] = await Promise.all([
        withLoading(emprestimoApi.getAll()),
        withLoading(reservaApi.getAll()),
        withLoading(livroApi.getPopulares(10))
      ]);

      setLoans(loansData);
      setReservations(reservationsData);
      setPopularBooks(popularData);

    } catch (error) {
      showToast('Erro ao carregar dados dos relatórios', 'error');
    }
  }, [withLoading, showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // 📊 Livros populares
  const popularBooksData = {
    labels: popularBooks.map(b =>
      b.titulo.length > 20 ? b.titulo.substring(0, 20) + '...' : b.titulo
    ),
    datasets: [
      {
        label: 'Número de Empréstimos',
        data: popularBooks.map(b => b.contadorEmprestimos),
        backgroundColor: 'rgba(66, 158, 189, 0.8)',
        borderColor: 'rgba(5, 63, 92, 1)',
        borderWidth: 1
      }
    ]
  };

  // 📊 Status empréstimos
  const loanStatusData = {
    labels: ['Ativo', 'Atrasado', 'Devolvido'],
    datasets: [
      {
        data: [
          loans.filter(l => l.status === 'ATIVO').length,
          loans.filter(l => l.status === 'ATRASADO').length,
          loans.filter(l => l.status === 'DEVOLVIDO').length
        ],
        backgroundColor: [
          'rgba(40, 167, 69, 0.8)',
          'rgba(220, 53, 69, 0.8)',
          'rgba(23, 162, 184, 0.8)'
        ],
        borderColor: [
          'rgba(40, 167, 69, 1)',
          'rgba(220, 53, 69, 1)',
          'rgba(23, 162, 184, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Livros Mais Populares' }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Status dos Empréstimos' }
    }
  };

  // 📈 Top usuários
  const borrowerCounts = loans.reduce<Record<string, { user: EmprestimoResponse['user'], count: number }>>(
    (acc, loan) => {
      const key = loan.user.email;

      if (!acc[key]) {
        acc[key] = {
          user: loan.user,
          count: 0
        };
      }

      acc[key].count += 1;
      return acc;
    },
    {}
  );

  const topBorrowers = Object.values(borrowerCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <div className="reports-page">
      <div className="container">
        <div className="page-header">
          <h1>Relatórios</h1>
          <p>Visualize estatísticas da biblioteca</p>
        </div>

        {/* 📊 Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-content">
              <span className="stat-value">{loans.length}</span>
              <span className="stat-label">Empréstimos</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <span className="stat-value">{reservations.length}</span>
              <span className="stat-label">Reservas</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⚠️</div>
            <div className="stat-content">
              <span className="stat-value">
                {loans.filter(l => l.status === 'ATRASADO').length}
              </span>
              <span className="stat-label">Atrasados</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <span className="stat-value">
                {loans.filter(l => l.status === 'ATIVO').length}
              </span>
              <span className="stat-label">Ativos</span>
            </div>
          </div>
        </div>

        {/* 📊 Charts */}
        <div className="charts-grid">
          <div className="chart-card">
            <div className="chart-container">
              <Bar data={popularBooksData} options={barOptions} />
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-container pie-chart">
              <Pie data={loanStatusData} options={pieOptions} />
            </div>
          </div>
        </div>

        {/* 📋 Tabelas */}
        <div className="tables-grid">

          {/* Empréstimos */}
          <div className="table-card">
            <h3>Últimos Empréstimos</h3>
            <table>
              <tbody>
                {loans.slice(0, 5).map(loan => (
                  <tr key={loan.id}>
                    <td>{loan.livro.titulo}</td>
                    <td>{loan.user.name}</td>
                    <td>{loan.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Reservas */}
          <div className="table-card">
            <h3>Últimas Reservas</h3>
            <table>
              <tbody>
                {reservations.slice(0, 5).map(res => (
                  <tr key={res.id}>
                    <td>{res.livro.titulo}</td>
                    <td>{res.user.name}</td>
                    <td>{res.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Top usuários */}
          <div className="table-card full-width">
            <h3>Top Usuários</h3>
            <table>
              <tbody>
                {topBorrowers.map((item, index) => (
                  <tr key={index}>
                    <td>{item.user.name}</td>
                    <td>{item.user.email}</td>
                    <td>{item.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ReportsPage;