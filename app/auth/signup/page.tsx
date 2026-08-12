// ─── Signup Page — /auth/signup ──────────────────────────────────────────────

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
  return <SignupPage theme={theme} />;
}
