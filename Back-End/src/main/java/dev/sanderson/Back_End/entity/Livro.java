package dev.sanderson.Back_End.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "tb_livro")
public class Livro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    private String editora;

    @Column(nullable = false)
    private Integer totalExemplares;

    private String cdd;
    private String localizacao;
    private String descricao;
    private String urlImg;

    @Column(nullable = false)
    private Integer contadorEmprestimos = 0;

    @ManyToOne
    @JoinColumn(name = "genero_id")
    private Genero genero;

    @ManyToOne
    @JoinColumn(name = "catalogacao_id")
    private Catalogacao catalogacao;

    @ManyToOne
    @JoinColumn(name = "autor_id")
    private Autor autor;
}
