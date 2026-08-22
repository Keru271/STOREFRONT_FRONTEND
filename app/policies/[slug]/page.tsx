// ─── CMS Store Policies Route — /policies/[slug] ────────────────────────────
// Dynamic server component that fetches and renders policy pages from the CMS.

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTheme } from '@/lib/api/theme';
import { getPage } from '@/lib/api/catalog';
import { CmsPageRenderer } from '@/components/shared/CmsPageRenderer';

interface PolicyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PolicyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const [theme, page] = await Promise.all([
    getTheme(),
    getPage(`policies/${slug}`),
  ]);

  if (!page) {
    return {
      title: `Policy — ${theme.storeName}`,
    };
  }

  const title = page.metaTitle || page.title;
  const description = page.metaDescription || `Read ${page.title} on ${theme.storeName}.`;
  const ogTitle = page.ogTitle || title;
  const ogDescription = page.ogDescription || description;
  const ogImage = page.ogImage || theme.logo || undefined;

  return {
    title: `${title} | ${theme.storeName}`,
    description,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      siteName: theme.storeName,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function PolicyPage({ params }: PolicyPageProps) {
  const { slug } = await params;
  const [theme, page] = await Promise.all([
    getTheme(),
    getPage(`policies/${slug}`),
  ]);

  if (!page) {
    notFound();
  }

  return <CmsPageRenderer page={page} theme={theme} />;
}
