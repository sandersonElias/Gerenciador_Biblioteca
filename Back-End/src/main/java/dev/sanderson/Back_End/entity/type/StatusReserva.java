package dev.sanderson.Back_End.entity.type;

public enum StatusReserva {
        ATIVA,        // fila aguardando devolução
        DISPONIVEL,   // livro devolvido aguardando retirada
        CONCLUIDA,    // usuário retirou o livro
        EXPIRADA,     // não retirou em 1 dia
        CANCELADA     // cancelada manualmente
}
