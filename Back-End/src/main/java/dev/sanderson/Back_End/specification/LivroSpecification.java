package dev.sanderson.Back_End.specification;

import dev.sanderson.Back_End.dto.LivroDtos.FiltroLivroRequest;
import dev.sanderson.Back_End.entity.Livro;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class LivroSpecification implements Specification<Livro> {

    private final FiltroLivroRequest filtros;

    public LivroSpecification(FiltroLivroRequest filtros) {
        this.filtros = filtros;
    }

    @Override
    public Predicate toPredicate(Root<Livro> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
        List<Predicate> predicates = new ArrayList<>();

        if (filtros.getTitulo() != null && !filtros.getTitulo().isBlank()) {
            predicates.add(cb.like(cb.lower(root.get("titulo")), "%" + filtros.getTitulo().toLowerCase() + "%"));
        }

        if (filtros.getGeneroId() != null) {
            predicates.add(cb.equal(root.get("genero").get("id"), filtros.getGeneroId()));
        }

        if (filtros.getAutorId() != null) {
            predicates.add(cb.equal(root.get("autor").get("id"), filtros.getAutorId()));
        }

        if (filtros.getCatalogacaoId() != null) {
            predicates.add(cb.equal(root.get("catalogacao").get("id"), filtros.getCatalogacaoId()));
        }

        if (filtros.getDisponivel() != null && filtros.getDisponivel()) {
            predicates.add(cb.greaterThan(root.get("quantidadeDisponivel"), 0));
        }

        return cb.and(predicates.toArray(new Predicate[0]));
    }
}