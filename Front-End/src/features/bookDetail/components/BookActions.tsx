import React from "react";
import Button from "../../../components/common/Button";

interface BookActionsProps {
  canReserve: boolean;
  canEdit: boolean;
  isAvailable: boolean;
  onReserve: () => void;
  onEdit: () => void;
  className?: string;
}

/**
 * Componente puro dos botões de ação
 */
export const BookActions: React.FC<BookActionsProps> = ({
  canReserve,
  canEdit,
  isAvailable,
  onReserve,
  onEdit,
  className = "",
}) => {
  return (
    <div className={className}>
      {canReserve && (
        <Button
          variant={isAvailable ? "primary" : "outline"}
          size="lg"
          onClick={onReserve}
          disabled={!isAvailable}
        >
          {isAvailable ? "Reservar Livro" : "Indisponível"}
        </Button>
      )}
      {canEdit && (
        <Button variant="secondary" size="lg" onClick={onEdit}>
          Editar Livro
        </Button>
      )}
    </div>
  );
};
