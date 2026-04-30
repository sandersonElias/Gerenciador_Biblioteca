-- ═══════════════════════════════════════════════════════════════════
-- V15: Adiciona índices para otimização de queries
-- ═══════════════════════════════════════════════════════════════════
-- Índices estratégicos baseados nas queries mais comuns do sistema:
-- 1. Buscas por título de livro
-- 2. Filtros de empréstimos por status e data
-- 3. Consultas de "meus empréstimos" e "minhas reservas"
--
-- Impacto esperado: 10-100x mais rápidas nas queries indexadas
-- ═══════════════════════════════════════════════════════════════════

-- ── tb_livro ──────────────────────────────────────────────────────
-- Busca por título (GET /livro/buscar/titulo/...)
-- Sem índice: O(n) - escaneia todos os livros
-- Com índice: O(log n) - busca binária
CREATE INDEX idx_livro_titulo ON tb_livro (titulo);

-- Busca por autor (GET /livro/buscar/autor/...)
-- FK autor_id já tem constraint, mas índice explícito ajuda em JOINs
CREATE INDEX idx_livro_autor_id ON tb_livro (autor_id);

-- Busca por gênero (GET /livro/buscar/genero/...)
CREATE INDEX idx_livro_genero_id ON tb_livro (genero_id);

-- ── tb_emprestimo ─────────────────────────────────────────────────
-- Filtro por status (GET /emprestimo?status=ATIVO)
-- Query: SELECT * FROM tb_emprestimo WHERE status = 'ATIVO'
CREATE INDEX idx_emprestimo_status ON tb_emprestimo (status);

-- Ordenação por data de devolução (empréstimos vencendo)
-- Query: SELECT * FROM tb_emprestimo WHERE status = 'ATIVO' ORDER BY data_devolucao
CREATE INDEX idx_emprestimo_data_devolucao ON tb_emprestimo (data_devolucao);

-- "Meus empréstimos" (GET /emprestimo/meus/:email)
-- Query: SELECT * FROM tb_emprestimo WHERE user_id = ?
CREATE INDEX idx_emprestimo_user_id ON tb_emprestimo (user_id);

-- Índice composto para query comum: empréstimos ativos de um usuário
-- Query: SELECT * FROM tb_emprestimo WHERE user_id = ? AND status IN ('ATIVO', 'ATRASADO')
CREATE INDEX idx_emprestimo_user_status ON tb_emprestimo (user_id, status);

-- ── tb_reserva ────────────────────────────────────────────────────
-- "Minhas reservas" (GET /reserva/email/:email)
-- Query: SELECT * FROM tb_reserva WHERE user_id = ?
CREATE INDEX idx_reserva_user_id ON tb_reserva (user_id);

-- Filtro por status (reservas ativas, disponíveis, etc.)
-- Query: SELECT * FROM tb_reserva WHERE status = 'ATIVA'
CREATE INDEX idx_reserva_status ON tb_reserva (status);

-- Reservas de um livro específico (BookDetailPage)
-- Query: SELECT * FROM tb_reserva WHERE livro_id = ?
CREATE INDEX idx_reserva_livro_id ON tb_reserva (livro_id);

-- ── tb_aluno ──────────────────────────────────────────────────────
-- Busca por sala/ano (relatórios)
-- Query: SELECT * FROM tb_aluno WHERE sala = '3A' AND ano = 2024
CREATE INDEX idx_aluno_sala_ano ON tb_aluno (sala, ano);