package dev.sanderson.Back_End.entity;

import dev.sanderson.Back_End.entity.type.StatusSolicitacao;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "tb_solicitacao_renovacao")
public class SolicitacaoRenovacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "emprestimo_id", nullable = false)
    private Emprestimo emprestimo;

    @ManyToOne
    @JoinColumn(name = "solicitante_id", nullable = false)
    private User solicitante;

    private LocalDateTime dataSolicitacao;

    private LocalDateTime dataResposta;

    @Enumerated(EnumType.STRING)
    private StatusSolicitacao status;

    private String observacao;

    @ManyToOne
    @JoinColumn(name = "funcionario_id")
    private User funcionarioResponsavel;

    @PrePersist
    public void prePersist() {
        if (dataSolicitacao == null) {
            dataSolicitacao = LocalDateTime.now();
        }
        if (status == null) {
            status = StatusSolicitacao.PENDENTE;
        }
    }

    @PreUpdate
    public void preUpdate() {
        if (status == StatusSolicitacao.APROVADA || status == StatusSolicitacao.REJEITADA) {
            if (dataResposta == null) {
                dataResposta = LocalDateTime.now();
            }
        }
    }
}
