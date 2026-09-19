// ─── Login Page — /auth/login ─────────────────────────────────────────────────

import { Suspense } from 'react';
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

  console.log({ theme });
  const { LoginPage } = resolveTemplate(theme.activeTemplateSlug);
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginPage theme={theme} />
    </Suspense>
  );
}
