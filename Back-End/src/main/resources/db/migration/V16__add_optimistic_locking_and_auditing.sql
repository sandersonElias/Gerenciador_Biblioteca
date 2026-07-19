-- V16: Add optimistic locking (@Version) and JPA auditing columns
-- Optimistic locking: version column for entities with race conditions
-- Auditing: created_at and updated_at timestamps for all domain tables

-- ═══════════════════════════════════════════════════════════════
-- OPTIMISTIC LOCKING (@Version)
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE tb_livro ADD COLUMN version BIGINT DEFAULT 0;
ALTER TABLE tb_emprestimo ADD COLUMN version BIGINT DEFAULT 0;
ALTER TABLE tb_reserva ADD COLUMN version BIGINT DEFAULT 0;
ALTER TABLE tb_exemplar ADD COLUMN version BIGINT DEFAULT 0;
ALTER TABLE tb_solicitacao_renovacao ADD COLUMN version BIGINT DEFAULT 0;

-- ═══════════════════════════════════════════════════════════════
-- JPA AUDITING (created_at, updated_at)
-- ═══════════════════════════════════════════════════════════════

-- tb_user
ALTER TABLE tb_user ADD COLUMN created_at TIMESTAMP;
ALTER TABLE tb_user ADD COLUMN updated_at TIMESTAMP;
UPDATE tb_user SET created_at = NOW(), updated_at = NOW();
ALTER TABLE tb_user ALTER COLUMN created_at SET NOT NULL;

-- tb_autor
ALTER TABLE tb_autor ADD COLUMN created_at TIMESTAMP;
ALTER TABLE tb_autor ADD COLUMN updated_at TIMESTAMP;
UPDATE tb_autor SET created_at = NOW(), updated_at = NOW();
ALTER TABLE tb_autor ALTER COLUMN created_at SET NOT NULL;

-- tb_genero
ALTER TABLE tb_genero ADD COLUMN created_at TIMESTAMP;
ALTER TABLE tb_genero ADD COLUMN updated_at TIMESTAMP;
UPDATE tb_genero SET created_at = NOW(), updated_at = NOW();
ALTER TABLE tb_genero ALTER COLUMN created_at SET NOT NULL;

-- tb_catalogacao
ALTER TABLE tb_catalogacao ADD COLUMN created_at TIMESTAMP;
ALTER TABLE tb_catalogacao ADD COLUMN updated_at TIMESTAMP;
UPDATE tb_catalogacao SET created_at = NOW(), updated_at = NOW();
ALTER TABLE tb_catalogacao ALTER COLUMN created_at SET NOT NULL;

-- tb_livro
ALTER TABLE tb_livro ADD COLUMN created_at TIMESTAMP;
ALTER TABLE tb_livro ADD COLUMN updated_at TIMESTAMP;
UPDATE tb_livro SET created_at = NOW(), updated_at = NOW();
ALTER TABLE tb_livro ALTER COLUMN created_at SET NOT NULL;

-- tb_emprestimo
ALTER TABLE tb_emprestimo ADD COLUMN created_at TIMESTAMP;
ALTER TABLE tb_emprestimo ADD COLUMN updated_at TIMESTAMP;
UPDATE tb_emprestimo SET created_at = NOW(), updated_at = NOW();
ALTER TABLE tb_emprestimo ALTER COLUMN created_at SET NOT NULL;

-- tb_reserva
ALTER TABLE tb_reserva ADD COLUMN created_at TIMESTAMP;
ALTER TABLE tb_reserva ADD COLUMN updated_at TIMESTAMP;
UPDATE tb_reserva SET created_at = NOW(), updated_at = NOW();
ALTER TABLE tb_reserva ALTER COLUMN created_at SET NOT NULL;

-- tb_exemplar
ALTER TABLE tb_exemplar ADD COLUMN created_at TIMESTAMP;
ALTER TABLE tb_exemplar ADD COLUMN updated_at TIMESTAMP;
UPDATE tb_exemplar SET created_at = NOW(), updated_at = NOW();
ALTER TABLE tb_exemplar ALTER COLUMN created_at SET NOT NULL;

-- tb_solicitacao_renovacao (already has dataSolicitacao, but add JPA auditing too)
ALTER TABLE tb_solicitacao_renovacao ADD COLUMN created_at TIMESTAMP;
ALTER TABLE tb_solicitacao_renovacao ADD COLUMN updated_at TIMESTAMP;
UPDATE tb_solicitacao_renovacao SET created_at = NOW(), updated_at = NOW();
ALTER TABLE tb_solicitacao_renovacao ALTER COLUMN created_at SET NOT NULL;

-- ═══════════════════════════════════════════════════════════════
-- INDEXES for version column (optimistic locking queries)
-- ═══════════════════════════════════════════════════════════════
-- No explicit indexes needed - version is used by JPA/Hibernate
-- internally during UPDATE ... WHERE version = ? operations