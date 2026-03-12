package dev.sanderson.Back_End.dto.EmprestimoDtos;

import dev.sanderson.Back_End.dto.LivroDtos.LivroMinDto;
import dev.sanderson.Back_End.dto.UserDtos.UserMinDto;

import java.time.LocalDate;

public class EmprestimoResponse {
    private Long id;
    private LocalDate dataEmprestimo;
    private LocalDate dataDevolucao;
    private LocalDate dataDevolvido;
    private Integer renovacoes;
    private String status;
    private LivroMinDto livro;
    private UserMinDto user;
}
