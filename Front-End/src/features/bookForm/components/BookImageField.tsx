import React from 'react';
import { BookFormData, BookFormHelpers } from '../models/BookFormModel';

interface BookImageFieldProps {
  form: BookFormData;
  onChange: (updates: Partial<BookFormData>) => void;
}

export const BookImageField: React.FC<BookImageFieldProps> = ({ 
  form, 
  onChange 
}) => {
  const hasValidUrl = BookFormHelpers.isValidImageUrl(form.urlImg);

  return (
    <div className="form-section">
      <div className="form-section__title">
        <div className="form-section__icon form-section__icon--blue">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
        </div>
        Imagem da Capa
      </div>

      <div className="field">
        <label className="field__label">URL da Imagem</label>
        <input
          type="url"
          className="field__input"
          value={form.urlImg}
          onChange={(e) => onChange({ urlImg: e.target.value })}
          placeholder="https://exemplo.com/capa.jpg"
        />
      </div>

      {hasValidUrl && (
        <div className="image-preview">
          <img 
            src={form.urlImg} 
            alt="Preview da capa" 
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}
    </div>
  );
};