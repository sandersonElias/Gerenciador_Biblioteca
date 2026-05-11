import { Livro, LivroRequest } from '@/services/livro/types';

export interface BookFormData {
  titulo: string;
  editora: string;
  totalExemplares: string;      
  quantidadeDisponivel: string; 
  cdd: string;
  localizacao: string;
  descricao: string;
  urlImg: string;
  autorId: string;       
  generoId: string;      
  catalogacaoId: string; 
}

export const INITIAL_BOOK_FORM: BookFormData = {
  titulo: '',
  editora: '',
  totalExemplares: '1',
  quantidadeDisponivel: '1',
  cdd: '',
  localizacao: '',
  descricao: '',
  urlImg: '',
  autorId: '',
  generoId: '',
  catalogacaoId: '',
};

export type BookFormMode = 'create' | 'edit';

export class BookFormHelpers {

  static toRequest(form: BookFormData): LivroRequest {
    return {
      titulo: form.titulo.trim(),
      editora: form.editora.trim(),
      totalExemplares: Number(form.totalExemplares) || 0,
      quantidadeDisponivel: Number(form.quantidadeDisponivel) || 0,
      cdd: form.cdd.trim(),
      localizacao: form.localizacao.trim(),
      descricao: form.descricao.trim(),
      urlImg: form.urlImg.trim(),
      autorId: Number(form.autorId),
      generoId: Number(form.generoId),
      catalogacaoId: Number(form.catalogacaoId),
    };
  }

  static fromLivro(livro: Livro): BookFormData {
  return {
    titulo: livro.titulo ?? '',
    editora: livro.editora ?? '',
    totalExemplares: String(livro.totalExemplares ?? 1),
    quantidadeDisponivel: String(livro.quantidadeDisponivel ?? 1),
    cdd: livro.cdd ?? '',
    localizacao: livro.localizacao ?? '',
    descricao: livro.descricao ?? '',
    urlImg: livro.urlImg ?? '',
    autorId: livro.autor?.id ? String(livro.autor.id) : '',
    generoId: livro.genero?.id ? String(livro.genero.id) : '',
    catalogacaoId: livro.catalogacao?.id ? String(livro.catalogacao.id) : '',
  };
}

  static validate(form: BookFormData): string[] {
    const errors: string[] = [];

    if (!form.titulo.trim()) {
      errors.push('Título é obrigatório');
    }
    if (!form.autorId) {
      errors.push('Selecione um autor');
    }
    if (!form.generoId) {
      errors.push('Selecione um gênero');
    }
    if (!form.catalogacaoId) {
      errors.push('Selecione uma catalogação');
    }

    const total = Number(form.totalExemplares);
    const disp = Number(form.quantidadeDisponivel);

    if (isNaN(total) || total < 0) {
      errors.push('Total de exemplares deve ser um número válido');
    }
    if (isNaN(disp) || disp < 0) {
      errors.push('Quantidade disponível deve ser um número válido');
    }
    if (disp > total) {
      errors.push('Quantidade disponível não pode ser maior que o total');
    }

    return errors;
  }

  static isValidImageUrl(url: string): boolean {
    if (!url || url.trim() === '') return false;
    return (
      url.startsWith('http://') ||
      url.startsWith('https://') ||
      url.startsWith('//')
    );
  }
}