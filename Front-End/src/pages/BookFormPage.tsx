import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { debounce } from '../utils/debounce'
import { Livro, LivroRequest, AutorResponse, GeneroResponse, CatalogacaoResponse } from '../types';
import { livroApi, autorApi, generoApi, catalogacaoApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useLoading } from '../context/LoadingContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import './BookFormPage.scss';

const BookFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  // Form visual fields (texto)
  const [formData, setFormData] = useState({
    titulo: '',
    editora: '',
    totalExemplares: 1,
    quantidadeDisponivel: 1,
    cdd: '',
    localizacao: '',
    descricao: '',
    urlImg: '',
    autor: '',
    genero: '',
    catalogacao: '',
  });

  // IDs reais que serão enviados no payload
  const [autorId, setAutorId] = useState<number | null>(null);
  const [generoId, setGeneroId] = useState<number | null>(null);
  const [catalogacaoId, setCatalogacaoId] = useState<number | null>(null);

  // Sugestões
  const [autorSuggestions, setAutorSuggestions] = useState<AutorResponse[]>([]);
  const [generoSuggestions, setGeneroSuggestions] = useState<GeneroResponse[]>([]);
  const [catalogacaoSuggestions, setCatalogacaoSuggestions] = useState<CatalogacaoResponse[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const { showToast } = useToast();
  const { withLoading } = useLoading();

  useEffect(() => {
    if (isEditing && id) {
      loadBook(parseInt(id, 10));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadBook = async (bookId: number) => {
    try {
      const book: Livro = await withLoading(livroApi.getById(bookId));
      setFormData({
        titulo: book.titulo,
        editora: book.editora || '',
        totalExemplares: book.totalExemplares,
        quantidadeDisponivel: book.quantidadeDisponivel,
        cdd: book.cdd || '',
        localizacao: book.localizacao || '',
        descricao: book.descricao || '',
        urlImg: book.urlImg || '',
        autor: (book.autor as any)?.autor || '',
        genero: (book.genero as any)?.genero || '',
        catalogacao: (book.catalogacao as any)?.catalogacao || '',
      });

      // tenta extrair ids se o backend retornar
      const aId = (book.autor as any)?.id ?? null;
      const gId = (book.genero as any)?.id ?? null;
      const cId = (book.catalogacao as any)?.id ?? null;
      setAutorId(aId);
      setGeneroId(gId);
      setCatalogacaoId(cId);
    } catch (error) {
      showToast('Erro ao carregar livro', 'error');
      navigate('/admin');
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.titulo.trim()) newErrors.titulo = 'Título é obrigatório';
    if (!formData.autor.trim()) newErrors.autor = 'Autor é obrigatório';
    if (!formData.genero.trim()) newErrors.genero = 'Gênero é obrigatório';
    if (!formData.catalogacao.trim()) newErrors.catalogacao = 'Catalogação é obrigatória';
    if (formData.totalExemplares < 1) newErrors.totalExemplares = 'Deve ter pelo menos 1 exemplar';
    if (formData.quantidadeDisponivel < 0) newErrors.quantidadeDisponivel = 'Quantidade não pode ser negativa';
    if (formData.quantidadeDisponivel > formData.totalExemplares) {
      newErrors.quantidadeDisponivel = 'Disponível não pode ser maior que total';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------- Suggestions helpers (debounced) ----------
  const fetchAutorSuggestions = async (q: string) => {
    if (!q.trim()) {
      setAutorSuggestions([]);
      return;
    }
    try {
      const res = await autorApi.getByAutor(q);
      // seu endpoint pode retornar um único objeto ou lista; normalize
      if (Array.isArray(res)) setAutorSuggestions(res);
      else setAutorSuggestions([res]);
    } catch {
      setAutorSuggestions([]);
    }
  };

  const fetchGeneroSuggestions = async (q: string) => {
    if (!q.trim()) {
      setGeneroSuggestions([]);
      return;
    }
    try {
      const res = await generoApi.getByGenero(q);
      if (Array.isArray(res)) setGeneroSuggestions(res);
      else setGeneroSuggestions([res]);
    } catch {
      setGeneroSuggestions([]);
    }
  };

  const fetchCatalogacaoSuggestions = async (q: string) => {
    if (!q.trim()) {
      setCatalogacaoSuggestions([]);
      return;
    }
    try {
      const res = await catalogacaoApi.getByCatalogacao(q);
      if (Array.isArray(res)) setCatalogacaoSuggestions(res);
      else setCatalogacaoSuggestions([res]);
    } catch {
      setCatalogacaoSuggestions([]);
    }
  };

  const debouncedAutor = useMemo(() => debounce(fetchAutorSuggestions, 300), []);
  const debouncedGenero = useMemo(() => debounce(fetchGeneroSuggestions, 300), []);
  const debouncedCatalogacao = useMemo(() => debounce(fetchCatalogacaoSuggestions, 300), []);

  // ---------- handle typing and selection ----------
  const handleChangeField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleTyping = (field: 'autor' | 'genero' | 'catalogacao', value: string) => {
    handleChangeField(field, value);
    // reset id quando o texto muda
    if (field === 'autor') setAutorId(null);
    if (field === 'genero') setGeneroId(null);
    if (field === 'catalogacao') setCatalogacaoId(null);

    // buscar sugestões
    if (field === 'autor') debouncedAutor(value);
    if (field === 'genero') debouncedGenero(value);
    if (field === 'catalogacao') debouncedCatalogacao(value);
  };

  const handleSelectSuggestion = (field: 'autor' | 'genero' | 'catalogacao', item: any) => {
    if (field === 'autor') {
      setAutorId(item.id);
      handleChangeField('autor', item.autor);
      setAutorSuggestions([]);
    }
    if (field === 'genero') {
      setGeneroId(item.id);
      handleChangeField('genero', item.genero);
      setGeneroSuggestions([]);
    }
    if (field === 'catalogacao') {
      setCatalogacaoId(item.id);
      handleChangeField('catalogacao', item.catalogacao);
      setCatalogacaoSuggestions([]);
    }
  };

  // ---------- ensureEntity: busca por nome e cria se necessário ----------
  const ensureEntity = async (type: 'autor' | 'genero' | 'catalogacao', name: string) => {
    const trimmed = name.trim();
    if (!trimmed) throw new Error(`${type} vazio`);
    try {
      if (type === 'autor') {
        const found = await autorApi.getByAutor(trimmed);
        if (found && (found as any).id) return (found as any).id;
      }
      if (type === 'genero') {
        const found = await generoApi.getByGenero(trimmed);
        if (found && (found as any).id) return (found as any).id;
      }
      if (type === 'catalogacao') {
        const found = await catalogacaoApi.getByCatalogacao(trimmed);
        if (found && (found as any).id) return (found as any).id;
      }
    } catch {
      // se a busca falhar, seguimos para criação
    }

    // criar novo
    if (type === 'autor') {
      const created = await autorApi.create({ autor: trimmed });
      return created.id;
    }
    if (type === 'genero') {
      const created = await generoApi.create({ genero: trimmed });
      return created.id;
    }
    if (type === 'catalogacao') {
      const created = await catalogacaoApi.create({ catalogacao: trimmed });
      return created.id;
    }
    throw new Error('Tipo inválido');
  };

  // ---------- submit ----------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      // garantir ids: se já selecionado usa, senão cria/busca
      const aId = autorId ?? await ensureEntity('autor', formData.autor);
      const gId = generoId ?? await ensureEntity('genero', formData.genero);
      const cId = catalogacaoId ?? await ensureEntity('catalogacao', formData.catalogacao);

      const payload: LivroRequest = {
        titulo: formData.titulo,
        editora: formData.editora || '',
        totalExemplares: Number(formData.totalExemplares),
        quantidadeDisponivel: Number(formData.quantidadeDisponivel),
        cdd: formData.cdd || '',
        localizacao: formData.localizacao || '',
        descricao: formData.descricao || '',
        urlImg: formData.urlImg || '',
        autorId: aId,
        generoId: gId,
        catalogacaoId: cId,
      };

      if (isEditing && id) {
        await livroApi.update(parseInt(id, 10), payload);
        showToast('Livro atualizado com sucesso!', 'success');
      } else {
        await livroApi.create(payload);
        showToast('Livro cadastrado com sucesso!', 'success');
      }
      navigate('/admin');
    } catch (err: any) {
      showToast(err.response?.data?.message || err.message || 'Erro ao salvar livro', 'error');
    }
  };

  return (
    <div className="book-form-page">
      <div className="container">
        <div className="form-header">
          <h1>{isEditing ? 'Editar Livro' : 'Cadastrar Novo Livro'}</h1>
          <p>Preencha os dados do livro abaixo</p>
        </div>

        <form onSubmit={handleSubmit} className="book-form" autoComplete="off">
          <div className="form-grid">
            <div className="form-section">
              <h3>Informações Básicas</h3>

              <Input
                label="Título *"
                value={formData.titulo}
                onChange={(e) => handleChangeField('titulo', e.target.value)}
                error={errors.titulo}
                placeholder="Digite o título do livro"
              />

              {/* AUTOCOMPLETE AUTOR */}
              <div className="autocomplete">
                <Input
                  label="Autor *"
                  value={formData.autor}
                  onChange={(e) => handleTyping('autor', e.target.value)}
                  error={errors.autor}
                  placeholder="Nome do autor"
                />
                {autorSuggestions.length > 0 && (
                  <ul className="suggestions-list">
                    {autorSuggestions.map(s => (
                      <li key={s.id} onClick={() => handleSelectSuggestion('autor', s)}>
                        {s.autor}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <Input
                label="Editora"
                value={formData.editora}
                onChange={(e) => handleChangeField('editora', e.target.value)}
                placeholder="Nome da editora"
              />

              <div className="form-row">
                {/* AUTOCOMPLETE GÊNERO */}
                <div className="autocomplete">
                  <Input
                    label="Gênero *"
                    value={formData.genero}
                    onChange={(e) => handleTyping('genero', e.target.value)}
                    error={errors.genero}
                    placeholder="Ex: Ficção, Romance"
                  />
                  {generoSuggestions.length > 0 && (
                    <ul className="suggestions-list">
                      {generoSuggestions.map(s => (
                        <li key={s.id} onClick={() => handleSelectSuggestion('genero', s)}>
                          {s.genero}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* AUTOCOMPLETE CATALOGAÇÃO */}
                <div className="autocomplete">
                  <Input
                    label="Catalogação *"
                    value={formData.catalogacao}
                    onChange={(e) => handleTyping('catalogacao', e.target.value)}
                    error={errors.catalogacao}
                    placeholder="Ex: 800 - Literatura"
                  />
                  {catalogacaoSuggestions.length > 0 && (
                    <ul className="suggestions-list">
                      {catalogacaoSuggestions.map(s => (
                        <li key={s.id} onClick={() => handleSelectSuggestion('catalogacao', s)}>
                          {s.catalogacao}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Detalhes Físicos</h3>

              <div className="form-row">
                <Input
                  label="Total de Exemplares *"
                  type="number"
                  value={formData.totalExemplares}
                  onChange={(e) => handleChangeField('totalExemplares', parseInt(e.target.value, 10) || 0)}
                  error={errors.totalExemplares}
                  min={1}
                />

                <Input
                  label="Disponíveis *"
                  type="number"
                  value={formData.quantidadeDisponivel}
                  onChange={(e) => handleChangeField('quantidadeDisponivel', parseInt(e.target.value, 10) || 0)}
                  error={errors.quantidadeDisponivel}
                  min={0}
                />
              </div>

              <div className="form-row">
                <Input
                  label="CDD"
                  value={formData.cdd}
                  onChange={(e) => handleChangeField('cdd', e.target.value)}
                  placeholder="Código de classificação"
                />

                <Input
                  label="Localização"
                  value={formData.localizacao}
                  onChange={(e) => handleChangeField('localizacao', e.target.value)}
                  placeholder="Prateleira/seção"
                />
              </div>

              <Input
                label="URL da Imagem da Capa"
                value={formData.urlImg}
                onChange={(e) => handleChangeField('urlImg', e.target.value)}
                placeholder="https://exemplo.com/imagem.jpg"
              />

              {formData.urlImg && (
                <div className="image-preview">
                  <img src={formData.urlImg} alt="Preview da capa" />
                </div>
              )}
            </div>

            <div className="form-section full-width">
              <h3>Descrição</h3>
              <textarea
                value={formData.descricao}
                onChange={(e) => handleChangeField('descricao', e.target.value)}
                placeholder="Descrição ou sinopse do livro..."
                rows={4}
              />
            </div>
          </div>

          <div className="form-actions">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate('/admin')}
            >
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
