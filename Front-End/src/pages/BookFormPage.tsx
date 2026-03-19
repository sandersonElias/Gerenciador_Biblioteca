import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Livro, LivroRequest } from '../types';
import { livroApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useLoading } from '../context/LoadingContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import './BookFormPage.scss';

const BookFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const [formData, setFormData] = useState<LivroRequest>({
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
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { showToast } = useToast();
  const { withLoading } = useLoading();

  useEffect(() => {
    if (isEditing) {
      loadBook(parseInt(id));
    }
  }, [id]);

  const loadBook = async (bookId: number) => {
    try {
      const book = await withLoading(livroApi.getById(bookId));
      setFormData({
        titulo: book.titulo,
        editora: book.editora || '',
        totalExemplares: book.totalExemplares,
        quantidadeDisponivel: book.quantidadeDisponivel,
        cdd: book.cdd || '',
        localizacao: book.localizacao || '',
        descricao: book.descricao || '',
        urlImg: book.urlImg || '',
        autor: book.autor?.autor || '',
        genero: book.genero?.genero || '',
        catalogacao: book.catalogacao?.catalogacao || '',
      });
    } catch (error) {
      showToast('Erro ao carregar livro', 'error');
      navigate('/admin');
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.titulo.trim()) newErrors.titulo = 'T�tulo � obrigat�rio';
    if (!formData.autor.trim()) newErrors.autor = 'Autor � obrigat�rio';
    if (!formData.genero.trim()) newErrors.genero = 'G�nero � obrigat�rio';
    if (!formData.catalogacao.trim()) newErrors.catalogacao = 'Cataloga��o � obrigat�ria';
    if (formData.totalExemplares < 1) newErrors.totalExemplares = 'Deve ter pelo menos 1 exemplar';
    if (formData.quantidadeDisponivel < 0) newErrors.quantidadeDisponivel = 'Quantidade n�o pode ser negativa';
    if (formData.quantidadeDisponivel > formData.totalExemplares) {
      newErrors.quantidadeDisponivel = 'Dispon�vel n�o pode ser maior que total';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    try {
      if (isEditing) {
        await livroApi.update(parseInt(id), formData);
        showToast('Livro atualizado com sucesso!', 'success');
      } else {
        await livroApi.create(formData);
        showToast('Livro cadastrado com sucesso!', 'success');
      }
      navigate('/admin');
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Erro ao salvar livro', 'error');
    }
  };

  const handleChange = (field: keyof LivroRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="book-form-page">
      <div className="container">
        <div className="form-header">
          <h1>{isEditing ? 'Editar Livro' : 'Cadastrar Novo Livro'}</h1>
          <p>Preencha os dados do livro abaixo</p>
        </div>

        <form onSubmit={handleSubmit} className="book-form">
          <div className="form-grid">
            <div className="form-section">
              <h3>Informa��es B�sicas</h3>
              
              <Input
                label="T�tulo *"
                value={formData.titulo}
                onChange={(e) => handleChange('titulo', e.target.value)}
                error={errors.titulo}
                placeholder="Digite o t�tulo do livro"
              />
              
              <Input
                label="Autor *"
                value={formData.autor}
                onChange={(e) => handleChange('autor', e.target.value)}
                error={errors.autor}
                placeholder="Nome do autor"
              />
              
              <Input
                label="Editora"
                value={formData.editora}
                onChange={(e) => handleChange('editora', e.target.value)}
                placeholder="Nome da editora"
              />
              
              <div className="form-row">
                <Input
                  label="G�nero *"
                  value={formData.genero}
                  onChange={(e) => handleChange('genero', e.target.value)}
                  error={errors.genero}
                  placeholder="Ex: Fic��o, Romance"
                />
                
                <Input
                  label="Cataloga��o *"
                  value={formData.catalogacao}
                  onChange={(e) => handleChange('catalogacao', e.target.value)}
                  error={errors.catalogacao}
                  placeholder="Ex: 800 - Literatura"
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Detalhes F�sicos</h3>
              
              <div className="form-row">
                <Input
                  label="Total de Exemplares *"
                  type="number"
                  value={formData.totalExemplares}
                  onChange={(e) => handleChange('totalExemplares', parseInt(e.target.value) || 0)}
                  error={errors.totalExemplares}
                  min={1}
                />
                
                <Input
                  label="Dispon�veis *"
                  type="number"
                  value={formData.quantidadeDisponivel}
                  onChange={(e) => handleChange('quantidadeDisponivel', parseInt(e.target.value) || 0)}
                  error={errors.quantidadeDisponivel}
                  min={0}
                />
              </div>
              
              <div className="form-row">
                <Input
                  label="CDD"
                  value={formData.cdd}
                  onChange={(e) => handleChange('cdd', e.target.value)}
                  placeholder="C�digo de classifica��o"
                />
                
                <Input
                  label="Localiza��o"
                  value={formData.localizacao}
                  onChange={(e) => handleChange('localizacao', e.target.value)}
                  placeholder="Prateleira/se��o"
                />
              </div>
              
              <Input
                label="URL da Imagem da Capa"
                value={formData.urlImg}
                onChange={(e) => handleChange('urlImg', e.target.value)}
                placeholder="https://exemplo.com/imagem.jpg"
              />
              
              {formData.urlImg && (
                <div className="image-preview">
                  <img src={formData.urlImg} alt="Preview da capa" />
                </div>
              )}
            </div>

            <div className="form-section full-width">
              <h3>Descri��o</h3>
              <textarea
                value={formData.descricao}
                onChange={(e) => handleChange('descricao', e.target.value)}
                placeholder="Descri��o ou sinopse do livro..."
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
              {isEditing ? 'Salvar Altera��es' : 'Cadastrar Livro'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookFormPage;
