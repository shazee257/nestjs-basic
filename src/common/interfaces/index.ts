export interface QueryOption {
  page: number;
  limit: number;
  keyword?: string;
  userId?: string;
  sort?: Record<string, number>;
  populate?: string;
  select?: string;
  query?: any
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
  hasPrevPage?: boolean;
  hasNextPage?: boolean;
  prevPage?: number;
  nextPage?: number;
}

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;
}

export interface logging {
  statusCode: number;
  message: string;
  error: string;
  stack: string;
  createdAt: Date;
}