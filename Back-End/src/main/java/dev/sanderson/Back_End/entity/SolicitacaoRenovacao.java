package dev.sanderson.Back_End.entity;

import dev.sanderson.Back_End.entity.type.StatusSolicitacao;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@EntityListeners(AuditingEntityListener.class)
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

    @Version
    private Long version;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

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