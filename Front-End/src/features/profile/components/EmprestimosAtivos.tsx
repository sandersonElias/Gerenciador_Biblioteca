import React from "react";
import { Link } from "react-router-dom";
import { EmprestimosAtivoDto, EmprestimoHistoricoDto } from "../../../services";
import { fmt } from "../models/ProfileModel";
import Button from "../../../components/common/Button";

interface EmprestimosAtivosProps {
  emprestimos?: {
    emprestimosAtivo: EmprestimosAtivoDto | null;
    historico: EmprestimoHistoricoDto[];
  } | null;
  isAluno: boolean;
  isSolicitandoRenovacao: boolean;
  handleSolicitarRenovacao: (emprestimo: EmprestimosAtivoDto) => void;
}

export const EmprestimosAtivos: React.FC<EmprestimosAtivosProps> = ({
  emprestimos,
  isAluno,
  isSolicitandoRenovacao,
  handleSolicitarRenovacao,
}) => {
  return (
    <section className="profile-section">
      <h2 className="section-title">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
        Empréstimo Ativo
      </h2>

      {emprestimos?.emprestimosAtivo ? (
        (() => {
          const a = emprestimos.emprestimosAtivo;
          const atrasado = a.diasRestantes === 0;

          return (
            <div
              className={`active-loan-card ${
                atrasado ? "active-loan-card--late" : ""
              }`}
            >
              {/* Capa do livro */}
              <div className="active-loan-cover">
                {a.livro.urlImg ? (
                  <img src={a.livro.urlImg} alt={a.livro.titulo} />
                ) : (
                  <div className="cover-placeholder">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Informações do empréstimo */}
              <div className="active-loan-info">
                <Link to={`/livro/${a.livro.id}`} className="active-loan-title">
                  {a.livro.titulo}
                </Link>

                <div className="active-loan-meta">
                  <div className="meta-chip">
                    <span className="meta-chip__label">Emprestado em</span>
                    <span className="meta-chip__value">
                      {fmt(a.dataEmprestimo)}
                    </span>
                  </div>
                  <div className="meta-chip">
                    <span className="meta-chip__label">Devolver até</span>
                    <span className="meta-chip__value">
                      {fmt(a.dataDevolucao)}
                    </span>
                  </div>
                  <div className="meta-chip">
                    <span className="meta-chip__label">Renovações</span>
                    <span className="meta-chip__value">{a.renovacoes}/3</span>
                  </div>
                </div>

                {/* Barra de prazo */}
                <div className="deadline-bar">
                  <div
                    className={`deadline-bar__fill ${
                      atrasado ? "deadline-bar__fill--late" : ""
                    }`}
                    style={{
                      width: atrasado
                        ? "100%"
                        : `${Math.min(
                            100,
                            ((7 - a.diasRestantes) / 7) * 100,
                          )}%`,
                    }}
                  />
                </div>
                <p
                  className={`deadline-label ${
                    atrasado ? "deadline-label--late" : ""
                  }`}
                >
                  {atrasado
                    ? "⚠️ Prazo encerrado — devolva o livro"
                    : `${a.diasRestantes} dia${
                        a.diasRestantes !== 1 ? "s" : ""
                      } restante${a.diasRestantes !== 1 ? "s" : ""}`}
                </p>
              </div>

              {/* Ação de renovação (apenas ALUNO) */}
              {isAluno && (
                <div className="active-loan-action">
                  {a.podeRenovar ? (
                    <Button
                      variant="primary"
                      size="sm"
                      isLoading={isSolicitandoRenovacao}
                      onClick={() => handleSolicitarRenovacao(a)}
                    >
                      Solicitar Renovação
                    </Button>
                  ) : (
                    <span className="renew-blocked">
                      {a.renovacoes >= 3
                        ? "Limite atingido (3/3)"
                        : atrasado
                        ? "Livro atrasado"
                        : "Renovação indisponível"}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })()
      ) : (
        <div className="empty-card">
          <p>Você não possui nenhum empréstimo ativo no momento.</p>
          <Link to="/buscar" className="btn-browse">
            Explorar catálogo →
          </Link>
        </div>
      )}
    </section>
  );
};
