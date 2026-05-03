import React from 'react';
import { AdminCardConfig, AdminIcons } from '../models/AdminModel';

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
        {card.icon}
      </div>
      
      <div className="admin-card__body">
        <h3>{card.title}</h3>
        <p>{card.description}</p>
      </div>

      <AdminIcons.ArrowRightIcon />
    </div>
  );
};