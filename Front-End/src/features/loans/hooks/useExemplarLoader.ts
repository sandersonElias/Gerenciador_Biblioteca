import { useState, useEffect } from "react";
import { ExemplarService } from "../../../services/exemplar/ExemplarService";
import { Exemplar } from "../../../services/exemplar/types";

export const useExemplarLoader = (livroId: string) => {
  const [exemplares, setExemplares] = useState<Exemplar[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!livroId) {
      setExemplares([]);
      return;
    }

    setLoading(true);
    ExemplarService.listarDisponiveisPorLivro(Number(livroId))
      .then(setExemplares)
      .catch(() => setExemplares([]))
      .finally(() => setLoading(false));
  }, [livroId]);

  return { exemplares, loading };
};
