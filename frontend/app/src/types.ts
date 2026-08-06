export type ItemType = 'LOST' | 'FOUND';
export type ItemStatus = 'ACTIVE' | 'IN_CLAIM' | 'FOUND_BY_OWNER' | 'RETURNED_TO_OWNER' | 'RECONNECTED';

export interface CampusItem {
  id: string;
  backendId?: string;
  title: string;
  type: ItemType;
  category: string; // e.g. 'ELECTRONICS', 'BAGS', 'PERSONAL ITEMS', 'BOOKS', 'KEYS', 'PHONE', 'LAPTOP'
  building: string;
  faculty: string;
  location: string;
  date: string;
  imageUrl: string;
  description?: string;
  reporterName?: string;
  reporterPhone?: string;
  reporterEmail?: string;
  reporterContact?: string;
  status: ItemStatus;
  securityPost?: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  icon: string;
}

export type ActiveTab = 'dashboard' | 'report' | 'my-items' | 'settings';

// Runtime export stubs to satisfy runtime module resolution in SSR/bundlers
export const CampusItem = {};
export const CategoryItem = {};
export const ActiveTab = {};
export const ItemStatus = {};
export const ItemType = {};

