export type StatusExemplar = "DISPONIVEL" | "EMPRESTADO" | "RESERVADO";

export interface Exemplar {
  id: number;
  codigo: string;
  status: StatusExemplar;
  livroId: number;
  livroTitulo: string;
}