// ─── Search — /search ─────────────────────────────────────────────────────────
// SSR (no cache). Reads ?q= from URL, fetches matching products, delegates to
// the active template PLPPage for a consistent product listing experience.

import type { Metadata } from 'next';
import { getTheme } from '@/lib/api/theme';
import { getCategories, getBrands } from '@/lib/api/catalog';
import { searchProducts } from '@/lib/api/search';
import { resolveTemplate } from '@/templates';

// Force SSR — search results must always be fresh
export const dynamic = 'force-dynamic';

interface SearchPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const params = await searchParams;
  const q = (params.q as string) || '';
  const theme = await getTheme();

  return {
    title: q ? `Search: "${q}"` : 'Search',
    description: q
      ? `Search results for "${q}" at ${theme.storeName}.`
      : `Search products at ${theme.storeName}.`,
    robots: { index: false, follow: true }, // Don't index search result pages
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedParams = await searchParams;
  const q = ((resolvedParams.q as string) || '').trim();

  const [theme, categories, brands] = await Promise.all([
    getTheme(),
    getCategories(),
    getBrands(),
  ]);

  // Only fetch if a query exists
  const products = q
    ? await searchProducts({
        q,
        sort:     resolvedParams.sort     as string | undefined,
        category: resolvedParams.category as string | undefined,
        brand:    resolvedParams.brand    as string | undefined,
        minPrice: resolvedParams.minPrice ? Number(resolvedParams.minPrice) : undefined,
        maxPrice: resolvedParams.maxPrice ? Number(resolvedParams.maxPrice) : undefined,
        page:     resolvedParams.page     ? Number(resolvedParams.page)     : 1,
        limit:    24,
      })
    : [];

  const { PLPPage } = resolveTemplate(theme.activeTemplateSlug);

  // Enrich searchParams with search context metadata for PLPPage
  const enrichedParams: Record<string, string | string[] | undefined> = {
    ...resolvedParams,
    q,
    _isSearch:   'true',
    _searchTerm: q,
  };

  return (
    <PLPPage
      theme={theme}
      products={products}
      categories={categories}
      brands={brands}
      searchParams={enrichedParams}
    />
  );
}
