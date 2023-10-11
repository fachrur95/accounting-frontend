export declare interface PaginationResponse<T> {
  currentPage: number | null;
  totalPages: number;
  nextPage: boolean;
  countRows: number;
  countAll: number;
  rows: T[];
}

export declare interface ApiCatchError {
  message?: string;
}