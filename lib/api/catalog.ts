// ─── Catalog API ─────────────────────────────────────────────────────────────
// Categories, collections, brands, menus, and static pages.

import { apiClient } from './client';
import type { Brand, Category, Collection, Menu } from './types';

/**
 * Fetches all product categories.
 * Cached for 5 minutes (300s).
 */
export async function getCategories(): Promise<Category[]> {
  try {
    return await apiClient.get<Category[]>('api/storefront/catalog/categories', {
      next: { revalidate: 300, tags: ['categories'] },
    });
  } catch {
    return [];
  }
}

/**
 * Fetches all product collections.
 * Cached for 5 minutes (300s).
 */
export async function getCollections(): Promise<Collection[]> {
  try {
    return await apiClient.get<Collection[]>('api/storefront/catalog/collections', {
      next: { revalidate: 300, tags: ['collections'] },
    });
  } catch {
    return [];
  }
}

/**
 * Fetches all brands.
 * Cached for 5 minutes (300s).
 */
export async function getBrands(): Promise<Brand[]> {
  try {
    return await apiClient.get<Brand[]>('api/storefront/catalog/brands', {
      next: { revalidate: 300, tags: ['brands'] },
    });
  } catch {
    return [];
  }
}

/**
 * Fetches all navigation menus.
 * Cached for 5 minutes (300s).
 */
export async function getMenus(): Promise<Menu[]> {
  try {
    return await apiClient.get<Menu[]>('api/storefront/catalog/menus', {
      next: { revalidate: 300, tags: ['menus'] },
    });
  } catch {
    return [];
  }
}

/**
 * Fetches a single static page by its slug.
 */
export async function getPage(slug: string): Promise<{ title: string; content: string } | null> {
  try {
    return await apiClient.get<{ title: string; content: string }>(
      `api/storefront/catalog/pages/${encodeURIComponent(slug)}`,
      { next: { revalidate: 300 } }
    );
  } catch {
    return null;
  }
}
