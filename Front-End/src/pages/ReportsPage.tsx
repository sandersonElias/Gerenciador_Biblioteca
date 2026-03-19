import React, { useEffect, useState } from 'react';
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
import { EmprestimoResponse, Livro, Reserva } from '../types';
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
  const [reservations, setReservations] = useState<Reserva[]>([]);
  const [popularBooks, setPopularBooks] = useState<Livro[]>([]);
  const { showToast } = useToast();
  const { withLoading } = useLoading();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
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
  };

  // Chart data for popular books
  const popularBooksData = {
    labels: popularBooks.map(b => b.titulo.substring(0, 20) + (b.titulo.length > 20 ? '...' : '')),
    datasets: [{
      label: 'Número de Empréstimos',
      data: popularBooks.map(b => b.contadorEmprestimos),
      backgroundColor: 'rgba(66, 158, 189, 0.8)',
      borderColor: 'rgba(5, 63, 92, 1)',
      borderWidth: 1,
    }]
  };

  // Chart data for loan status
  const loanStatusData = {
    labels: ['Ativo', 'Atrasado', 'Devolvido'],
    datasets: [{
      data: [
        loans.filter(l => l.status === 'ATIVO').length,
        loans.filter(l => l.status === 'ATRASADO').length,
        loans.filter(l => l.status === 'DEVOLVIDO').length,
      ],
      backgroundColor: [
        'rgba(40, 167, 69, 0.8)',
        'rgba(220, 53, 69, 0.8)',
        'rgba(23, 162, 184, 0.8)',
      ],
      borderColor: [
        'rgba(40, 167, 69, 1)',
        'rgba(220, 53, 69, 1)',
        'rgba(23, 162, 184, 1)',
      ],
      borderWidth: 1,
    }]
  };

  // Chart options
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Livros Mais Populares',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Status dos Empréstimos',
      },
    },
  };

  // Calculate top borrowers
  const borrowerCounts = loans.reduce((acc, loan) => {
    const key = loan.user.email;
    acc[key] = {
      user: loan.user,
      count: (acc[key]?.count || 0) + 1
    };
    return acc;
  }, {} as Record<string, { user: typeof loans[0]['user'], count: number }>);

  const topBorrowers = Object.values(borrowerCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <div className="reports-page">
      <div className="container">
        <div className="page-header">
          <h1>Relatórios</h1>
          <p>Visualize estatísticas e dados da biblioteca</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-content">
              <span className="stat-value">{loans.length}</span>
              <span className="stat-label">Total de Empréstimos</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <span className="stat-value">{reservations.length}</span>
              <span className="stat-label">Total de Reservas</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚠️</div>
            <div className="stat-content">
              <span className="stat-value">
                {loans.filter(l => l.status === 'ATRASADO').length}
              </span>
              <span className="stat-label">Empréstimos Atrasados</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <span className="stat-value">
                {loans.filter(l => l.status === 'ATIVO').length}
              </span>
              <span className="stat-label">Empréstimos Ativos</span>
            </div>
          </div>
        </div>

        {/* Charts */}
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

        {/* Recent Tables */}
        <div className="tables-grid">
          <div className="table-card">
            <h3>Últimos Empréstimos</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Livro</th>
                    <th>Usuário</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loans.slice(0, 5).map(loan => (
                    <tr key={loan.id}>
                      <td>{loan.livro.titulo}</td>
                      <td>{loan.user.name}</td>
                      <td>
                        <span className={`status-pill ${loan.status.toLowerCase()}`}>
                          {loan.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="table-card">
            <h3>Últimas Reservas</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Livro</th>
                    <th>Usuário</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.slice(0, 5).map(res => (
                    <tr key={res.id}>
                      <td>{res.livro.titulo}</td>
                      <td>{res.user.name}</td>
                      <td>
                        <span className={`status-pill ${res.status.toLowerCase()}`}>
                          {res.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="table-card full-width">
            <h3>Alunos com Mais Empréstimos</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Aluno</th>
                    <th>Email</th>
                    <th>Total de Empréstimos</th>
                  </tr>
                </thead>
                <tbody>
                  {topBorrowers.map((item, index) => (
                    <tr key={index}>
                      <td>{item.user.name}</td>
                      <td>{item.user.email}</td>
                      <td>
                        <strong>{item.count}</strong>
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