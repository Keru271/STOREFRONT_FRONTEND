// ─── Category Detail — /categories/[slug] ─────────────────────────────────────
// Server Component (SSR). Shows products filtered by category using active template PLPPage.

import type { Metadata } from 'next';
import { getTheme } from '@/lib/api/theme';
import { getCategoryBySlug, getCategories, getBrands } from '@/lib/api/catalog';
import { getProducts, getFilterFacets } from '@/lib/api/products';
import { resolveTemplate } from '@/templates';

export const dynamic = 'force-dynamic';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const [theme, category] = await Promise.all([getTheme(), getCategoryBySlug(slug)]);

  const categoryName = category ? category.name : decodeURIComponent(slug).replace(/-/g, ' ');

  return {
    title: `${categoryName} | ${theme.storeName}`,
    description:
      category?.description || `Shop top-rated ${categoryName} products at ${theme.storeName}.`,
    openGraph: {
      title: `${categoryName} — ${theme.storeName}`,
      description: category?.description || `Shop ${categoryName} online.`,
      images: category?.image ? [{ url: category.image }] : [],
    },
  };
}

export default async function CategoryDetailPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const resolvedParams = await searchParams;

  // Server-side parallel API calls
  const [theme, category, categories, brands, filterFacets] = await Promise.all([
    getTheme(),
    getCategoryBySlug(slug),
    getCategories(),
    getBrands(),
    getFilterFacets(),
  ]);

  // If category not found in list, fall back to decoded slug as name
  const categoryName = category ? category.name : decodeURIComponent(slug).replace(/-/g, ' ');

  // Fetch products for this category with optional additional filters
  const products = await getProducts({
    category: category ? category.name : categoryName,
    collection: resolvedParams.collection as string | undefined,
    brand: resolvedParams.brand as string | undefined,
    brands: resolvedParams.brands as string | undefined,
    search: (resolvedParams.search || resolvedParams.q) as string | undefined,
    sort: resolvedParams.sort as string | undefined,
    minPrice: resolvedParams.minPrice ? Number(resolvedParams.minPrice) : undefined,
    maxPrice: resolvedParams.maxPrice ? Number(resolvedParams.maxPrice) : undefined,
    discount: resolvedParams.discount ? Number(resolvedParams.discount) : undefined,
    minDiscount: resolvedParams.minDiscount ? Number(resolvedParams.minDiscount) : undefined,
    gender: resolvedParams.gender as string | undefined,
    page: resolvedParams.page ? Number(resolvedParams.page) : 1,
    limit: 24,
  });

  const previewTemplate = resolvedParams?.previewTemplate as string | undefined;
  const effectiveTheme = previewTemplate
    ? { ...theme, activeTemplateSlug: previewTemplate }
    : theme;

  const { PLPPage } = resolveTemplate(effectiveTheme.activeTemplateSlug);

  // Pass category context via searchParams so PLPPage can render heading & breadcrumbs
  const enrichedParams: Record<string, string | string[] | undefined> = {
    ...resolvedParams,
    category: categoryName,
    _categoryName: categoryName,
    _categoryDescription: category?.description || '',
    _categorySlug: category?.slug || slug,
  };

  return (
    <PLPPage
      theme={effectiveTheme}
      products={products}
      categories={categories}
      brands={brands}
      filterFacets={filterFacets}
      searchParams={enrichedParams}
    />
  );
}
