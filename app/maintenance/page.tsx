import { getTheme } from '@/lib/api/theme';
import { resolveTemplate } from '@/templates';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const theme = await getTheme();
  return {
    title: `Maintenance Mode | ${theme.storeName}`,
    description: theme.maintenanceMessage || 'Store maintenance in progress.',
  };
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function MaintenancePreviewPage() {
  const theme = await getTheme();
  const { MaintenancePage } = resolveTemplate(theme.activeTemplateSlug);

  return <MaintenancePage theme={theme} />;
}
