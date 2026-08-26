// ─── Category Detail — /categories/[slug] ─────────────────────────────────────
// Server Component (ISR 60s). Shows products filtered by category.
// Reuses the template PLPPage for consistent product listing UI.

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTheme } from '@/lib/api/theme';
import { getCategories, getBrands } from '@/lib/api/catalog';
import { getProducts } from '@/lib/api/products';
import { resolveTemplate } from '@/templates';

export const revalidate = 60;

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const [theme, categories] = await Promise.all([getTheme(), getCategories()]);

  const category = categories.find(
    (c) => c.slug === slug || c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug
  );

  if (!category) {
    return { title: 'Category Not Found' };
  }

  return {
    title: `${category.name} | ${theme.storeName}`,
    description:
      category.description ||
      `Shop top-rated ${category.name} products at ${theme.storeName}.`,
    openGraph: {
      title: `${category.name} — ${theme.storeName}`,
      description: category.description || `Shop ${category.name} online.`,
    },
  };
}

export default async function CategoryDetailPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const resolvedParams = await searchParams;

  const [theme, categories, brands] = await Promise.all([
    getTheme(),
    getCategories(),
    getBrands(),
  ]);

  const category = categories.find(
    (c) => c.slug === slug || c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug
  );

  // If category not found in list, fall back to slug as name
  const categoryName = category ? category.name : slug;

  // Fetch products for this category with optional additional filters
  const products = await getProducts({
    category: category ? category.name : slug,
    collection: resolvedParams.collection as string | undefined,
    brand:      resolvedParams.brand      as string | undefined,
    search:     resolvedParams.search     as string | undefined,
    sort:       resolvedParams.sort       as string | undefined,
    minPrice:   resolvedParams.minPrice ? Number(resolvedParams.minPrice) : undefined,
    maxPrice:   resolvedParams.maxPrice ? Number(resolvedParams.maxPrice) : undefined,
    page:       resolvedParams.page     ? Number(resolvedParams.page)     : 1,
    limit:      24,
  });

  const previewTemplate = resolvedParams?.previewTemplate as string | undefined;
  const effectiveTheme = previewTemplate
    ? { ...theme, activeTemplateSlug: previewTemplate }
    : theme;

  const { PLPPage } = resolveTemplate(effectiveTheme.activeTemplateSlug);

  // Pass category context via searchParams so PLPPage can render heading & breadcrumbs
  const enrichedParams: Record<string, string | string[] | undefined> = {
    ...resolvedParams,
    _categoryName:        categoryName,
    _categoryDescription: category?.description || '',
    _categorySlug:        category?.slug || slug,
  };

  return (
    <PLPPage
      theme={effectiveTheme}
      products={products}
      categories={categories}
      brands={brands}
      searchParams={enrichedParams}
    />
  );
}
