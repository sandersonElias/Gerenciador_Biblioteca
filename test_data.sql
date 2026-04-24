-- ============================================================
--  Script de dados de teste — Biblioteca Monsa
--  Execute no pgAdmin ou psql APÓS o servidor subir
--  (o Flyway precisa ter rodado todas as migrations antes)
--
--  Senha de todos os usuários: Senha123
--  O hash é gerado pelo pgcrypto (mesmo algoritmo do Spring BCrypt)
-- ============================================================

-- Habilita a extensão pgcrypto (necessária para gerar hash bcrypt)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE

  -- ── Roles (já existem, apenas capturamos os IDs) ─────────
  role_admin       BIGINT;
  role_funcionario BIGINT;
  role_aluno       BIGINT;

  -- ── Autores ───────────────────────────────────────────────
  autor_rowling BIGINT;
  autor_machado BIGINT;
  autor_orwell  BIGINT;
  autor_marquez BIGINT;
  autor_saraiva BIGINT;

  -- ── Gêneros ───────────────────────────────────────────────
  genero_fantasia   BIGINT;
  genero_romance    BIGINT;
  genero_distopia   BIGINT;
  genero_magico     BIGINT;
  genero_aventura   BIGINT;

  -- ── Catalogações ──────────────────────────────────────────
  cat_estrangeira BIGINT;
  cat_brasileira  BIGINT;
  cat_ficcao      BIGINT;

  -- ── Livros ────────────────────────────────────────────────
  livro_hp     BIGINT;  -- Harry Potter    (3 ex: 1 emprestado, 2 disponíveis)
  livro_dc     BIGINT;  -- Dom Casmurro    (2 ex: 1 emprestado, 1 disponível)
  livro_1984   BIGINT;  -- 1984            (2 ex: todos disponíveis)
  livro_cem    BIGINT;  -- Cem Anos        (1 ex: 1 emprestado)
  livro_alq    BIGINT;  -- O Alquimista    (3 ex: todos disponíveis)

  -- ── Exemplares ────────────────────────────────────────────
  ex_hp_001   BIGINT;   -- EMPRESTADO
  ex_hp_002   BIGINT;   -- DISPONIVEL
  ex_hp_003   BIGINT;   -- DISPONIVEL
  ex_dc_001   BIGINT;   -- EMPRESTADO
  ex_dc_002   BIGINT;   -- DISPONIVEL
  ex_1984_001 BIGINT;   -- DISPONIVEL
  ex_1984_002 BIGINT;   -- DISPONIVEL
  ex_cem_001  BIGINT;   -- EMPRESTADO
  ex_alq_001  BIGINT;   -- DISPONIVEL
  ex_alq_002  BIGINT;   -- DISPONIVEL
  ex_alq_003  BIGINT;   -- DISPONIVEL

  -- ── Usuários ──────────────────────────────────────────────
  user_admin   BIGINT;
  user_func    BIGINT;
  user_maria   BIGINT;
  user_pedro   BIGINT;
  user_ana     BIGINT;

  -- ── Empréstimos ───────────────────────────────────────────
  emp_hp    BIGINT;  -- Maria  → Harry Potter 001 (ATIVO)
  emp_dc    BIGINT;  -- Pedro  → Dom Casmurro 001 (ATRASADO)
  emp_cem   BIGINT;  -- Ana    → Cem Anos 001     (ATIVO)

  -- Hash gerado pelo pgcrypto com bcrypt 10 rounds — mesmo algoritmo do Spring BCryptPasswordEncoder
  hash_senha TEXT;

