package dev.sanderson.Back_End.dto.LivroDtos;

import dev.sanderson.Back_End.entity.Livro;
import lombok.*;

@Getter
@Setter
public class LivroMinDto {
    private Long id;
    private String titulo;
    private String urlImg;

    public static LivroMinDto from(Livro livro) {
        LivroMinDto dto = new LivroMinDto();
        dto.setId(livro.getId());
        dto.setTitulo(livro.getTitulo());
        dto.setUrlImg(livro.getUrlImg());
        return dto;
    }
}
