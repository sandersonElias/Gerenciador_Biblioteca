import React from "react";
import { Livro } from "../../../services/livro/types";
import { BookAvailability } from "../models/BookDetailModel";
import { BookMetadata } from "./BookMetadata";
import { AvailabilityBar } from "./AvailabilityBar";
import { BookStats } from "./BookStats";
import { BookActions } from "./BookActions";

interface BookInfoProps {
  book: Livro;
  availability: BookAvailability;
  reservationCount: number;
  canReserve: boolean;
  canEdit: boolean;
  onReserve: () => void;
  onEdit: () => void;
}

/**
 * Seção completa de informações do livro
 * Agrupa metadados, disponibilidade, stats e ações
 */
export const BookInfo: React.FC<BookInfoProps> = ({
  book,
  availability,
  reservationCount,
  canReserve,
  canEdit,
  onReserve,
  onEdit,
}) => {
  // Prepara metadados para o componente BookMetadata
  const metadataItems = [
    { label: "Editora", value: book.editora || "Não informada" },
    { label: "Gênero", value: book.genero?.genero || "Não informado" },
    {
      label: "Catalogação",
      value: book.catalogacao?.catalogacao || "Não informada",
    },
    { label: "CDD", value: book.cdd || "Não informado" },
    { label: "Localização", value: book.localizacao || "Não informada" },
  ];

  return (
    <div className="book-info-section">
      {/* Cabeçalho */}
      <div className="book-header">
        <span
          className={`availability-badge ${
            availability.isAvailable ? "available" : "unavailable"
          }`}
        >
          {availability.isAvailable ? "Disponível" : "Indisponível"}
        </span>
        <h1>{book.titulo}</h1>
        <p className="book-author">{book.autor?.autor}</p>
      </div>

      {/* Metadados */}
      <BookMetadata items={metadataItems} />

      {/* Barra de disponibilidade */}
      <AvailabilityBar availability={availability} />

      {/* Stats */}
      <BookStats
        loanCount={book.contadorEmprestimos}
        reservationCount={reservationCount}
      />

      {/* Descrição */}
      {book.descricao && (
        <div className="book-description">
          <h3>Descrição</h3>
          <p>{book.descricao}</p>
        </div>
      )}

      {/* Ações desktop */}
      <BookActions
        canReserve={canReserve}
        canEdit={canEdit}
        isAvailable={availability.isAvailable}
        onReserve={onReserve}
        onEdit={onEdit}
        className="book-actions-desktop"
      />
    </div>
  );
};
