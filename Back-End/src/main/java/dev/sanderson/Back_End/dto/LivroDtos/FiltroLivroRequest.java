package dev.sanderson.Back_End.dto.LivroDtos;

import lombok.Data;

@Data
public class FiltroLivroRequest {
    private String titulo;
    private Long generoId;
    private Long autorId;
    private Long catalogacaoId;
    private Boolean disponivel;
    private Integer pagina;
    private Integer tamanhoPagina;
}