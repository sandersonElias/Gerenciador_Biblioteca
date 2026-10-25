import React from 'react';
import { AdminCardConfig } from '../models/AdminModel';
import { AdminCard } from './AdminCard';
import { AdminIcon } from './AdminIcon';

interface AdminSectionProps {
  title: string;
  description: string;
  createRoute: string;
  createButtonLabel: string;
  cards: AdminCardConfig[];
  onNavigate: (route: string) => void;
}

/**
 * Componente genérico de seção administrativa
 * Usado tanto para livros quanto para usuários
 */
export const AdminSection: React.FC<AdminSectionProps> = ({
  title,
  description,
  createRoute,
  createButtonLabel,
  cards,
  onNavigate,
}) => {
  return (
    <div className="admin-section">
      <div className="admin-section__header">
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <button 
          className="btn-primary" 
          onClick={() => onNavigate(createRoute)}
        >
          <AdminIcon name="plus" />
          {createButtonLabel}
        </button>
      </div>

      <div className="admin-cards">
        {cards.map((card) => (
          <AdminCard 
            key={card.id} 
            card={card} 
            onClick={onNavigate} 
          />
        ))}
      </div>
    </div>
  );
};