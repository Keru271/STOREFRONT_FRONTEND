// ─── Wishlist — /wishlist ─────────────────────────────────────────────────────
// Server Component shell. Fetches theme and delegates to the active template's
// WishlistPage (which is a Client Component wrapping the shared WishlistBody).

import type { Metadata } from 'next';
import { getTheme } from '@/lib/api/theme';
import { resolveTemplate } from '@/templates';

export async function generateMetadata(): Promise<Metadata> {
  const theme = await getTheme();
  return {
    title: `My Wishlist — ${theme.storeName}`,
    description: `Your saved items at ${theme.storeName}.`,
    robots: { index: false, follow: false },
  };
}

export default async function WishlistPage() {
  const theme = await getTheme();
  const { WishlistPage: TemplateWishlistPage } = resolveTemplate(theme.activeTemplateSlug);

  return <TemplateWishlistPage theme={theme} />;
}
