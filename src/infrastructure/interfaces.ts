import User from "@/models/user.model";

export interface SortBy {
  key: string;
  order: 'asc' | 'desc';
}

export interface GetUsersParams {
  page: number;
  itemsPerPage: number;
  sortBy: SortBy[];
}

export interface PaginatedResult {
  items: User[];
  total: number;
}

export interface LoadItemsParams {
  page: number;
  itemsPerPage: number;
  sortBy: SortBy[];
}
