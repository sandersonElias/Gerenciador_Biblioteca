import React from 'react';

/**
 * Seção de features/funcionalidades da biblioteca
 * Componente puramente apresentacional
 */
export const FeaturesSection: React.FC = () => {
  return (
    <section className="features">
      <div className="container">
        <div className="features-grid">
          {/* Feature 1: Busca */}
          <div className="feature-card">
            <div className="feature-icon feature-icon--search">
              <svg className="icon-search" viewBox="0 0 48 48" fill="none">
                <circle 
                  cx="21" 
                  cy="21" 
                  r="13" 
                  stroke="currentColor" 
                  strokeWidth="3" 
                  strokeLinecap="round"
                />
                <line 
                  className="icon-search__handle" 
                  x1="31" 
                  y1="31" 
                  x2="42" 
                  y2="42" 
                  stroke="currentColor" 
                  strokeWidth="3" 
                  strokeLinecap="round"
                />
                <line 
                  x1="16" 
                  y1="21" 
                  x2="26" 
                  y2="21" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  opacity="0.5"
                />
                <line 
                  x1="21" 
                  y1="16" 
                  x2="21" 
                  y2="26" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  opacity="0.5"
                />
              </svg>
            </div>
            <h3>Busca Rápida</h3>
            <p>
              Encontre rapidamente o livro que você procura por título, autor ou gênero
            </p>
            <span className="feature-link">Buscar agora →</span>
          </div>

          {/* Feature 2: Reservas */}
          <div className="feature-card">
            <div className="feature-icon feature-icon--book">
              <svg className="icon-book" viewBox="0 0 48 48" fill="none">
                <path 
                  className="icon-book__left" 
                  d="M24 38 C24 38 10 33 8 20 L8 10 C14 10 20 14 24 20" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path 
                  className="icon-book__right" 
                  d="M24 38 C24 38 38 33 40 20 L40 10 C34 10 28 14 24 20" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <line 
                  x1="24" 
                  y1="20" 
                  x2="24" 
                  y2="38" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round"
                />
                <line 
                  x1="13" 
                  y1="20" 
                  x2="21" 
                  y2="22" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  opacity="0.4"
                />
                <line 
                  x1="13" 
                  y1="25" 
                  x2="21" 
                  y2="27" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  opacity="0.4"
                />
                <line 
                  x1="35" 
                  y1="20" 
                  x2="27" 
                  y2="22" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  opacity="0.4"
                />
                <line 
                  x1="35" 
                  y1="25" 
                  x2="27" 
                  y2="27" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  opacity="0.4"
                />
              </svg>
            </div>
            <h3>Reservas Online</h3>
            <p>
              Reserve seu livro favorito de qualquer lugar e garanta sua vez na fila
            </p>
            <span className="feature-link">Fazer reserva →</span>
          </div>

          {/* Feature 3: Acompanhamento */}
          <div className="feature-card">
            <div className="feature-icon feature-icon--chart">
              <svg className="icon-chart" viewBox="0 0 48 48" fill="none">
                <line 
                  x1="8" 
                  y1="40" 
                  x2="40" 
                  y2="40" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round"
                />
                <rect 
                  className="icon-chart__bar icon-chart__bar--1" 
                  x="11" 
                  y="28" 
                  width="7" 
                  height="12" 
                  rx="2" 
                  fill="currentColor" 
                  opacity="0.3"
                />
                <rect 
                  className="icon-chart__bar icon-chart__bar--2" 
                  x="21" 
                  y="18" 
                  width="7" 
                  height="22" 
                  rx="2" 
                  fill="currentColor" 
                  opacity="0.6"
                />
                <rect 
                  className="icon-chart__bar icon-chart__bar--3" 
                  x="31" 
                  y="10" 
                  width="7" 
                  height="30" 
                  rx="2" 
                  fill="currentColor"
                />
              </svg>
            </div>
            <h3>Acompanhamento</h3>
            <p>
              Acompanhe seus empréstimos, reservas e histórico de leituras em tempo real
            </p>
            <span className="feature-link">Ver histórico →</span>
          </div>
        </div>
      </div>
    </section>
  );
};