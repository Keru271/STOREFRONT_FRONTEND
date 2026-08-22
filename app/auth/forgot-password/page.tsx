// ─── Forgot Password Page — /auth/forgot-password ──────────────────────────────

import type { Metadata } from 'next';
import { getTheme } from '@/lib/api/theme';
import { resolveTemplate } from '@/templates';

export async function generateMetadata(): Promise<Metadata> {
  const theme = await getTheme();
  return {
    title: `Forgot Password — ${theme.storeName}`,
    description: `Reset your password with OTP verification at ${theme.storeName}.`,
    robots: { index: false, follow: false },
  };
}

export default async function ForgotPasswordPage() {
  const theme = await getTheme();
  const { ForgotPasswordPage: TemplateForgotPasswordPage } = resolveTemplate(theme.activeTemplateSlug);
  return <TemplateForgotPasswordPage theme={theme} />;
}
