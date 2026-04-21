package dev.sanderson.Back_End.repository;

import dev.sanderson.Back_End.entity.SolicitacaoRenovacao;
import dev.sanderson.Back_End.entity.type.StatusSolicitacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SolicitacaoRenovacaoRepository extends JpaRepository<SolicitacaoRenovacao, Long> {

    List<SolicitacaoRenovacao> findByStatusOrderByDataSolicitacaoAsc(StatusSolicitacao status);

    boolean existsByEmprestimoIdAndStatus(Long emprestimoId, StatusSolicitacao status);
}
