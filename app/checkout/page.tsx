// ─── Express Checkout — /checkout ─────────────────────────────────────────────
// Server Component shell. Fetches active theme from CMS and delegates rendering to
// CheckoutClient with full CMS rules (Razorpay, Stripe, COD, Taxes, Free Shipping, Guest Checkout).

import type { Metadata } from 'next';
import { getTheme } from '@/lib/api/theme';
import CheckoutClient from './CheckoutClient';

export async function generateMetadata(): Promise<Metadata> {
  const theme = await getTheme();
  return {
    title: `Express Checkout — ${theme.storeName}`,
    description: `Complete your secure order with fast shipping and encrypted payment at ${theme.storeName}.`,
    robots: { index: false, follow: false },
  };
}

interface CheckoutPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const resolvedParams = await searchParams;
  const previewTemplate = resolvedParams?.previewTemplate as string | undefined;

  const theme = await getTheme();
  const effectiveTheme = previewTemplate
    ? { ...theme, activeTemplateSlug: previewTemplate }
    : theme;

  return <CheckoutClient theme={effectiveTheme} />;
}
