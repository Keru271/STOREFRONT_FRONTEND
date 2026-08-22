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

export default async function CheckoutPage() {
  const theme = await getTheme();

  return <CheckoutClient theme={theme} />;
}
