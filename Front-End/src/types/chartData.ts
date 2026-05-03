import { Emprestimo } from "../services/emprestimo/types";
import { Livro } from "../services/livro/types";
import { Reserva } from "../services/reserva/types";
import { UserMinDto } from "../services/user/types";

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

export interface ReportData {
  ultimosEmprestimos: Emprestimo[];
  ultimasReservas: Reserva[];
  livrosMaisPopulares: Livro[];
  alunosMaisEmprestimos: { usuario: UserMinDto; quantidade: number }[];
}