// ─── Customer Account — /account ─────────────────────────────────────────────
// Server Component shell. Fetches active theme and delegates rendering to the
// active template's AccountPage component.

import type { Metadata } from 'next';
import { getTheme } from '@/lib/api/theme';
import { resolveTemplate } from '@/templates';

export async function generateMetadata(): Promise<Metadata> {
  const theme = await getTheme();
  return {
    title: `My Account — ${theme.storeName}`,
    description: `Manage your profile, order history, and account settings at ${theme.storeName}.`,
    robots: { index: false, follow: false },
  };
}

export default async function AccountPage() {
  const theme = await getTheme();
  const { AccountPage: TemplateAccountPage } = resolveTemplate(theme.activeTemplateSlug);

  return <TemplateAccountPage theme={theme} />;
}
