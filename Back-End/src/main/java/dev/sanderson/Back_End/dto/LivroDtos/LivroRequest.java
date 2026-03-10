package dev.sanderson.Back_End.dto.LivroDtos;

import lombok.Getter;

@Getter
public class LivroRequest{

    private String titulo;
    private String editora;
    private Integer totalExemplares;
    private String cdd;
    private String localizacao;
    private String descricao;
    private String urlImg;
    private Integer contadorEmprestimos;
    private String autor;
    private String genero;
    private String catalogacao;
}
