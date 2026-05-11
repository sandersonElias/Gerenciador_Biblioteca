import React from 'react';
import { AutorResponse, GeneroResponse, CatalogacaoResponse } from '@/services/livro/types';

interface BookRelationsFieldsProps {
  autorSearchTerm: string;
  autorSuggestions: AutorResponse[];
  isAutorSelected: boolean;
  onAutorSearchChange: (value: string) => void;
  onAutorSelect: (autor: AutorResponse) => void;
  onAutorClear: () => void;

  generoSearchTerm: string;
  generoSuggestions: GeneroResponse[];
  isGeneroSelected: boolean;
  onGeneroSearchChange: (value: string) => void;
  onGeneroSelect: (genero: GeneroResponse) => void;
  onGeneroClear: () => void;

  catalogacaoSearchTerm: string;
  catalogacaoSuggestions: CatalogacaoResponse[];
  isCatalogacaoSelected: boolean;
  onCatalogacaoSearchChange: (value: string) => void;
  onCatalogacaoSelect: (cat: CatalogacaoResponse) => void;
  onCatalogacaoClear: () => void;
}

export const BookRelationsFields: React.FC<BookRelationsFieldsProps> = ({
  autorSearchTerm, autorSuggestions, isAutorSelected,
  onAutorSearchChange, onAutorSelect, onAutorClear,
  generoSearchTerm, generoSuggestions, isGeneroSelected,
  onGeneroSearchChange, onGeneroSelect, onGeneroClear,
  catalogacaoSearchTerm, catalogacaoSuggestions, isCatalogacaoSelected,
  onCatalogacaoSearchChange, onCatalogacaoSelect, onCatalogacaoClear,
}) => {
  return (
    <div className="form-section">
      <div className="form-section__title">
        <div className="form-section__icon form-section__icon--amber">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </div>
        Classificação
      </div>

      <div className="field-group">
        {/* Autor */}
        <div className={`field field--autocomplete`}>
          <label className="field__label">
            Autor <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <div className={`field__input-wrap ${isAutorSelected ? 'field__input-wrap--selected' : ''}`}>
            <input
              type="text"
              className="field__input"
              value={autorSearchTerm}
              onChange={(e) => {
                onAutorSearchChange(e.target.value);
                onAutorClear();
              }}
              placeholder="Digite o nome do autor (mín. 2 letras)"
            />
            {isAutorSelected && <span className="check-mark">✓</span>}
          </div>
          {autorSuggestions.length > 0 && (
            <ul className="autocomplete-suggestions">
              {autorSuggestions.map((autor) => (
                <li key={autor.id} onClick={() => onAutorSelect(autor)}>
                  {autor.autor}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Gênero */}
        <div className="field field--autocomplete">
          <label className="field__label">
            Gênero <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <div className={`field__input-wrap ${isGeneroSelected ? 'field__input-wrap--selected' : ''}`}>
            <input
              type="text"
              className="field__input"
              value={generoSearchTerm}
              onChange={(e) => {
                onGeneroSearchChange(e.target.value);
                onGeneroClear();
              }}
              placeholder="Digite o gênero (mín. 2 letras)"
            />
            {isGeneroSelected && <span className="check-mark">✓</span>}
          </div>
          {generoSuggestions.length > 0 && (
            <ul className="autocomplete-suggestions">
              {generoSuggestions.map((genero) => (
                <li key={genero.id} onClick={() => onGeneroSelect(genero)}>
                  {genero.genero}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Catalogação — linha inteira */}
        <div className="field field--autocomplete" style={{ gridColumn: '1 / -1' }}>
          <label className="field__label">
            Catalogação <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <div className={`field__input-wrap ${isCatalogacaoSelected ? 'field__input-wrap--selected' : ''}`}>
            <input
              type="text"
              className="field__input"
              value={catalogacaoSearchTerm}
              onChange={(e) => {
                onCatalogacaoSearchChange(e.target.value);
                onCatalogacaoClear();
              }}
              placeholder="Digite a catalogação (mín. 2 letras)"
            />
            {isCatalogacaoSelected && <span className="check-mark">✓</span>}
          </div>
          {catalogacaoSuggestions.length > 0 && (
            <ul className="autocomplete-suggestions">
              {catalogacaoSuggestions.map((cat) => (
                <li key={cat.id} onClick={() => onCatalogacaoSelect(cat)}>
                  {cat.catalogacao}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};