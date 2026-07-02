import { useCallback, useEffect, useState } from "react";
import { useToast } from "../../../context/ToastContext";
import { useLoading } from "../../../context/LoadingContext";
import { EmprestimoService } from "../../../services/emprestimo/EmprestimoService";
import { ReservaService } from "../../../services/reserva/ReservaService";
import { LivroService } from "../../../services/livro/LivroService";
import { EmprestimoResponse } from "../../../services/emprestimo/types";
import { ReservaResponse } from "../../../services/reserva/types";
import { Livro } from "../../../services/livro/types";
import {
  buildBarData,
  barOptions,
  buildDonutData,
  donutOptions,
  buildTopBorrowers,
} from "../models/ReportsModel";

export const useReportsViewModel = () => {
  const [loans, setLoans] = useState<EmprestimoResponse[]>([]);
  const [reservations, setReservations] = useState<ReservaResponse[]>([]);
  const [popularBooks, setPopularBooks] = useState<Livro[]>([]);

  const { showToast } = useToast();
  const { withLoading } = useLoading();

  const loadData = useCallback(async () => {
    try {
      const [loansData, reservationsData, popularData] = await Promise.all([
        withLoading(EmprestimoService.getAll()),
        withLoading(ReservaService.getAll()),
        withLoading(LivroService.getPopulares(8)),
      ]);
      setLoans(loansData);
      setReservations(reservationsData);
      setPopularBooks(popularData);
    } catch {
      showToast("Erro ao carregar dados dos relatórios", "error");
    }
  }, [withLoading, showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

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
