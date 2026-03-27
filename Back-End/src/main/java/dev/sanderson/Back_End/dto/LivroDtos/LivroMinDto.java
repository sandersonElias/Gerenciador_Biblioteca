package dev.sanderson.Back_End.dto.LivroDtos;

import lombok.*;

@Getter
@Setter
@Data
public class LivroMinDto {
    private Long id;
    private String titulo;
    private String urlImg;
}
