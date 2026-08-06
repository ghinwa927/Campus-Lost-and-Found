import type { ItemStatus, ItemType } from "./item.types.js";

export interface ItemQuery {
  page?: number;
  limit?: number;
  search?: string;
  type?: ItemType;
  categoryId?: string;
  location?: string;
  status?: ItemStatus;
}

export interface PaginationResult {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}