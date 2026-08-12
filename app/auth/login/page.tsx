// ─── Login Page — /auth/login ─────────────────────────────────────────────────

import type { Metadata } from 'next';
import { getTheme } from '@/lib/api/theme';
import { resolveTemplate } from '@/templates';

export async function generateMetadata(): Promise<Metadata> {
  const theme = await getTheme();
  return {
    title: `Sign In`,
    description: `Sign in to your ${theme.storeName} account.`,
  };
}

export default async function LoginPage() {
  const theme = await getTheme();
  const { LoginPage } = resolveTemplate(theme.activeTemplateSlug);
  return <LoginPage theme={theme} />;
}