BEGIN

  -- ══════════════════════════════════════════════════════════
  --  0. GERAR HASH DA SENHA  (bcrypt 10 rounds via pgcrypto)
  --     Senha em texto claro: Senha123
  -- ══════════════════════════════════════════════════════════
  hash_senha := crypt('Senha123', gen_salt('bf', 10));

  -- ══════════════════════════════════════════════════════════
  --  1. ROLES  (já inseridas pela V7, só buscamos os IDs)
  -- ══════════════════════════════════════════════════════════
  SELECT id INTO role_admin       FROM tb_roles WHERE role = 'ROLE_ADMIN';
  SELECT id INTO role_funcionario FROM tb_roles WHERE role = 'ROLE_FUNCIONARIO';
  SELECT id INTO role_aluno       FROM tb_roles WHERE role = 'ROLE_ALUNO';

  -- ══════════════════════════════════════════════════════════
  --  2. AUTORES
  -- ══════════════════════════════════════════════════════════
  INSERT INTO tb_autor (autor) VALUES ('J.K. Rowling')           RETURNING id INTO autor_rowling;
  INSERT INTO tb_autor (autor) VALUES ('Machado de Assis')       RETURNING id INTO autor_machado;
  INSERT INTO tb_autor (autor) VALUES ('George Orwell')          RETURNING id INTO autor_orwell;
  INSERT INTO tb_autor (autor) VALUES ('Gabriel García Márquez') RETURNING id INTO autor_marquez;
  INSERT INTO tb_autor (autor) VALUES ('Paulo Coelho')           RETURNING id INTO autor_saraiva;

  -- ══════════════════════════════════════════════════════════
  --  3. GÊNEROS
  -- ══════════════════════════════════════════════════════════
  INSERT INTO tb_genero (genero) VALUES ('Fantasia')        RETURNING id INTO genero_fantasia;
  INSERT INTO tb_genero (genero) VALUES ('Romance')         RETURNING id INTO genero_romance;
  INSERT INTO tb_genero (genero) VALUES ('Distopia')        RETURNING id INTO genero_distopia;
  INSERT INTO tb_genero (genero) VALUES ('Realismo Mágico') RETURNING id INTO genero_magico;
  INSERT INTO tb_genero (genero) VALUES ('Aventura')        RETURNING id INTO genero_aventura;

  -- ══════════════════════════════════════════════════════════
  --  4. CATALOGAÇÕES
  -- ══════════════════════════════════════════════════════════
  INSERT INTO tb_catalogacao (catalogacao) VALUES ('Literatura Estrangeira') RETURNING id INTO cat_estrangeira;
  INSERT INTO tb_catalogacao (catalogacao) VALUES ('Literatura Brasileira')  RETURNING id INTO cat_brasileira;
  INSERT INTO tb_catalogacao (catalogacao) VALUES ('Ficção Científica')      RETURNING id INTO cat_ficcao;

  

  -- ══════════════════════════════════════════════════════════
  --  5. LIVROS
  -- ══════════════════════════════════════════════════════════
  -- HP: 3 exemplares, 2 disponíveis (1 emprestado para Maria)
  INSERT INTO tb_livro (titulo, editora, total_exemplares, quantidade_disponivel,
                        cdd, localizacao, descricao, url_img, contador_emprestimos,
                        genero_id, catalogacao_id, autor_id)
  VALUES ('Harry Potter e a Pedra Filosofal', 'Rocco', 3, 2,
          '823.914', 'Prateleira A1',
          'O início da saga do menino bruxo que descobre seu destino em Hogwarts.',
          'https://m.media-amazon.com/images/I/51UoqRAxwEL._SY445_SX342_.jpg',
          5, genero_fantasia, cat_estrangeira, autor_rowling)
  RETURNING id INTO livro_hp;

  -- Dom Casmurro: 2 exemplares, 1 disponível (1 emprestado para Pedro — ATRASADO)
  INSERT INTO tb_livro (titulo, editora, total_exemplares, quantidade_disponivel,
                        cdd, localizacao, descricao, url_img, contador_emprestimos,
                        genero_id, catalogacao_id, autor_id)
  VALUES ('Dom Casmurro', 'Ática', 2, 1,
          '869.3', 'Prateleira B2',
          'Bentinho, o Dom Casmurro, narra a sua vida e o eterno enigma de Capitu.',
          'https://m.media-amazon.com/images/I/614wO8sAqJL._SY445_SX342_.jpg',
          3, genero_romance, cat_brasileira, autor_machado)
  RETURNING id INTO livro_dc;

  -- 1984: 2 exemplares, todos disponíveis
  INSERT INTO tb_livro (titulo, editora, total_exemplares, quantidade_disponivel,
                        cdd, localizacao, descricao, url_img, contador_emprestimos,
                        genero_id, catalogacao_id, autor_id)
  VALUES ('1984', 'Companhia das Letras', 2, 2,
          '823.912', 'Prateleira A3',
          'Em um futuro distópico, o Partido controla tudo — inclusive a verdade.',
          'https://m.media-amazon.com/images/I/41aM4xOZxaL._SY445_SX342_.jpg',
          7, genero_distopia, cat_ficcao, autor_orwell)
  RETURNING id INTO livro_1984;

  -- Cem Anos de Solidão: 1 exemplar, 0 disponíveis (emprestado para Ana)
  INSERT INTO tb_livro (titulo, editora, total_exemplares, quantidade_disponivel,
                        cdd, localizacao, descricao, url_img, contador_emprestimos,
                        genero_id, catalogacao_id, autor_id)
  VALUES ('Cem Anos de Solidão', 'Record', 1, 0,
          '863', 'Prateleira C1',
          'A saga da família Buendía em Macondo, obra-prima do realismo mágico latino-americano.',
          'https://m.media-amazon.com/images/I/51MqXA9bxYL._SY445_SX342_.jpg',
          2, genero_magico, cat_estrangeira, autor_marquez)
  RETURNING id INTO livro_cem;

  -- O Alquimista: 3 exemplares, todos disponíveis
  INSERT INTO tb_livro (titulo, editora, total_exemplares, quantidade_disponivel,
                        cdd, localizacao, descricao, url_img, contador_emprestimos,
                        genero_id, catalogacao_id, autor_id)
  VALUES ('O Alquimista', 'HarperCollins', 3, 3,
          '869.3', 'Prateleira D2',
          'Um jovem pastor andaluz parte em busca de seu tesouro e descobre o segredo da vida.',
          'https://m.media-amazon.com/images/I/51z0eBxbmjL._SY445_SX342_.jpg',
          1, genero_aventura, cat_estrangeira, autor_saraiva)
  RETURNING id INTO livro_alq;

  -- ══════════════════════════════════════════════════════════
  --  6. EXEMPLARES (manualmente pois o LivroService não foi
  --     chamado — este é um insert direto no banco)
  -- ══════════════════════════════════════════════════════════

  -- Harry Potter
  INSERT INTO tb_exemplar (codigo, status, livro_id) VALUES ('001', 'EMPRESTADO', livro_hp)  RETURNING id INTO ex_hp_001;
  INSERT INTO tb_exemplar (codigo, status, livro_id) VALUES ('002', 'DISPONIVEL', livro_hp)  RETURNING id INTO ex_hp_002;
  INSERT INTO tb_exemplar (codigo, status, livro_id) VALUES ('003', 'DISPONIVEL', livro_hp)  RETURNING id INTO ex_hp_003;

  -- Dom Casmurro
  INSERT INTO tb_exemplar (codigo, status, livro_id) VALUES ('001', 'EMPRESTADO', livro_dc)  RETURNING id INTO ex_dc_001;
  INSERT INTO tb_exemplar (codigo, status, livro_id) VALUES ('002', 'DISPONIVEL', livro_dc)  RETURNING id INTO ex_dc_002;

  -- 1984
  INSERT INTO tb_exemplar (codigo, status, livro_id) VALUES ('001', 'DISPONIVEL', livro_1984) RETURNING id INTO ex_1984_001;
  INSERT INTO tb_exemplar (codigo, status, livro_id) VALUES ('002', 'DISPONIVEL', livro_1984) RETURNING id INTO ex_1984_002;

  -- Cem Anos de Solidão
  INSERT INTO tb_exemplar (codigo, status, livro_id) VALUES ('001', 'EMPRESTADO', livro_cem) RETURNING id INTO ex_cem_001;

  -- O Alquimista
  INSERT INTO tb_exemplar (codigo, status, livro_id) VALUES ('001', 'DISPONIVEL', livro_alq) RETURNING id INTO ex_alq_001;
  INSERT INTO tb_exemplar (codigo, status, livro_id) VALUES ('002', 'DISPONIVEL', livro_alq) RETURNING id INTO ex_alq_002;
  INSERT INTO tb_exemplar (codigo, status, livro_id) VALUES ('003', 'DISPONIVEL', livro_alq) RETURNING id INTO ex_alq_003;

  -- ══════════════════════════════════════════════════════════
  --  7. USUÁRIOS
  --  Senha de todos: Senha123
  -- ══════════════════════════════════════════════════════════

  -- Admin
  INSERT INTO tb_user (name, email, password, role_id)
  VALUES ('Administrador', 'admin@biblioteca.com', hash_senha, role_admin)
  RETURNING id INTO user_admin;

  -- Funcionário
  INSERT INTO tb_user (name, email, password, role_id)
  VALUES ('João Funcionário', 'joao@biblioteca.com', hash_senha, role_funcionario)
  RETURNING id INTO user_func;

  -- Alunos (tb_user + tb_aluno)
  INSERT INTO tb_user (name, email, password, role_id)
  VALUES ('Maria Oliveira', 'maria@escola.com', hash_senha, role_aluno)
  RETURNING id INTO user_maria;
  INSERT INTO tb_aluno (id, sala, ano) VALUES (user_maria, '9A', 2025);

  INSERT INTO tb_user (name, email, password, role_id)
  VALUES ('Pedro Santos', 'pedro@escola.com', hash_senha, role_aluno)
  RETURNING id INTO user_pedro;
  INSERT INTO tb_aluno (id, sala, ano) VALUES (user_pedro, '8B', 2025);

  INSERT INTO tb_user (name, email, password, role_id)
  VALUES ('Ana Costa', 'ana@escola.com', hash_senha, role_aluno)
  RETURNING id INTO user_ana;
  INSERT INTO tb_aluno (id, sala, ano) VALUES (user_ana, '7C', 2025);

  -- ══════════════════════════════════════════════════════════
  --  8. EMPRÉSTIMOS
  -- ══════════════════════════════════════════════════════════

  -- Maria → Harry Potter 001 (ATIVO, dentro do prazo)
  INSERT INTO tb_emprestimo (data_emprestimo, data_devolucao, renovacoes, status, user_id, livro_id, exemplar_id)
  VALUES (CURRENT_DATE - 3, CURRENT_DATE + 4, 0, 'ATIVO', user_maria, livro_hp, ex_hp_001)
  RETURNING id INTO emp_hp;

  -- Pedro → Dom Casmurro 001 (ATRASADO — data vencida há 5 dias)
  INSERT INTO tb_emprestimo (data_emprestimo, data_devolucao, renovacoes, status, user_id, livro_id, exemplar_id)
  VALUES (CURRENT_DATE - 15, CURRENT_DATE - 5, 1, 'ATRASADO', user_pedro, livro_dc, ex_dc_001)
  RETURNING id INTO emp_dc;

  -- Ana → Cem Anos de Solidão 001 (ATIVO, dentro do prazo)
  INSERT INTO tb_emprestimo (data_emprestimo, data_devolucao, renovacoes, status, user_id, livro_id, exemplar_id)
  VALUES (CURRENT_DATE - 1, CURRENT_DATE + 6, 0, 'ATIVO', user_ana, livro_cem, ex_cem_001)
  RETURNING id INTO emp_cem;

  -- Maria → 1984 (DEVOLVIDO — histórico)
  INSERT INTO tb_emprestimo (data_emprestimo, data_devolucao, data_devolvido, renovacoes, status, user_id, livro_id, exemplar_id)
  VALUES (CURRENT_DATE - 30, CURRENT_DATE - 23, CURRENT_DATE - 24, 0, 'DEVOLVIDO', user_maria, livro_1984, ex_1984_001);

  -- Pedro → O Alquimista (DEVOLVIDO — histórico)
  INSERT INTO tb_emprestimo (data_emprestimo, data_devolucao, data_devolvido, renovacoes, status, user_id, livro_id, exemplar_id)
  VALUES (CURRENT_DATE - 20, CURRENT_DATE - 13, CURRENT_DATE - 14, 2, 'DEVOLVIDO', user_pedro, livro_alq, ex_alq_001);

  -- ══════════════════════════════════════════════════════════
  --  9. RESERVAS
  -- ══════════════════════════════════════════════════════════

  -- Pedro reservou Cem Anos de Solidão (único exemplar emprestado → fila ATIVA)
  INSERT INTO tb_reserva (data_reserva, status, user_id, livro_id)
  VALUES (CURRENT_DATE - 1, 'ATIVA', user_pedro, livro_cem);

  -- Ana reservou Harry Potter (CONCLUÍDA — já retirou)
  INSERT INTO tb_reserva (data_reserva, data_disponivel, status, user_id, livro_id)
  VALUES (CURRENT_DATE - 10, CURRENT_DATE - 8, 'CONCLUIDA', user_ana, livro_hp);

  -- Maria reservou Dom Casmurro — DISPONIVEL (esperando retirada, expira amanhã)
  INSERT INTO tb_reserva (data_reserva, data_expiracao, status, user_id, livro_id)
  VALUES (CURRENT_DATE - 2, CURRENT_DATE + 1, 'DISPONIVEL', user_maria, livro_dc);

  -- ══════════════════════════════════════════════════════════
  --  10. SOLICITAÇÕES DE RENOVAÇÃO
  -- ══════════════════════════════════════════════════════════

  -- Maria solicitou renovação do HP (PENDENTE — espera aprovação do funcionário)
  INSERT INTO tb_solicitacao_renovacao (emprestimo_id, solicitante_id, data_solicitacao, status)
  VALUES (emp_hp, user_maria, NOW() - INTERVAL '2 hours', 'PENDENTE');

  -- Pedro tinha solicitado renovação do DC → foi REJEITADA (livro atrasado)
  INSERT INTO tb_solicitacao_renovacao (emprestimo_id, solicitante_id, data_solicitacao,
                                        data_resposta, status, observacao, funcionario_id)
  VALUES (emp_dc, user_pedro, NOW() - INTERVAL '3 days',
          NOW() - INTERVAL '2 days', 'REJEITADA',
          'Empréstimo já está atrasado. Realize a devolução antes de renovar.',
          user_func);

  RAISE NOTICE '==============================================';
  RAISE NOTICE 'Dados inseridos com sucesso!';
  RAISE NOTICE '----------------------------------------------';
  RAISE NOTICE 'USUÁRIOS (senha: Senha123)';
  RAISE NOTICE '  admin@biblioteca.com   → ADMIN';
  RAISE NOTICE '  joao@biblioteca.com    → FUNCIONÁRIO';
  RAISE NOTICE '  maria@escola.com       → ALUNO (sala 9A)';
  RAISE NOTICE '  pedro@escola.com       → ALUNO (sala 8B)';
  RAISE NOTICE '  ana@escola.com         → ALUNO (sala 7C)';
  RAISE NOTICE '----------------------------------------------';
  RAISE NOTICE 'LIVROS (5 cadastrados)';
  RAISE NOTICE '  Harry Potter     → 3 exemplares (001 emprestado p/ Maria)';
  RAISE NOTICE '  Dom Casmurro     → 2 exemplares (001 emprestado p/ Pedro - ATRASADO)';
  RAISE NOTICE '  1984             → 2 exemplares (todos disponíveis)';
  RAISE NOTICE '  Cem Anos         → 1 exemplar  (001 emprestado p/ Ana)';
  RAISE NOTICE '  O Alquimista     → 3 exemplares (todos disponíveis)';
  RAISE NOTICE '----------------------------------------------';
  RAISE NOTICE 'RESERVAS';
  RAISE NOTICE '  Pedro  → Cem Anos de Solidão (ATIVA — fila)';
  RAISE NOTICE '  Maria  → Dom Casmurro (DISPONIVEL — expira amanhã)';
  RAISE NOTICE '  Ana    → Harry Potter (CONCLUÍDA)';
  RAISE NOTICE '----------------------------------------------';
  RAISE NOTICE 'SOLICITAÇÕES';
  RAISE NOTICE '  Maria  → renovação de HP (PENDENTE)';
  RAISE NOTICE '  Pedro  → renovação de DC (REJEITADA — atrasado)';
  RAISE NOTICE '==============================================';

END $$;
