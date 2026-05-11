import React from 'react';
import { BookFormData } from '../models/BookFormModel';
import { AutorResponse, GeneroResponse, CatalogacaoResponse } from '@/services/livro/types';

interface BookBasicFieldsProps {
  form: BookFormData;
  onChange: (updates: Partial<BookFormData>) => void;
  // Autor
  autorSearchTerm: string;
  autorSuggestions: AutorResponse[];
  isAutorSelected: boolean;
  onAutorSearchChange: (value: string) => void;
  onAutorSelect: (autor: AutorResponse) => void;
  onAutorClear: () => void;
  // Gênero
  generoSearchTerm: string;
  generoSuggestions: GeneroResponse[];
  isGeneroSelected: boolean;
  onGeneroSearchChange: (value: string) => void;
  onGeneroSelect: (genero: GeneroResponse) => void;
  onGeneroClear: () => void;
  // Catalogação
  catalogacaoSearchTerm: string;
  catalogacaoSuggestions: CatalogacaoResponse[];
  isCatalogacaoSelected: boolean;
  onCatalogacaoSearchChange: (value: string) => void;
  onCatalogacaoSelect: (cat: CatalogacaoResponse) => void;
  onCatalogacaoClear: () => void;
}

export const BookBasicFields: React.FC<BookBasicFieldsProps> = ({
  form, onChange,
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
        <div className="form-section__icon form-section__icon--blue">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
        </div>
        Informações Básicas
      </div>

      <div className="field-group">

        {/* Título */}
        <div className="field">
          <label className="field__label">Título *</label>
          <input
            type="text"
            className="field__input"
            value={form.titulo}
            onChange={(e) => onChange({ titulo: e.target.value })}
            placeholder="Ex: Dom Casmurro"
          />
        </div>

        {/* Autor */}
        <div className="field autocomplete">
          <label className="field__label">Autor *</label>
          <input
            type="text"
            className="field__input"
            value={autorSearchTerm}
            onChange={(e) => { onAutorSearchChange(e.target.value); onAutorClear(); }}
            placeholder="Digite o nome do autor"
          />
          {autorSuggestions.length > 0 && (
            <ul className="suggestions-list">
              {autorSuggestions.map((a) => (
                <li key={a.id} onClick={() => onAutorSelect(a)}>{a.autor}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Editora */}
        <div className="field">
          <label className="field__label">Editora</label>
          <input
            type="text"
            className="field__input"
            value={form.editora}
            onChange={(e) => onChange({ editora: e.target.value })}
            placeholder="Ex: Companhia das Letras"
          />
        </div>

        {/* Gênero + Catalogação lado a lado */}
        <div className="field-row">

          <div className="field autocomplete">
            <label className="field__label">Gênero *</label>
            <input
              type="text"
              className="field__input"
              value={generoSearchTerm}
              onChange={(e) => { onGeneroSearchChange(e.target.value); onGeneroClear(); }}
              placeholder="Digite o gênero"
            />
            {generoSuggestions.length > 0 && (
              <ul className="suggestions-list">
                {generoSuggestions.map((g) => (
                  <li key={g.id} onClick={() => onGeneroSelect(g)}>{g.genero}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="field autocomplete">
            <label className="field__label">Catalogação *</label>
            <input
              type="text"
              className="field__input"
              value={catalogacaoSearchTerm}
              onChange={(e) => { onCatalogacaoSearchChange(e.target.value); onCatalogacaoClear(); }}
              placeholder="Digite a catalogação"
            />
            {catalogacaoSuggestions.length > 0 && (
              <ul className="suggestions-list">
                {catalogacaoSuggestions.map((c) => (
                  <li key={c.id} onClick={() => onCatalogacaoSelect(c)}>{c.catalogacao}</li>
                ))}
              </ul>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};