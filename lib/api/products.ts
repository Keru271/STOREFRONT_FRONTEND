// ─── Products API ─────────────────────────────────────────────────────────────
// All storefront product operations.

import { apiClient } from './client';
import type { Product, ProductDetail, ProductsQueryParams } from './types';

// Backend wraps the list response in this shape
interface ProductsApiResponse {
  products: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Fetches a list of products with optional filtering.
 * NOTE: The backend uses `sortBy` (not `sort`) and returns { products, pagination }.
 * Cached for 60 seconds on the server.
 */
export async function getProducts(params?: ProductsQueryParams): Promise<Product[]> {
  const searchParams = new URLSearchParams();

  if (params) {
    // Map frontend `sort` key → backend `sortBy` key
    const mapped: Record<string, string> = {
      ...(params.page != null ? { page: String(params.page) } : {}),
      ...(params.limit != null ? { limit: String(params.limit) } : {}),
      ...(params.search ? { search: params.search } : {}),
      ...(params.category ? { category: params.category } : {}),
      ...(params.brand ? { brand: params.brand } : {}),
      ...(params.collection ? { collection: params.collection } : {}),
      ...(params.minPrice != null ? { minPrice: String(params.minPrice) } : {}),
      ...(params.maxPrice != null ? { maxPrice: String(params.maxPrice) } : {}),
      // Backend query param is `sortBy`, not `sort`
      ...(params.sort ? { sortBy: params.sort } : {}),
    };
    Object.entries(mapped).forEach(([key, value]) => searchParams.set(key, value));
  }

  const queryString = searchParams.toString();
  const endpoint = `api/storefront/products${queryString ? `?${queryString}` : ''}`;

  try {
    // Backend returns { products: [...], pagination: {...} }
    const response = await apiClient.get<ProductsApiResponse>(endpoint, {
      next: { revalidate: 60, tags: ['products'] },
    });
    return Array.isArray(response) ? response : (response.products ?? []);
  } catch {
    return [];
  }
}

/**
 * Fetches detailed info for a single product by ID or URL slug.
 * Cached for 60 seconds on the server.
 */
export async function getProductDetail(idOrSlug: string): Promise<ProductDetail | null> {
  try {
    return await apiClient.get<ProductDetail>(
      `api/storefront/products/${encodeURIComponent(idOrSlug)}`,
      { next: { revalidate: 60, tags: ['products', `product-${idOrSlug}`] } }
    );
  } catch {
    return null;
  }
}
