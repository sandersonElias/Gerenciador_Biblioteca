import React from "react";
import { Link } from "react-router-dom";
import SearchBar from "../../../components/books/SearchBar";
import Button from "../../../components/common/Button";
import ImgUm from "../../../components/assets/home-img.png";
import { AnimatedTitle } from "./AnimatedTitle";
import { HeroStats } from "./HeroStats";

interface HeroSectionProps {
  currentWord: string;
  isWordVisible: boolean;
  canManageLoans: boolean;
  onSearch: (filter: string, term: string) => void;
}

/**
 * Seção Hero da HomePage
 * Inclui título animado, busca, e ações para funcionários
 */
export const HeroSection: React.FC<HeroSectionProps> = ({
  currentWord,
  isWordVisible,
  canManageLoans,
  onSearch,
}) => {
  return (
    <section className="hero">
      {/* Bolhas decorativas */}
      <div className="hero-blob hero-blob--1" aria-hidden="true" />
      <div className="hero-blob hero-blob--2" aria-hidden="true" />

      {/* Conteúdo esquerdo */}
      <div className="hero-content">
        <div className="hero-eyebrow">
          <span className="hero-eyebrow__dot" />
          Biblioteca Digital
        </div>

        <AnimatedTitle currentWord={currentWord} isVisible={isWordVisible} />

        <p className="hero-subtitle">
          Acesse o acervo completo, faça reservas e acompanhe seus empréstimos
          de qualquer lugar.
        </p>

        <div className="hero-search">
          <SearchBar onSearch={onSearch} />
        </div>

        {/* Ações para funcionários/admin */}
        {canManageLoans && (
          <div className="hero-actions">
            <Link to="/emprestimos">
              <Button variant="accent" size="lg">
                + Novo Empréstimo
              </Button>
            </Link>
            <Link to="/emprestimos">
              <Button variant="secondary" size="lg">
                ↻ Renovar
              </Button>
            </Link>
            <Link to="/emprestimos">
              <Button variant="outline" size="lg">
                ↩ Devolução
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Visual direito (imagem + stats) */}
      <div className="hero-visual">
        <div className="hero-image">
          <img src={ImgUm} className="img-um" alt="Ilustração da biblioteca" />
        </div>
        <HeroStats />
      </div>
    </section>
  );
};
