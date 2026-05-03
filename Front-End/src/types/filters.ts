export interface BookFilters {
  titulo?: string;
  autor?: string;
  genero?: string;
  catalogacao?: string;
}

export type BookFilterType = "titulo" | "autor" | "genero" | "catalogacao";
