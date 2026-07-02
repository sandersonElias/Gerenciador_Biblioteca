import { EmprestimoResponse } from "../../../services/emprestimo/types";
import { Livro } from "../../../services/livro/types";

export interface TopBorrower {
  name: string;
  email: string;
  count: number;
}

export const fmt = (date?: string) =>
  date ? new Date(date).toLocaleDateString("pt-BR") : "—";

export const statusLoanClass = (s: string) => {
  if (s === "ATIVO") return "badge--success";
  if (s === "ATRASADO") return "badge--danger";
  if (s === "DEVOLVIDO") return "badge--info";
  return "";
};

export const statusResClass = (s: string) => {
  if (s === "ATIVA") return "badge--warn";
  if (s === "DISPONIVEL") return "badge--success";
  if (s === "CONCLUIDA") return "badge--info";
  if (s === "EXPIRADA" || s === "CANCELADA") return "badge--danger";
  return "";
};

export const statusLabel = (s: string) => {
  const map: Record<string, string> = {
    ATIVO: "Ativo",
    ATRASADO: "Atrasado",
    DEVOLVIDO: "Devolvido",
    ATIVA: "Na fila",
    DISPONIVEL: "Disponível",
    CONCLUIDA: "Concluída",
    EXPIRADA: "Expirada",
    CANCELADA: "Cancelada",
  };
  return map[s] ?? s;
};

export const buildBarData = (popularBooks: Livro[]) => ({
  labels: popularBooks.map((b) =>
    b.titulo.length > 18 ? b.titulo.slice(0, 18) + "…" : b.titulo,
  ),
  datasets: [
    {
      label: "Empréstimos",
      data: popularBooks.map((b) => b.contadorEmprestimos),
      backgroundColor: "rgba(30, 111, 191, 0.75)",
      borderColor: "#1E6FBF",
      borderWidth: 1.5,
      borderRadius: 6,
    },
  ],
});

export const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    title: { display: false },
    tooltip: {
      callbacks: { label: (ctx: any) => ` ${ctx.parsed.y} empréstimos` },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: { stepSize: 1 },
      grid: { color: "rgba(0,0,0,0.05)" },
    },
    x: { grid: { display: false } },
  },
};

export const buildDonutData = (
  ativos: number,
  atrasados: number,
  devolvidos: number,
) => ({
  labels: ["Ativos", "Atrasados", "Devolvidos"],
  datasets: [
    {
      data: [ativos, atrasados, devolvidos],
      backgroundColor: [
        "rgba(16,185,129,0.85)",
        "rgba(220,38,38,0.85)",
        "rgba(30,111,191,0.85)",
      ],
      borderColor: ["#10B981", "#DC2626", "#1E6FBF"],
      borderWidth: 2,
      hoverOffset: 8,
    },
  ],
});

export const donutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "62%",
  plugins: {
    legend: {
      position: "bottom" as const,
      labels: { padding: 16, font: { size: 12 } },
    },
    title: { display: false },
  },
};

export const buildTopBorrowers = (
  loans: EmprestimoResponse[],
): TopBorrower[] => {
  const counts = loans.reduce<Record<string, TopBorrower>>((acc, loan) => {
    const key = loan.user.email;
    if (!acc[key])
      acc[key] = { name: loan.user.name, email: loan.user.email, count: 0 };
    acc[key].count += 1;
    return acc;
  }, {});
  return Object.values(counts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
};
