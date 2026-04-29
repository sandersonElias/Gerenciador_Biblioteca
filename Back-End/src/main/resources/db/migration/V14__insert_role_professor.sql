-- ═══════════════════════════════════════════════════════════════════
-- V14: Adiciona role de Professor
-- ═══════════════════════════════════════════════════════════════════
-- Cria a role ROLE_PROFESSOR para professores que utilizam a biblioteca.
-- Professores têm permissões de leitura (igual aluno) + limite maior
-- de empréstimos simultâneos (configurado em application.properties).
-- ═══════════════════════════════════════════════════════════════════

INSERT INTO tb_roles (role) VALUES ('ROLE_PROFESSOR');