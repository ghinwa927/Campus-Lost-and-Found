import type { CampusItem, CategoryItem } from '../src/types';
import { INITIAL_ITEMS } from '../src/data/mockData';

type BackendItem = {
  _id?: { toString(): string } | string;
  title: string;
  type: 'lost' | 'found';
  categoryId?: string;
  description: string;
  location: string;
  date: string | Date;
  imageUrl?: string;
  reporterName: string;
  reporterEmail: string;
  status?: 'active' | 'resolved';
};

type BackendCategory = {
  _id?: { toString(): string } | string;
  name: string;
  slug?: string;
  icon?: string;
};

type CreateItemPayload = {
  title: string;
  type: 'lost' | 'found';
  categoryId: string;
  description: string;
  location: string;
  date: string;
  imageUrl?: string;
  reporterName: string;
  reporterEmail: string;
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80';

function formatDate(value: string | Date | undefined) {
  if (!value) return 'Just Now';

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Just Now';
  }

  return date.toLocaleDateString('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function mapBackendStatus(status: BackendItem['status'], type: BackendItem['type']): CampusItem['status'] {
  if (status === 'resolved') {
    return type === 'found' ? 'RETURNED_TO_OWNER' : 'FOUND_BY_OWNER';
  }

  return 'ACTIVE';
}

function toCampusItem(item: BackendItem, categoryMap: Map<string, string>): CampusItem {
  const backendId = typeof item._id === 'string' ? item._id : item._id?.toString() || undefined;
  const categoryName = categoryMap.get(backendId || '') || categoryMap.get(item.categoryId || '') || 'ELECTRONICS';

  return {
    id: backendId ? `item-${backendId}` : `${item.title}-${Math.random().toString(36).slice(2, 8)}`,
    backendId,
    title: item.title,
    type: item.type === 'found' ? 'FOUND' : 'LOST',
    category: categoryName.toUpperCase(),
    building: 'Central Library',
    faculty: 'General Studies',
    location: item.location,
    date: formatDate(item.date),
    imageUrl: item.imageUrl || DEFAULT_IMAGE,
    description: item.description,
    reporterName: item.reporterName,
    reporterEmail: item.reporterEmail,
    status: mapBackendStatus(item.status, item.type),
    securityPost: 'Campus Security Desk',
  };
}

export function useLostFoundApi() {
  const runtimeConfig = useRuntimeConfig();
  const apiBaseUrl = runtimeConfig.public?.apiBaseUrl || 'http://localhost:5000';
  const api = $fetch.create({
    baseURL: apiBaseUrl,
    retry: 0,
  });

  async function fetchCategories(): Promise<CategoryItem[]> {
    try {
      const data = await api<BackendCategory[]>('/api/categories');

      return data.map((category) => ({
        id: category._id?.toString() || category.slug || category.name,
        name: category.name,
        icon: category.icon || 'Tag',
      }));
    } catch (error) {
      console.warn('Falling back to local categories:', error);
      return [];
    }
  }

  async function fetchItems(): Promise<CampusItem[]> {
    try {
      const categories = await fetchCategories();
      const categoryMap = new Map(categories.map((category) => [category.id, category.name]));
      const data = await api<{ items?: BackendItem[] }>('/api/items?limit=50');
      const items = (data.items || []).map((item) => toCampusItem(item, categoryMap));

      return items.length ? items : INITIAL_ITEMS.map((item) => ({ ...item }));
    } catch (error) {
      console.warn('Falling back to mock data:', error);
      return INITIAL_ITEMS.map((item) => ({ ...item }));
    }
  }

  async function createItemReport(payload: CreateItemPayload, categoryMap: Map<string, string>): Promise<CampusItem> {
    const created = await api<BackendItem>('/api/items', {
      method: 'POST',
      body: payload,
    });

    return toCampusItem(created, categoryMap);
  }

  async function updateItemReportStatus(id: string, status: 'active' | 'resolved') {
    return api(`/api/items/${id}`, {
      method: 'PUT',
      body: { status },
    });
  }

  async function deleteItemReport(id: string) {
    return api(`/api/items/${id}`, {
      method: 'DELETE',
    });
  }

  return {
    apiBaseUrl,
    fetchCategories,
    fetchItems,
    createItemReport,
    updateItemReportStatus,
    deleteItemReport,
  };
}
