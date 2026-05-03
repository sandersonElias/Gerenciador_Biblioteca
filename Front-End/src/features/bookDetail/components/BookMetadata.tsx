import React from 'react';

interface MetadataItem {
  label: string;
  value: string;
}

interface BookMetadataProps {
  items: MetadataItem[];
}

/**
 * Componente puro que renderiza a grade de metadados
 */
export const BookMetadata: React.FC<BookMetadataProps> = ({ items }) => {
  return (
    <div className="book-meta">
      {items.map((item, index) => (
        <div key={index} className="meta-item">
          <span className="meta-label">{item.label}</span>
          <span className="meta-value">{item.value}</span>
        </div>
      ))}
    </div>
  );
};