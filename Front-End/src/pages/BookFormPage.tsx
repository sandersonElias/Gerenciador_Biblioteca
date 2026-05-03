import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { debounce } from '../utils/debounce';
import { useToast } from '../context/ToastContext';
import { useLoading } from '../context/LoadingContext';
import Button from '../components/common/Button';
import './BookFormPage.scss';
import { AutorResponse, CatalogacaoResponse, GeneroResponse, Livro, LivroRequest } from '@/services/livro/types';
import { AutorService, CatalogacaoService, GeneroService, LivroService } from '@/services/livro/LivroService';

const BookFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    titulo: '', editora: '', totalExemplares: 1, quantidadeDisponivel: 1,
    cdd: '', localizacao: '', descricao: '', urlImg: '',
    autor: '', genero: '', catalogacao: '',
  });

  const [autorId, setAutorId]             = useState<number | null>(null);
  const [generoId, setGeneroId]           = useState<number | null>(null);
  const [catalogacaoId, setCatalogacaoId] = useState<number | null>(null);

  const [autorSuggestions, setAutorSuggestions]               = useState<AutorResponse[]>([]);
  const [generoSuggestions, setGeneroSuggestions]             = useState<GeneroResponse[]>([]);
  const [catalogacaoSuggestions, setCatalogacaoSuggestions]   = useState<CatalogacaoResponse[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const { showToast } = useToast();
  const { withLoading } = useLoading();

  useEffect(() => {
    if (isEditing && id) loadBook(parseInt(id, 10));
    // eslint-disable-next-line
  }, [id]);

  const loadBook = async (bookId: number) => {
    try {
      const book: Livro = await withLoading(LivroService.getById(bookId));
      setFormData({
        titulo: book.titulo, editora: book.editora || '',
        totalExemplares: book.totalExemplares, quantidadeDisponivel: book.quantidadeDisponivel,
        cdd: book.cdd || '', localizacao: book.localizacao || '',
        descricao: book.descricao || '', urlImg: book.urlImg || '',
        autor: (book.autor as any)?.autor || '',
        genero: (book.genero as any)?.genero || '',
        catalogacao: (book.catalogacao as any)?.catalogacao || '',
      });
      setAutorId((book.autor as any)?.id ?? null);
      setGeneroId((book.genero as any)?.id ?? null);
      setCatalogacaoId((book.catalogacao as any)?.id ?? null);
    } catch {
      showToast('Erro ao carregar livro', 'error');
      navigate('/admin');
    }
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.titulo.trim())      e.titulo      = 'Título é obrigatório';
    if (!formData.autor.trim())       e.autor       = 'Autor é obrigatório';
    if (!formData.genero.trim())      e.genero      = 'Gênero é obrigatório';
    if (!formData.catalogacao.trim()) e.catalogacao = 'Catalogação é obrigatória';
    if (formData.totalExemplares < 1) e.totalExemplares = 'Mínimo de 1 exemplar';
    if (formData.quantidadeDisponivel < 0) e.quantidadeDisponivel = 'Não pode ser negativo';
    if (formData.quantidadeDisponivel > formData.totalExemplares)
      e.quantidadeDisponivel = 'Não pode ser maior que o total';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Autocomplete suggestions ───────────────────────────────────────────────

  const fetchSuggestions = async (type: 'autor' | 'genero' | 'catalogacao', q: string) => {
    if (!q.trim()) {
      if (type === 'autor')       setAutorSuggestions([]);
      if (type === 'genero')      setGeneroSuggestions([]);
      if (type === 'catalogacao') setCatalogacaoSuggestions([]);
      return;
    }
    try {
      // ✅ todas as funções retornam array agora
      if (type === 'autor') {
        const r = await AutorService.getByAutor(q);
        setAutorSuggestions(Array.isArray(r) ? r : []);
      }
      if (type === 'genero') {
        const r = await GeneroService.getByGenero(q);
        setGeneroSuggestions(Array.isArray(r) ? r : []);
      }
      if (type === 'catalogacao') {
        const r = await CatalogacaoService.getByCatalogacao(q);
        setCatalogacaoSuggestions(Array.isArray(r) ? r : []);
      }
    } catch {
      if (type === 'autor')       setAutorSuggestions([]);
      if (type === 'genero')      setGeneroSuggestions([]);
      if (type === 'catalogacao') setCatalogacaoSuggestions([]);
    }
  };

  const debouncedAutor       = useMemo(() => debounce((q: string) => fetchSuggestions('autor', q), 300), []);
  const debouncedGenero      = useMemo(() => debounce((q: string) => fetchSuggestions('genero', q), 300), []);
  const debouncedCatalogacao = useMemo(() => debounce((q: string) => fetchSuggestions('catalogacao', q), 300), []);

  const changeField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleTyping = (field: 'autor' | 'genero' | 'catalogacao', value: string) => {
    changeField(field, value);
    if (field === 'autor')       { setAutorId(null);       debouncedAutor(value); }
    if (field === 'genero')      { setGeneroId(null);      debouncedGenero(value); }
    if (field === 'catalogacao') { setCatalogacaoId(null); debouncedCatalogacao(value); }
  };

  const selectSuggestion = (field: 'autor' | 'genero' | 'catalogacao', item: any) => {
    if (field === 'autor')       { setAutorId(item.id);       changeField('autor', item.autor);             setAutorSuggestions([]); }
    if (field === 'genero')      { setGeneroId(item.id);      changeField('genero', item.genero);           setGeneroSuggestions([]); }
    if (field === 'catalogacao') { setCatalogacaoId(item.id); changeField('catalogacao', item.catalogacao); setCatalogacaoSuggestions([]); }
  };

  // ── Garante que autor/genero/catalogacao existem no banco ─────────────────
  // ✅ corrigido: getByAutor retorna array — pega o primeiro item com match exato
  const ensureEntity = async (type: 'autor' | 'genero' | 'catalogacao', name: string): Promise<number> => {
    const t = name.trim();
    try {
      if (type === 'autor') {
        const list = await AutorService.getByAutor(t);
        const found = list.find(a => a.autor.toLowerCase() === t.toLowerCase());
        if (found?.id) return found.id;
      }
      if (type === 'genero') {
        const list = await GeneroService.getByGenero(t);
        const found = list.find(g => g.genero.toLowerCase() === t.toLowerCase());
        if (found?.id) return found.id;
      }
      if (type === 'catalogacao') {
        const list = await CatalogacaoService.getByCatalogacao(t);
        const found = list.find(c => c.catalogacao.toLowerCase() === t.toLowerCase());
        if (found?.id) return found.id;
      }
    } catch {}

    // Não encontrou — cria novo
    if (type === 'autor')       return (await AutorService.create({ autor: t })).id;
    if (type === 'genero')      return (await GeneroService.create({ genero: t })).id;
    return (await CatalogacaoService.create({ catalogacao: t })).id;
  };

  // ── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    try {
      const aId = autorId       ?? await ensureEntity('autor', formData.autor);
      const gId = generoId      ?? await ensureEntity('genero', formData.genero);
      const cId = catalogacaoId ?? await ensureEntity('catalogacao', formData.catalogacao);

      const payload: LivroRequest = {
        titulo: formData.titulo, editora: formData.editora,
        totalExemplares: Number(formData.totalExemplares),
        quantidadeDisponivel: Number(formData.quantidadeDisponivel),
        cdd: formData.cdd, localizacao: formData.localizacao,
        descricao: formData.descricao, urlImg: formData.urlImg,
        autorId: aId, generoId: gId, catalogacaoId: cId,
      };

      if (isEditing && id) {
        await LivroService.update(parseInt(id, 10), payload);
        showToast('Livro atualizado com sucesso!', 'success');
      } else {
        await LivroService.create(payload);
        showToast('Livro cadastrado com sucesso!', 'success');
      }
      navigate('/admin');
    } catch (err: any) {
      showToast(err.response?.data?.message || err.message || 'Erro ao salvar livro', 'error');
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="form-page">
      <div className="container">

        <div className="form-page__header">
          <button className="btn-back" onClick={() => navigate('/admin')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Voltar
          </button>
          <div>
            <h1>{isEditing ? 'Editar Livro' : 'Cadastrar Novo Livro'}</h1>
            <p>Preencha os dados do livro abaixo</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="form-card" autoComplete="off" noValidate>
          <div className="form-grid-2">

            {/* ── Coluna esquerda: Informações básicas ── */}
            <div className="form-section">
              <div className="form-section__title">
                <div className="form-section__icon form-section__icon--blue">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                  </svg>
                </div>
                Informações Básicas
              </div>

              <div className="field-group">
                <div className={`field ${errors.titulo ? 'field--error' : ''}`}>
                  <label className="field__label">Título *</label>
                  <input className="field__input" value={formData.titulo}
                    onChange={e => changeField('titulo', e.target.value)} placeholder="Título do livro" />
                  {errors.titulo && <span className="field__error">{errors.titulo}</span>}
                </div>

                <div className={`field autocomplete ${errors.autor ? 'field--error' : ''}`}>
                  <label className="field__label">Autor *</label>
                  <input className="field__input" value={formData.autor}
                    onChange={e => handleTyping('autor', e.target.value)} placeholder="Nome do autor" />
                  {errors.autor && <span className="field__error">{errors.autor}</span>}
                  {autorSuggestions.length > 0 && (
                    <ul className="suggestions-list">
                      {autorSuggestions.map(s => <li key={s.id} onClick={() => selectSuggestion('autor', s)}>{s.autor}</li>)}
                    </ul>
                  )}
                </div>

                <div className="field">
                  <label className="field__label">Editora</label>
                  <input className="field__input" value={formData.editora}
                    onChange={e => changeField('editora', e.target.value)} placeholder="Nome da editora" />
                </div>

                <div className="field-row">
                  <div className={`field autocomplete ${errors.genero ? 'field--error' : ''}`}>
                    <label className="field__label">Gênero *</label>
                    <input className="field__input" value={formData.genero}
                      onChange={e => handleTyping('genero', e.target.value)} placeholder="Ex: Ficção" />
                    {errors.genero && <span className="field__error">{errors.genero}</span>}
                    {generoSuggestions.length > 0 && (
                      <ul className="suggestions-list">
                        {generoSuggestions.map(s => <li key={s.id} onClick={() => selectSuggestion('genero', s)}>{s.genero}</li>)}
                      </ul>
                    )}
                  </div>

                  <div className={`field autocomplete ${errors.catalogacao ? 'field--error' : ''}`}>
                    <label className="field__label">Catalogação *</label>
                    <input className="field__input" value={formData.catalogacao}
                      onChange={e => handleTyping('catalogacao', e.target.value)} placeholder="Ex: 800" />
                    {errors.catalogacao && <span className="field__error">{errors.catalogacao}</span>}
                    {catalogacaoSuggestions.length > 0 && (
                      <ul className="suggestions-list">
                        {catalogacaoSuggestions.map(s => <li key={s.id} onClick={() => selectSuggestion('catalogacao', s)}>{s.catalogacao}</li>)}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Coluna direita: Detalhes físicos ── */}
            <div className="form-section">
              <div className="form-section__title">
                <div className="form-section__icon form-section__icon--teal">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  </svg>
                </div>
                Detalhes Físicos
              </div>

              <div className="field-group">
                <div className="field-row">
                  <div className={`field ${errors.totalExemplares ? 'field--error' : ''}`}>
                    <label className="field__label">Total de Exemplares *</label>
                    <input className="field__input" type="number" min={1}
                      value={formData.totalExemplares}
                      onChange={e => changeField('totalExemplares', parseInt(e.target.value, 10) || 0)} />
                    {errors.totalExemplares && <span className="field__error">{errors.totalExemplares}</span>}
                  </div>

                  <div className={`field ${errors.quantidadeDisponivel ? 'field--error' : ''}`}>
                    <label className="field__label">Disponíveis *</label>
                    <input className="field__input" type="number" min={0}
                      value={formData.quantidadeDisponivel}
                      onChange={e => changeField('quantidadeDisponivel', parseInt(e.target.value, 10) || 0)} />
                    {errors.quantidadeDisponivel && <span className="field__error">{errors.quantidadeDisponivel}</span>}
                  </div>
                </div>

                <div className="field-row">
                  <div className="field">
                    <label className="field__label">CDD</label>
                    <input className="field__input" value={formData.cdd}
                      onChange={e => changeField('cdd', e.target.value)} placeholder="Código de classificação" />
                  </div>

                  <div className="field">
                    <label className="field__label">Localização</label>
                    <input className="field__input" value={formData.localizacao}
                      onChange={e => changeField('localizacao', e.target.value)} placeholder="Prateleira/seção" />
                  </div>
                </div>

                <div className="field">
                  <label className="field__label">URL da Capa</label>
                  <input className="field__input" value={formData.urlImg}
                    onChange={e => changeField('urlImg', e.target.value)}
                    placeholder="https://exemplo.com/capa.jpg" />
                </div>

                {formData.urlImg && (
                  <div className="image-preview">
                    <div className="image-preview__cover">
                      <img src={formData.urlImg} alt="Preview da capa"
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    </div>
                    <p className="image-preview__info">Preview da capa</p>
                  </div>
                )}
              </div>
            </div>

            {/* ── Descrição (full width) ── */}
            <div className="form-section full-width">
              <div className="form-section__title">
                <div className="form-section__icon form-section__icon--amber">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/>
                    <line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/>
                  </svg>
                </div>
                Descrição / Sinopse
              </div>

              <div className="field">
                <textarea
                  className="field__textarea"
                  value={formData.descricao}
                  onChange={e => changeField('descricao', e.target.value)}
                  placeholder="Descrição ou sinopse do livro..."
                  rows={4}
                />
              </div>
            </div>

          </div>

          <div className="form-actions">
            <Button type="button" variant="ghost" onClick={() => navigate('/admin')}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" size="lg">
              {isEditing ? 'Salvar Alterações' : 'Cadastrar Livro'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookFormPage;