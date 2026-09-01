// ─── Homepage (/) ─────────────────────────────────────────────────────────────
// Server Component — fetches all data, resolves template, delegates rendering.

import { getTheme } from '@/lib/api/theme';
import { getProducts } from '@/lib/api/products';
import { getCollections, getCategories } from '@/lib/api/catalog';
import { resolveTemplate } from '@/templates';

interface HomePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedParams = await searchParams;
  const previewTemplate = resolvedParams?.previewTemplate as string | undefined;

  const [theme, products, collections, categories] = await Promise.all([
    getTheme(),
    getProducts({ limit: 12 }),
    getCollections(),
    getCategories(),
  ]);

  // Allow CMS to preview any template via ?previewTemplate=<slug> without publishing
  const effectiveTheme = previewTemplate
    ? { ...theme, activeTemplateSlug: previewTemplate }
    : theme;

  const { HomePage } = resolveTemplate(effectiveTheme.activeTemplateSlug);

  return (
    <HomePage
      theme={effectiveTheme}
      products={products}
      collections={collections}
      categories={categories}
    />
  );
}

