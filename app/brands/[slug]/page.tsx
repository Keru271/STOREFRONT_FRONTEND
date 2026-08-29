// ─── Brand Detail — /brands/[slug] ──────────────────────────────────────────
// Server Component (SSR). Displays products filtered by brand using active template PLPPage.

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTheme } from '@/lib/api/theme';
import { getBrandBySlug, getBrands, getCategories } from '@/lib/api/catalog';
import { getProducts, getFilterFacets } from '@/lib/api/products';
import { resolveTemplate } from '@/templates';

export const dynamic = 'force-dynamic';

interface BrandPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const { slug } = await params;
  const [theme, brand] = await Promise.all([getTheme(), getBrandBySlug(slug)]);

  const brandName = brand ? brand.name : decodeURIComponent(slug).replace(/-/g, ' ');

  return {
    title: `${brandName} Collection | ${theme.storeName}`,
    description:
      brand?.description ||
      `Shop authentic ${brandName} products, clothing, and gear at ${theme.storeName}.`,
    openGraph: {
      title: `${brandName} — ${theme.storeName}`,
      description: brand?.description || `Explore ${brandName} online at ${theme.storeName}.`,
      images: brand?.logo ? [{ url: brand.logo }] : [],
    },
  };
}

export default async function BrandDetailPage({
  params,
  searchParams,
}: BrandPageProps) {
  const { slug } = await params;
  const resolvedParams = await searchParams;

  // Server-side parallel API calls
  const [theme, brand, brands, categories, filterFacets] = await Promise.all([
    getTheme(),
    getBrandBySlug(slug),
    getBrands(),
    getCategories(),
    getFilterFacets(),
  ]);

  const brandName = brand ? brand.name : decodeURIComponent(slug).replace(/-/g, ' ');

  // Fetch products for this brand with optional additional filters (category, sort, price, etc.)
  const products = await getProducts({
    brand:       brand ? brand.name : brandName,
    category:    resolvedParams.category as string | undefined,
    categories:  resolvedParams.categories as string | undefined,
    collection:  resolvedParams.collection as string | undefined,
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

  // Resolve template from theme configuration or query preview override
  const previewTemplate = resolvedParams?.previewTemplate as string | undefined;
  const effectiveTheme = previewTemplate
    ? { ...theme, activeTemplateSlug: previewTemplate }
    : theme;

  const { PLPPage } = resolveTemplate(effectiveTheme.activeTemplateSlug);

  // Pass brand context via searchParams so PLPPage can render title, breadcrumbs & description
  const enrichedParams: Record<string, string | string[] | undefined> = {
    ...resolvedParams,
    brand:             brandName,
    _brandName:        brandName,
    _brandDescription: brand?.description || '',
    _brandSlug:        brand?.slug || slug,
    _brandLogo:        brand?.logo || '',
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
