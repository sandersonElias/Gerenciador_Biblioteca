package dev.sanderson.Back_End.dto.LivroDtos;

import dev.sanderson.Back_End.dto.AutorDtos.AutorMinDto;
import dev.sanderson.Back_End.dto.CatalogacaoDtos.CatalogacaoMinDto;
import dev.sanderson.Back_End.dto.GeneroDtos.GeneroMinDto;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LivroResponse{

    private Long id;
    private String titulo;
    private String editora;
    private Integer totalExemplares;
    private  Integer quantidadeDisponivel;
    private String cdd;
    private String localizacao;
    private String descricao;
    private String urlImg;
    private Integer contadorEmprestimos;
    private AutorMinDto autor;
    private GeneroMinDto genero;
    private CatalogacaoMinDto catalogacao;
}
