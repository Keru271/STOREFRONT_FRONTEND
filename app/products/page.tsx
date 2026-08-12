// ─── PLP — /products ──────────────────────────────────────────────────────────
// Server Component — reads URL filters, fetches data, delegates to template.

import type { Metadata } from 'next';
import { getTheme } from '@/lib/api/theme';
import { getProducts } from '@/lib/api/products';
import { getCategories, getBrands } from '@/lib/api/catalog';
import { resolveTemplate } from '@/templates';

interface ProductsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata(): Promise<Metadata> {
  const theme = await getTheme();
  return {
    title: `Shop All Products`,
    description: `Browse our full catalogue of products at ${theme.storeName}.`,
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedParams = await searchParams;

  const [theme, categories, brands] = await Promise.all([
    getTheme(),
    getCategories(),
    getBrands(),
  ]);

  // Derive filter params from URL
  const products = await getProducts({
    category:  resolvedParams.category as string | undefined,
    brand:     resolvedParams.brand as string | undefined,
    search:    resolvedParams.search as string | undefined,
    sort:      resolvedParams.sort as string | undefined,
    minPrice:  resolvedParams.minPrice ? Number(resolvedParams.minPrice) : undefined,
    maxPrice:  resolvedParams.maxPrice ? Number(resolvedParams.maxPrice) : undefined,
    page:      resolvedParams.page ? Number(resolvedParams.page) : 1,
    limit:     24,
  });

  const { PLPPage } = resolveTemplate(theme.activeTemplateSlug);

  return (
    <PLPPage
      theme={theme}
      products={products}
      categories={categories}
      brands={brands}
      searchParams={resolvedParams}
    />
  );
}
