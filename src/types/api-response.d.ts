export interface PaginationResponse<T> {
  currentPage: number | null;
  totalPages: number;
  nextPage: boolean;
  countRows: number;
  countAll: number;
  rows: T[];
}

export interface ApiCatchError {
  message?: string;
}