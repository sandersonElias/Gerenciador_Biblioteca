package dev.sanderson.Back_End.dto.ExemplarDtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExemplarResponse {
    private Long id;
    private String codigo;
    private String status;
    private Long livroId;
    private String livroTitulo;
}
