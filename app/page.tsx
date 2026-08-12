// ─── Homepage (/) ─────────────────────────────────────────────────────────────
// Server Component — fetches all data, resolves template, delegates rendering.

import { getTheme } from '@/lib/api/theme';
import { getProducts } from '@/lib/api/products';
import { getCollections, getCategories } from '@/lib/api/catalog';
import { resolveTemplate } from '@/templates';

export default async function HomePage() {
  const [theme, products, collections, categories] = await Promise.all([
    getTheme(),
    getProducts({ limit: 12 }),
    getCollections(),
    getCategories(),
  ]);

  const { HomePage } = resolveTemplate(theme.activeTemplateSlug);

  return (
    <HomePage
      theme={theme}
      products={products}
      collections={collections}
      categories={categories}
    />
  );
}
