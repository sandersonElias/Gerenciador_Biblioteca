CREATE TABLE tb_solicitacao_renovacao (
    id BIGSERIAL PRIMARY KEY,
    emprestimo_id BIGINT NOT NULL,
    solicitante_id BIGINT NOT NULL,
    data_solicitacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_resposta TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDENTE',
    observacao TEXT,
    funcionario_id BIGINT,

    CONSTRAINT fk_solicitacao_emprestimo
        FOREIGN KEY (emprestimo_id) REFERENCES tb_emprestimo(id),
    CONSTRAINT fk_solicitacao_solicitante
        FOREIGN KEY (solicitante_id) REFERENCES tb_user(id),
    CONSTRAINT fk_solicitacao_funcionario
        FOREIGN KEY (funcionario_id) REFERENCES tb_user(id),
    CONSTRAINT chk_status_solicitacao
        CHECK (status IN ('PENDENTE', 'APROVADA', 'REJEITADA'))
);

-- Índices para performance
CREATE INDEX idx_solicitacao_status ON tb_solicitacao_renovacao(status);
CREATE INDEX idx_solicitacao_emprestimo ON tb_solicitacao_renovacao(emprestimo_id);
CREATE INDEX idx_solicitacao_solicitante ON tb_solicitacao_renovacao(solicitante_id);
