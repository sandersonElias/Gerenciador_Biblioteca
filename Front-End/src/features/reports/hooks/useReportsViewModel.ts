import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "../../../context/ToastContext";
import { EmprestimoService } from "../../../services/emprestimo/EmprestimoService";
import { ReservaService } from "../../../services/reserva/ReservaService";
import { LivroService } from "../../../services/livro/LivroService";
import {
  buildBarData,
  barOptions,
  buildDonutData,
  donutOptions,
  buildTopBorrowers,
} from "../models/ReportsModel";

export const useReportsViewModel = () => {
  const { showToast } = useToast();

  const loansQuery = useQuery({
    queryKey: ["emprestimos"],
    queryFn: () => EmprestimoService.getAll(),
  });

  const reservationsQuery = useQuery({
    queryKey: ["reservas"],
    queryFn: () => ReservaService.getAll(),
  });

  const popularQuery = useQuery({
    queryKey: ["livros", "populares", 8],
    queryFn: () => LivroService.getPopulares(8),
  });

  const hasError = loansQuery.isError || reservationsQuery.isError || popularQuery.isError;

  useEffect(() => {
    if (hasError) {
      showToast("Erro ao carregar dados dos relatórios", "error");
    }
  }, [hasError, showToast]);

  const loans = loansQuery.data ?? [];
  const reservations = reservationsQuery.data ?? [];
  const popularBooks = popularQuery.data ?? [];

  const ativos = loans.filter((l) => l.status === "ATIVO").length;
  const atrasados = loans.filter((l) => l.status === "ATRASADO").length;
  const devolvidos = loans.filter((l) => l.status === "DEVOLVIDO").length;
  const reservasAtivas = reservations.filter((r) =>
    ["ATIVA", "DISPONIVEL"].includes(r.status),
  ).length;

  const topBorrowers = buildTopBorrowers(loans);
  const barData = buildBarData(popularBooks);
  const donutData = buildDonutData(ativos, atrasados, devolvidos);

  return {
    loans,
    reservations,
    ativos,
    atrasados,
    devolvidos,
    reservasAtivas,
    topBorrowers,
    barData,
    barOptions,
    donutData,
    donutOptions,
  };
};
