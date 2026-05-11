import React from 'react';
import { BookFormData, BookFormMode } from '../models/BookFormModel';

interface BookCdaFieldsProps {
  form: BookFormData;
  mode: BookFormMode;
  onChange: (updates: Partial<BookFormData>) => void;
}

export const BookCdaFields: React.FC<BookCdaFieldsProps> = ({
  form, mode, onChange,
}) => {
  const isEdit = mode === 'edit';

  return (
    <div className="form-section">
      <div className="form-section__title">
        <div className="form-section__icon form-section__icon--teal">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="16"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
        </div>
        Detalhes Físicos
      </div>

      <div className="field-group">

        {/* Total + Disponíveis */}
        <div className="field-row">
          <div className="field">
            <label className="field__label">Total de Exemplares *</label>
            <input
              type="number"
              className="field__input"
              value={form.totalExemplares}
              onChange={(e) => onChange({ totalExemplares: e.target.value })}
              min="0"
            />
            {isEdit && (
              <span style={{ fontSize: '0.73rem', color: '#f59e0b', marginTop: '0.15rem' }}>
                ⚠️ Aumentar este número irá criar exemplares adicionais
              </span>
            )}
          </div>

          <div className="field">
            <label className="field__label">Disponíveis *</label>
            <input
              type="number"
              className="field__input"
              value={form.quantidadeDisponivel}
              onChange={(e) => onChange({ quantidadeDisponivel: e.target.value })}
              min="0"
            />
          </div>
        </div>

        {/* CDD + Localização */}
        <div className="field-row">
          <div className="field">
            <label className="field__label">CDD</label>
            <input
              type="text"
              className="field__input"
              value={form.cdd}
              onChange={(e) => onChange({ cdd: e.target.value })}
              placeholder="Ex: 869.3"
            />
          </div>

          <div className="field">
            <label className="field__label">Localização</label>
            <input
              type="text"
              className="field__input"
              value={form.localizacao}
              onChange={(e) => onChange({ localizacao: e.target.value })}
              placeholder="Ex: Estante A-3"
            />
          </div>
        </div>

        {/* URL da Capa */}
        <div className="field">
          <label className="field__label">URL da Capa</label>
          <input
            type="url"
            className="field__input"
            value={form.urlImg}
            onChange={(e) => onChange({ urlImg: e.target.value })}
            placeholder="https://exemplo.com/capa.jpg"
          />
        </div>

        {/* ✅ Preview — mostra sempre que tiver URL, não usa isValidImageUrl */}
        {form.urlImg && (
          <div className="image-preview">
            <div className="image-preview__cover">
              <img
                src={form.urlImg}
                alt="Preview da capa"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onLoad={(e) => {
                  // ✅ Garante que o container aparece quando a imagem carrega
                  const container = (e.target as HTMLImageElement).closest('.image-preview') as HTMLElement;
                  if (container) container.style.display = 'flex';
                }}
                onError={(e) => {
                  // ✅ Esconde tudo se a imagem não carregar
                  const container = (e.target as HTMLImageElement).closest('.image-preview') as HTMLElement;
                  if (container) container.style.display = 'none';
                }}
              />
            </div>
            <div className="image-preview__info">Preview da capa</div>
          </div>
        )}

      </div>
    </div>
  );
};