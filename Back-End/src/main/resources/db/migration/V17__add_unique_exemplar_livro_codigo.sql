-- Garante que o codigo do exemplar seja unico dentro de cada livro.
-- (O codigo reinicia em 001 para cada livro, portanto a unicidade e composta.)
ALTER TABLE tb_exemplar
    ADD CONSTRAINT uk_exemplar_livro_codigo UNIQUE (livro_id, codigo);
