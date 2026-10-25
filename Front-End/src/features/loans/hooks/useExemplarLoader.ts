import { useQuery } from "@tanstack/react-query";
import { ExemplarService } from "../../../services/exemplar/ExemplarService";

export const useExemplarLoader = (livroId: string) => {
  const { data: exemplares = [], isLoading } = useQuery({
    queryKey: ["exemplares", "disponiveis", livroId],
    queryFn: () => ExemplarService.listarDisponiveisPorLivro(Number(livroId)),
    enabled: !!livroId,
  });

  return { exemplares, loading: isLoading };
};
