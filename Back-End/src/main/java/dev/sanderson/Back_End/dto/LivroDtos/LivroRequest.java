package dev.sanderson.Back_End.dto.LivroDtos;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LivroRequest{

    private Long id;

    @NotBlank(message = "Titulo e obrigatorio")
    private String titulo;

    private String editora;

    @NotNull(message = "Total de exemplares e obrigatorio")
    @Min(value = 0, message = "Total de exemplares nao pode ser negativo")
    private Integer totalExemplares;

    private Integer quantidadeDisponivel;
    private String cdd;
    private String localizacao;
    private String descricao;
    private String urlImg;
    private Integer contadorEmprestimos;

    @NotNull(message = "Autor e obrigatorio")
    private Long autorId;

    @NotNull(message = "Genero e obrigatorio")
    private Long generoId;

    @NotNull(message = "Catalogacao e obrigatoria")
    private Long catalogacaoId;
}