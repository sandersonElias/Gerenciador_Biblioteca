import React from 'react';
import { BookAvailability } from '../models/BookDetailModel';

interface AvailabilityBarProps {
  availability: BookAvailability;
}

/**
 * Componente puro da barra de disponibilidade
 */
export const AvailabilityBar: React.FC<AvailabilityBarProps> = ({ availability }) => {
  return (
    <div className="book-availability">
      <h3>Disponibilidade</h3>
      <div className="availability-bar">
        <div
          className="availability-fill"
          style={{
            width: `${availability.percentage}%`,
            backgroundColor: availability.isAvailable ? '#0f6e56' : '#993c1d',
          }}
        />
      </div>
      <p className="availability-text">
        <strong>{availability.availableCount}</strong> de{' '}
        <strong>{availability.totalCount}</strong> disponíveis
      </p>
    </div>
  );
};