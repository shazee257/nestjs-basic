export interface QueryOption {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginationResult<T> {
  result: T[];
  pagination: Pagination;
}

export interface Pagination {
  totalItems: number;
  perPage: number;
  currentPage: number;
  totalPages: number;
  pagingCounter?: number;
  hasPrevPage?: boolean;
  hasNextPage?: boolean;
  prevPage?: number;
  nextPage?: number;
}
