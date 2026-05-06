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
    <div className="form-field">
      <label className="form-label">URL da Imagem (Capa)</label>
      <input
        type="url"
        className="form-input"
        value={form.urlImg}
        onChange={(e) => onChange({ urlImg: e.target.value })}
        placeholder="https://exemplo.com/capa.jpg"
      />
      
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