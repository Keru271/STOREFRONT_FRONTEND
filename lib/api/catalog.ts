// ─── Catalog API ─────────────────────────────────────────────────────────────
// Categories, collections, brands, menus, and static pages.

import { apiClient } from './client';
import type { Brand, Category, Collection, Menu, CmsPage } from './types';

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
 * Uses on-demand revalidation (revalidate: 0) for real-time synchronization with CMS.
 */
export async function getMenus(): Promise<Menu[]> {
  try {
    return await apiClient.get<Menu[]>('api/storefront/catalog/menus', {
      next: { revalidate: 0, tags: ['menus'] },
    });
  } catch {
    return [];
  }
}

/**
 * Fetches a single navigation menu by handle, location, or id.
 * Uses on-demand revalidation (revalidate: 0) for real-time synchronization with CMS.
 */
export async function getMenu(handle: string = 'main-menu'): Promise<Menu | null> {
  try {
    return await apiClient.get<Menu>(
      `api/storefront/catalog/menus/${encodeURIComponent(handle)}`,
      { next: { revalidate: 0, tags: ['menus', `menu-${handle}`] } }
    );
  } catch {
    return null;
  }
}

/**
 * Fetches all published static and custom pages.
 */
export async function getPages(): Promise<CmsPage[]> {
  try {
    return await apiClient.get<CmsPage[]>('api/storefront/catalog/pages', {
      next: { revalidate: 0, tags: ['pages'] },
    });
  } catch {
    return [];
  }
}

/**
 * Fetches a single static/custom page by its slug or ID.
 */
export async function getPage(slug: string): Promise<CmsPage | null> {
  try {
    return await apiClient.get<CmsPage>(
      `api/storefront/catalog/pages/${encodeURIComponent(slug)}`,
      { next: { revalidate: 0, tags: ['pages', `page-${slug}`] } }
    );
  } catch {
    return null;
  }
}

/**
 * Fetches a single collection by slug, including its metadata.
 * Cached for 5 minutes (300s).
 */
export async function getCollectionBySlug(slug: string): Promise<Collection | null> {
  try {
    return await apiClient.get<Collection>(
      `api/storefront/catalog/collections/${encodeURIComponent(slug)}`,
      { next: { revalidate: 300, tags: ['collections', `collection-${slug}`] } }
    );
  } catch {
    return null;
  }
}

