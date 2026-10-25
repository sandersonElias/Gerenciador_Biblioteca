package dev.sanderson.Back_End.dto.ExemplarDtos;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdicionarExemplarRequest {

    @NotNull(message = "Quantidade e obrigatoria")
    @Min(value = 1, message = "Quantidade minima e 1")
    @Max(value = 100, message = "Quantidade maxima e 100")
    private Integer quantidade;
}
