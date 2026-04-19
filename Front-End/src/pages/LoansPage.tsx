import React, { useEffect, useState, useCallback } from 'react';
import { EmprestimoResponse, Livro, StatusEmprestimo, UserResponse } from '../types';
import { emprestimoApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useLoading } from '../context/LoadingContext';
import { userApi, livroApi } from '../services/api';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import './LoansPage.scss';

const LoansPage: React.FC = () => {
  const [loans, setLoans] = useState<EmprestimoResponse[]>([]);
  const [filteredLoans, setFilteredLoans] = useState<EmprestimoResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusEmprestimo | ''>('');
  const [selectedLoan, setSelectedLoan] = useState<EmprestimoResponse | null>(null);
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showNewLoanModal, setShowNewLoanModal] = useState(false);
  const [newLoan, setNewLoan] = useState({ userId: '', livroId: '', dataDevolucao: '' });

  const [userSearch, setUserSearch] = useState('');
  const [bookSearch, setBookSearch] = useState('');

  const [userSuggestions, setUserSuggestions] = useState<UserResponse[]>([]);
  const [bookSuggestions, setBookSuggestions] = useState<Livro[]>([]);
  
  const { showToast } = useToast();
  const { withLoading } = useLoading();

  const loadLoans = useCallback(async () => {
    try {
      const data = await withLoading(emprestimoApi.getAll());
      setLoans(data);
    } catch (error) {
      showToast('Erro ao carregar empréstimos', 'error');
    }
  }, [withLoading, showToast]);

  const filterLoans = useCallback(() => {
    let filtered = loans;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(loan => 
        loan.user.name.toLowerCase().includes(term) ||
        loan.livro.titulo.toLowerCase().includes(term)
      );
    }
    
    if (statusFilter) {
      filtered = filtered.filter(loan => loan.status === statusFilter);
    }
    
    setFilteredLoans(filtered);
  }, [loans, searchTerm, statusFilter]);

  useEffect(() => {
    loadLoans();
  }, [loadLoans]);

  useEffect(() => {
    filterLoans();
  }, [filterLoans]);

  useEffect(() => {
    const delay = setTimeout(async () => {
      try {
        if (userSearch.trim().length >= 3) {
          const users = await userApi.getUserName(userSearch);
          setUserSuggestions(users ?? []);
        } else {
          setUserSuggestions([]);
        }

        if (bookSearch.trim().length >= 3) {
          const books = await livroApi.searchByFilter('titulo', bookSearch);
          setBookSuggestions(books ?? []);
        } else {
          setBookSuggestions([]);
        }

      } catch {
        setUserSuggestions([]);
        setBookSuggestions([]);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [userSearch, bookSearch]); 

  const handleSelectUser = (user: any) => {
    if (!user?.id) {
      console.error('User inválido:', user);
      return;
    }

    setUserSearch(user.name);
    setNewLoan(prev => ({ ...prev, userId: String(user.id) }));
    setUserSuggestions([]);
  };

  const handleSelectBook = (book: any) => {
    if (!book?.id) {
      console.error('Livro inválido:', book);
      return;
    }

    setBookSearch(book.titulo);
    setNewLoan(prev => ({ ...prev, livroId: String(book.id) }));
    setBookSuggestions([]);
  };

  const handleRenew = async () => {
    if (!selectedLoan) return;
    
    try {
      await emprestimoApi.renovar(selectedLoan.id);
      showToast('Empréstimo renovado com sucesso!', 'success');
      setShowRenewModal(false);
      loadLoans();
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Erro ao renovar', 'error');
    }
  };

  const handleReturn = async () => {
    if (!selectedLoan) return;
    
    try {
      await emprestimoApi.devolver(selectedLoan.id);
      showToast('Livro devolvido com sucesso!', 'success');
      setShowReturnModal(false);
      loadLoans();
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Erro ao devolver', 'error');
    }
  };

  const handleNewLoan = async () => {
    if (!newLoan.userId || !newLoan.livroId) {
      showToast('Selecione um usuário e um livro válidos', 'error');
      return;
    }

    try {
      await emprestimoApi.create({
        userId: Number(newLoan.userId),
        livroId: Number(newLoan.livroId),
        dataDevolucao: newLoan.dataDevolucao || undefined,
      });

      showToast('Empréstimo criado com sucesso!', 'success');
      setShowNewLoanModal(false);
      setNewLoan({ userId: '', livroId: '', dataDevolucao: '' });
      setUserSearch('');
      setBookSearch('');
      loadLoans();
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Erro ao criar empréstimo', 'error');
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'ATIVO': return 'status-active';
      case 'ATRASADO': return 'status-overdue';
      case 'DEVOLVIDO': return 'status-returned';
      default: return '';
    }
  };

  return (
    <div className="loans-page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1>Gerenciamento de Empréstimos</h1>
            <p>Gerencie empréstimos, renovações e devoluções</p>
          </div>
          <Button variant="primary" onClick={() => setShowNewLoanModal(true)}>
            + Novo Empréstimo
          </Button>
        </div>

        <div className="filters-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Buscar por usuário ou livro..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value as StatusEmprestimo)}
            className="status-filter"
          >
            <option value="">Todos os status</option>
            <option value="ATIVO">Ativo</option>
            <option value="ATRASADO">Atrasado</option>
            <option value="DEVOLVIDO">Devolvido</option>
          </select>
        </div>

        <div className="loans-table-container">
          <table className="loans-table">
            <thead>
              <tr>
                <th>Livro</th>
                <th>Usuário</th>
                <th>Data Empréstimo</th>
                <th>Data Devolução</th>
                <th>Renovações</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredLoans.map(loan => (
                <tr key={loan.id}>
                  <td className="book-cell">
                    <strong>{loan.livro.titulo}</strong>
                  </td>
                  <td>{loan.user.name}</td>
                  <td>{new Date(loan.dataEmprestimo).toLocaleDateString('pt-BR')}</td>
                  <td>{new Date(loan.dataDevolucao).toLocaleDateString('pt-BR')}</td>
                  <td>{loan.renovacoes}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(loan.status)}`}>
                      {loan.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {loan.status !== 'DEVOLVIDO' && (
                        <>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              setSelectedLoan(loan);
                              setShowRenewModal(true);
                            }}
                          >
                            Renovar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedLoan(loan);
                              setShowReturnModal(true);
                            }}
                          >
                            Devolver
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredLoans.length === 0 && (
            <div className="empty-state">
              <p>Nenhum empréstimo encontrado</p>
            </div>
          )}
        </div>
      </div>

      {/* Renew Modal */}
      <Modal
        isOpen={showRenewModal}
        onClose={() => setShowRenewModal(false)}
        title="Renovar Empréstimo"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowRenewModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleRenew}>
              Confirmar Renovação
            </Button>
          </>
        }
      >
        <p>Tem certeza que deseja renovar o empréstimo de:</p>
        <strong>{selectedLoan?.livro.titulo}</strong>
        <p>Usuário: {selectedLoan?.user.name}</p>
        <p className="modal-note">A data de devolução será estendida em 7 dias.</p>
      </Modal>

      {/* Return Modal */}
      <Modal
        isOpen={showReturnModal}
        onClose={() => setShowReturnModal(false)}
        title="Registrar Devolução"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowReturnModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleReturn}>
              Confirmar Devolução
            </Button>
          </>
        }
      >
        <p>Confirmar devolução do livro:</p>
        <strong>{selectedLoan?.livro.titulo}</strong>
        <p>Emprestado para: {selectedLoan?.user.name}</p>
      </Modal>

      {/* New Loan Modal */}
      <Modal
        isOpen={showNewLoanModal}
        onClose={() => setShowNewLoanModal(false)}
        title="Novo Empréstimo"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowNewLoanModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleNewLoan}>
              Criar Empréstimo
            </Button>
          </>
        }
      >
        <div className="form-group autocomplete">
          <Input
            label="Nome do Usuário"
            type="text"
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            placeholder="Digite o nome do usuário"
          />

          {userSuggestions.length > 0 && (
            <ul className="autocomplete-list">
              {userSuggestions.map((u) => (
                <li key={u.id} onClick={() => handleSelectUser(u)}>
                  {u.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="form-group autocomplete">
          <Input
            label="Título do Livro"
            type="text"
            value={bookSearch}
            onChange={(e) => setBookSearch(e.target.value)}
            placeholder="Digite o título do livro"
          />

          {bookSuggestions.length > 0 && (
            <ul className="autocomplete-list">
              {bookSuggestions.map((b) => (
                <li key={b.id} onClick={() => handleSelectBook(b)}>
                  {b.titulo}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="form-group">
          <Input
            label="Data de Devolução (opcional)"
            type="date"
            value={newLoan.dataDevolucao}
            onChange={(e) =>
              setNewLoan({ ...newLoan, dataDevolucao: e.target.value })
            }
          />
        </div>
      </Modal>
    </div>
  );
};

export default LoansPage;