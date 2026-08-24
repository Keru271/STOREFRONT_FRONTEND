// ─── PLP — /products ──────────────────────────────────────────────────────────
// Server Component — reads URL filters, fetches data, delegates to template.

import type { Metadata } from 'next';
import { getTheme } from '@/lib/api/theme';
import { getProducts, getFilterFacets } from '@/lib/api/products';
import { getCategories, getBrands } from '@/lib/api/catalog';
import { resolveTemplate } from '@/templates';

interface ProductsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata(): Promise<Metadata> {
  const theme = await getTheme();
  return {
    title: `Shop All Products | ${theme.seoSiteTitle || theme.storeName}`,
    description: `Browse our full catalogue of products at ${theme.storeName}.`,
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedParams = await searchParams;

  const [theme, categories, brands, filterFacets] = await Promise.all([
    getTheme(),
    getCategories(),
    getBrands(),
    getFilterFacets(),
  ]);

  // Derive filter params from URL
  const products = await getProducts({
    category:    resolvedParams.category as string | undefined,
    categories:  resolvedParams.categories as string | undefined,
    brand:       resolvedParams.brand as string | undefined,
    brands:      resolvedParams.brands as string | undefined,
    search:      (resolvedParams.search || resolvedParams.q) as string | undefined,
    sort:        resolvedParams.sort as string | undefined,
    minPrice:    resolvedParams.minPrice ? Number(resolvedParams.minPrice) : undefined,
    maxPrice:    resolvedParams.maxPrice ? Number(resolvedParams.maxPrice) : undefined,
    discount:    resolvedParams.discount ? Number(resolvedParams.discount) : undefined,
    minDiscount: resolvedParams.minDiscount ? Number(resolvedParams.minDiscount) : undefined,
    gender:      resolvedParams.gender as string | undefined,
    page:        resolvedParams.page ? Number(resolvedParams.page) : 1,
    limit:       24,
  });

  // Allow CMS to preview any template via ?previewTemplate=<slug>
  const previewTemplate = resolvedParams?.previewTemplate as string | undefined;
  const effectiveTheme = previewTemplate ? { ...theme, activeTemplateSlug: previewTemplate } : theme;

  const { PLPPage } = resolveTemplate(effectiveTheme.activeTemplateSlug);

  return (
    <PLPPage
      theme={effectiveTheme}
      products={products}
      categories={categories}
      brands={brands}
      filterFacets={filterFacets}
      searchParams={resolvedParams}
    />
  );
}
