import React from 'react';
import { Exemplar } from '@/services/exemplar/types';

interface ExemplarSelectorProps {
  exemplares: Exemplar[];
  loading: boolean;
  selectedId: string;
  onSelect: (exemplarId: string) => void;
}

export const ExemplarSelector: React.FC<ExemplarSelectorProps> = ({
  exemplares,
  loading,
  selectedId,
  onSelect,
}) => {
  return (
    <div className="loan-form__field loan-form__field--exemplar">
      <label className="loan-form__label">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7"/>
          <rect x="14" y="3" width="7" height="7"/>
          <rect x="3" y="14" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/>
        </svg>
        Exemplar
        {!loading && exemplares.length > 0 && (
          <span className="loan-form__optional">
            ({exemplares.length} disponível{exemplares.length !== 1 ? 'is' : ''})
          </span>
        )}
      </label>

      {loading ? (
        <p className="loan-form__hint">Buscando exemplares disponíveis…</p>
      ) : exemplares.length === 0 ? (
        <p className="loan-form__hint loan-form__hint--warn">
          Nenhum exemplar disponível para este livro
        </p>
      ) : (
        <select
          className="loan-form__input"
          value={selectedId}
          onChange={(e) => onSelect(e.target.value)}
        >
          <option value="">Automático — {exemplares[0]?.codigo}</option>
          {exemplares.map((ex) => (
            <option key={ex.id} value={String(ex.id)}>
              Exemplar {ex.codigo}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};