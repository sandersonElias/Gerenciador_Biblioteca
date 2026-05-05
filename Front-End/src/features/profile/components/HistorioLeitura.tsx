import React from 'react';
import { Link } from 'react-router-dom';
import { MeusEmprestimosResponse } from '@/services';
import { fmt } from '../models/ProfileModel';

interface HistorioLeituraProps {
  meusEmprestimos: MeusEmprestimosResponse | null; 
}

export const HistorioLeitura: React.FC<HistorioLeituraProps> = ({ 
  meusEmprestimos 
}) => {
  if (!meusEmprestimos?.historico || meusEmprestimos.historico.length === 0) {
    return null;
  }

  return (
    <section className="profile-section">
      <h2 className="section-title">
        <svg 
          width="18" 
          height="18" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <polyline points="12 8 12 12 14 14" />
          <circle cx="12" cy="12" r="10" />
        </svg>
        Histórico de Leituras
      </h2>

      <div className="history-list">
        {meusEmprestimos.historico.map((h) => (
          <div key={h.id} className="history-item">
            {/* Capa do livro */}
            <div className="history-cover">
              {h.livro.urlImg ? (
                <img src={h.livro.urlImg} alt={h.livro.titulo} />
              ) : (
                <div className="cover-placeholder cover-placeholder--sm">
                  <svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="1.5"
                  >
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Informações do empréstimo */}
            <div className="history-info">
              <Link 
                to={`/livro/${h.livro.id}`} 
                className="history-title"
              >
                {h.livro.titulo}
              </Link>
              <div className="history-dates">
                <span>
                  {fmt(h.dataEmprestimo)} → {fmt(h.dataDevolvido)}
                </span>
                {h.renovacoes > 0 && (
                  <span className="history-renewals">
                    {h.renovacoes} renovação{h.renovacoes > 1 ? 'ões' : ''}
                  </span>
                )}
              </div>
            </div>

            {/* Badge de status */}
            <span className="badge badge--info">Devolvido</span>
          </div>
        ))}
      </div>
    </section>
  );
};