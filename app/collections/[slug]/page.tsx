// ─── Collection Detail — /collections/[slug] ──────────────────────────────────
// Server Component (ISR 60s). Shows products filtered by collection.
// Reuses the template PLPPage for consistent product listing UI.

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTheme } from '@/lib/api/theme';
import { getCollectionBySlug, getCategories, getBrands } from '@/lib/api/catalog';
import { getProducts } from '@/lib/api/products';
import { resolveTemplate } from '@/templates';

export const revalidate = 60;

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const [theme, collection] = await Promise.all([getTheme(), getCollectionBySlug(slug)]);

  if (!collection) {
    return { title: 'Collection Not Found' };
  }

  return {
    title: collection.name,
    description:
      collection.description ||
      `Shop the ${collection.name} collection at ${theme.storeName}.`,
    openGraph: {
      title: `${collection.name} — ${theme.storeName}`,
      description: collection.description || `Shop the ${collection.name} collection.`,
      images: collection.image ? [{ url: collection.image }] : [],
    },
  };
}

export default async function CollectionDetailPage({
  params,
  searchParams,
}: CollectionPageProps) {
  const { slug } = await params;
  const resolvedParams = await searchParams;

  const [theme, collection, categories, brands] = await Promise.all([
    getTheme(),
    getCollectionBySlug(slug),
    getCategories(),
    getBrands(),
  ]);

  // 404 if collection doesn't exist
  if (!collection) {
    notFound();
  }

  // Fetch products for this collection with optional additional filters
  const products = await getProducts({
    collection: slug,
    category: resolvedParams.category as string | undefined,
    brand:    resolvedParams.brand    as string | undefined,
    search:   resolvedParams.search   as string | undefined,
    sort:     resolvedParams.sort     as string | undefined,
    minPrice: resolvedParams.minPrice ? Number(resolvedParams.minPrice) : undefined,
    maxPrice: resolvedParams.maxPrice ? Number(resolvedParams.maxPrice) : undefined,
    page:     resolvedParams.page     ? Number(resolvedParams.page)     : 1,
    limit:    24,
  });

  const { PLPPage } = resolveTemplate(theme.activeTemplateSlug);

  // Pass collection context via searchParams so PLPPage can show the heading
  const enrichedParams: Record<string, string | string[] | undefined> = {
    ...resolvedParams,
    _collectionName:        collection.name,
    _collectionDescription: collection.description || '',
    _collectionSlug:        collection.slug,
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
