CREATE TABLE tb_aluno (
    id BIGINT PRIMARY KEY,
    sala VARCHAR(50),
    ano INTEGER,

    CONSTRAINT fk_aluno_user
        FOREIGN KEY (id)
        REFERENCES tb_user(id)
        ON DELETE CASCADE
);