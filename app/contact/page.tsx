// ─── Contact Us — /contact ────────────────────────────────────────────────
// Server Component shell for Contact & Customer Support. Delegates to the active
// template's SupportPage.

import type { Metadata } from 'next';
import { getTheme } from '@/lib/api/theme';
import { resolveTemplate } from '@/templates';

export async function generateMetadata(): Promise<Metadata> {
  const theme = await getTheme();
  return {
    title: `Contact Us & Concierge — ${theme.storeName}`,
    description: `Get in touch with the ${theme.storeName} team. Reach us via email, phone, or submit an inquiry.`,
    openGraph: {
      title: `Contact Us — ${theme.storeName}`,
      description: `Get in touch with the ${theme.storeName} customer support team.`,
    },
  };
}

export default async function ContactPage() {
  const theme = await getTheme();
  const { SupportPage: TemplateSupportPage } = resolveTemplate(theme.activeTemplateSlug);

  return <TemplateSupportPage theme={theme} />;
}
