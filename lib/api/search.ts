// ─── Search API ───────────────────────────────────────────────────────────────
// Thin wrapper over getProducts optimised for search use cases.
// Search is always SSR (no ISR caching) to return live results.

import { getProducts } from './products';
import type { Product, ProductsQueryParams } from './types';

export interface SearchParams extends Omit<ProductsQueryParams, 'search'> {
  q: string;
}

/**
 * Searches products by keyword.
 * Always fetches fresh data (no Next.js cache) so results are up-to-date.
 */
export async function searchProducts(params: SearchParams): Promise<Product[]> {
  const { q, ...rest } = params;
  if (!q?.trim()) return [];

  return getProducts({
    ...rest,
    search: q.trim(),
  });
}
