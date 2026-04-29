-- ═══════════════════════════════════════════════════════════════════
-- V13: Suporte a cadastro em lote de alunos e troca de senha obrigatória
-- ═══════════════════════════════════════════════════════════════════
-- Adiciona em tb_user:
--   • matricula      → ID do aluno na SEE-MG (único, nullable)
--   • senha_alterada → flag de primeiro acesso (default false)
--
-- Para usuários já cadastrados (admins/funcionários), marca
-- senha_alterada = TRUE para que NÃO sejam forçados a trocar a senha.
-- ═══════════════════════════════════════════════════════════════════

ALTER TABLE tb_user
    ADD COLUMN matricula VARCHAR(20);

ALTER TABLE tb_user
    ADD CONSTRAINT uk_tb_user_matricula UNIQUE (matricula);

CREATE INDEX idx_tb_user_matricula ON tb_user (matricula);

ALTER TABLE tb_user
    ADD COLUMN senha_alterada BOOLEAN NOT NULL DEFAULT FALSE;

UPDATE tb_user SET senha_alterada = TRUE;