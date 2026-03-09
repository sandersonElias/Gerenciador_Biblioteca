package dev.sanderson.Back_End.dto.LivroDtos;

public record LivroResponse(
        Long id,
        String titulo,
        String editora,
        Integer totalExemplares,
        String cdd,
        String localizacao,
        String descricao,
        String urlImg,
        Integer contadorEmprestimos,
        AutorDto autor,
        GeneroDto genero,
        CatalogacaoDto catalogacao
) {
}
