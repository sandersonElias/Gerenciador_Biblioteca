import React from 'react';
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
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

interface ChartsGridProps {
  barData: any;
  barOptions: any;
  donutData: any;
  donutOptions: any;
  totalLoans: number;
}

const ChartsGrid: React.FC<ChartsGridProps> = ({ barData, barOptions, donutData, donutOptions, totalLoans }) => (
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
        <div className="donut-center">
          <span className="donut-center__value">{totalLoans}</span>
          <span className="donut-center__label">total</span>
        </div>
      </div>
    </div>
  </div>
);

export default ChartsGrid;
