import React from 'react';
import { 
  AutorResponse, 
  GeneroResponse, 
  CatalogacaoResponse 
} from '@/services/livro/types';

interface BookRelationsFieldsProps {
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

export const BookRelationsFields: React.FC<BookRelationsFieldsProps> = ({
  autorSearchTerm, autorSuggestions, isAutorSelected,
  onAutorSearchChange, onAutorSelect, onAutorClear,
  generoSearchTerm, generoSuggestions, isGeneroSelected,
  onGeneroSearchChange, onGeneroSelect, onGeneroClear,
  catalogacaoSearchTerm, catalogacaoSuggestions, isCatalogacaoSelected,
  onCatalogacaoSearchChange, onCatalogacaoSelect, onCatalogacaoClear,
}) => {
  return (
    <div className="form-grid">
      {/* Autor */}
      <div className="form-field autocomplete-field">
        <label className="form-label">
          Autor <span className="required">*</span>
        </label>
        <div className={`form-input-wrap ${isAutorSelected ? 'selected' : ''}`}>
          <input
            type="text"
            className="form-input"
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
      <div className="form-field autocomplete-field">
        <label className="form-label">
          Gênero <span className="required">*</span>
        </label>
        <div className={`form-input-wrap ${isGeneroSelected ? 'selected' : ''}`}>
          <input
            type="text"
            className="form-input"
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

      {/* Catalogação */}
      <div className="form-field autocomplete-field">
        <label className="form-label">
          Catalogação <span className="required">*</span>
        </label>
        <div className={`form-input-wrap ${isCatalogacaoSelected ? 'selected' : ''}`}>
          <input
            type="text"
            className="form-input"
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
  );
};