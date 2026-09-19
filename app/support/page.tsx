// ─── Customer Support — /support ──────────────────────────────────────────
// Server Component shell. Fetches theme and delegates to the active template's
// SupportPage (which is a Client Component wrapping the shared SupportBody).

import type { Metadata } from 'next';
import { getTheme } from '@/lib/api/theme';
import { resolveTemplate } from '@/templates';

export async function generateMetadata(): Promise<Metadata> {
  const theme = await getTheme();
  return {
    title: `Customer Support & Help Center — ${theme.storeName}`,
    description: `Need assistance? Contact the ${theme.storeName} customer care concierge, track orders, or explore frequently asked questions.`,
    openGraph: {
      title: `Customer Support — ${theme.storeName}`,
      description: `Need assistance? Contact the ${theme.storeName} customer care concierge.`,
    },
  };
}

export default async function SupportPage() {
  const theme = await getTheme();
  const { SupportPage: TemplateSupportPage } = resolveTemplate(theme.activeTemplateSlug);

  return <TemplateSupportPage theme={theme} />;
}
