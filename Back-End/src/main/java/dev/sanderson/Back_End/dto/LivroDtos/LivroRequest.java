package dev.sanderson.Back_End.dto.LivroDtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LivroRequest{

    private Long id;
    private String titulo;
    private String editora;
    private Integer totalExemplares;
    private Integer quantidadeDisponivel;
    private String cdd;
    private String localizacao;
    private String descricao;
    private String urlImg;
    private Integer contadorEmprestimos;
    private Long autorId;
    private Long generoId;
    private Long catalogacaoId;
}
