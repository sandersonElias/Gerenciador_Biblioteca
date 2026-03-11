package dev.sanderson.Back_End.entity;


import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "tb_aluno")
@PrimaryKeyJoinColumn(name = "id")
public class Aluno extends User {

    private String sala;
    private Integer ano;
}
