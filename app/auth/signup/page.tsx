// ─── Signup Page — /auth/signup ──────────────────────────────────────────────

import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getTheme } from '@/lib/api/theme';
import { resolveTemplate } from '@/templates';

export async function generateMetadata(): Promise<Metadata> {
  const theme = await getTheme();
  return {
    title: `Create Account`,
    description: `Join ${theme.storeName} and unlock exclusive member benefits.`,
  };
}

export default async function SignupPage() {
  const theme = await getTheme();
  const { SignupPage } = resolveTemplate(theme.activeTemplateSlug);
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SignupPage theme={theme} />
    </Suspense>
  );
}
