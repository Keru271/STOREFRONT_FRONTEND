// ─── Shopping Cart — /cart ───────────────────────────────────────────────────
// Server Component shell. Fetches active theme and delegates rendering to the
// active template's CartPage component.

import type { Metadata } from 'next';
import { getTheme } from '@/lib/api/theme';
import { resolveTemplate } from '@/templates';

export async function generateMetadata(): Promise<Metadata> {
  const theme = await getTheme();
  return {
    title: `Shopping Bag — ${theme.storeName}`,
    description: `Review your shopping bag and proceed to checkout at ${theme.storeName}.`,
    robots: { index: false, follow: false },
  };
}

export default async function CartPage() {
  const theme = await getTheme();
  const { CartPage: TemplateCartPage } = resolveTemplate(theme.activeTemplateSlug);

  return <TemplateCartPage theme={theme} />;
}
