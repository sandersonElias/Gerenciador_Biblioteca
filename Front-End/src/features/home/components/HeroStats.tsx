// src/features/home/components/HeroStats.tsx

import React from 'react';

/**
 * Componente puro dos cards de estatísticas
 * Por enquanto com valores mockados (---)
 */
export const HeroStats: React.FC = () => {
  return (
    <div className="hero-stats">
      {/* Livros no acervo */}
      <div className="hero-stat">
        <div className="hero-stat__icon hero-stat__icon--blue">
          <svg 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        </div>
        <div>
          <p className="hero-stat__label">Livros no acervo</p>
          <p className="hero-stat__value">---</p>
        </div>
      </div>

      {/* Empréstimos do mês */}
      <div className="hero-stat">
        <div className="hero-stat__icon hero-stat__icon--amber">
          <svg 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
          </svg>
        </div>
        <div>
          <p className="hero-stat__label">Empréstimos este mês</p>
          <p className="hero-stat__value">---</p>
        </div>
      </div>

      {/* Usuários ativos */}
      <div className="hero-stat">
        <div className="hero-stat__icon hero-stat__icon--green">
          <svg 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <div>
          <p className="hero-stat__label">Usuários ativos</p>
          <p className="hero-stat__value">---</p>
        </div>
      </div>
    </div>
  );
};