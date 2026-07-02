import { BookFilterType } from "../../../types/filters";

export interface BookSearchState {
  currentFilter: BookFilterType;
  currentTerm: string;
}

export const INITIAL_BOOK_SEARCH: BookSearchState = {
  currentFilter: "titulo",
  currentTerm: "",
};
