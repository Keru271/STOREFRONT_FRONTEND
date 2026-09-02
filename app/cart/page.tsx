// ─── Shopping Cart — /cart ───────────────────────────────────────────────────
// Server Component shell. Fetches active theme and delegates rendering to the
// active template's CartPage component.

import type { Metadata } from 'next';
import { getTheme } from '@/lib/api/theme';
import CommonCartPage from '@/components/cart/CommonCartPage';

export async function generateMetadata(): Promise<Metadata> {
  const theme = await getTheme();
  return {
    title: `Shopping Cart — ${theme.storeName}`,
    description: `Review your shopping cart and proceed to checkout at ${theme.storeName}.`,
    robots: { index: false, follow: false },
  };
}

interface CartPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CartPage({ searchParams }: CartPageProps) {
  const resolvedParams = await searchParams;
  const previewTemplate = resolvedParams?.previewTemplate as string | undefined;

  const theme = await getTheme();
  const effectiveTheme = previewTemplate
    ? { ...theme, activeTemplateSlug: previewTemplate }
    : theme;

  return <CommonCartPage theme={effectiveTheme} />;
}

