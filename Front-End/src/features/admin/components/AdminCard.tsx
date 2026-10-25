import React from 'react';
import { AdminCardConfig } from '../models/AdminModel';
import { AdminIcon } from './AdminIcon';

interface AdminCardProps {
  card: AdminCardConfig;
  onClick: (route: string) => void;
}

/**
 * Componente puro de card de ação
 * Reutilizável para qualquer tipo de card
 */
export const AdminCard: React.FC<AdminCardProps> = ({ card, onClick }) => {
  return (
    <div 
      className={`admin-card admin-card--${card.variant}`}
      onClick={() => onClick(card.route)}
    >
      <div className="admin-card__icon">
        <AdminIcon name={card.icon} size={26} />
      </div>
      
      <div className="admin-card__body">
        <h3>{card.title}</h3>
        <p>{card.description}</p>
      </div>

      <AdminIcon name="arrowRight" size={18} className="admin-card__arrow" />
    </div>
  );
};