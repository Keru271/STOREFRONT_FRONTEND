// ─── CMS Custom Pages Route — /pages/[slug] ─────────────────────────────────
// Dynamic server component that fetches and renders custom pages from the CMS.

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTheme } from '@/lib/api/theme';
import { getPage } from '@/lib/api/catalog';
import { CmsPageRenderer } from '@/components/shared/CmsPageRenderer';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const [theme, page] = await Promise.all([
    getTheme(),
    getPage(slug),
  ]);

  if (!page) {
    return {
      title: `Page Not Found — ${theme.storeName}`,
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
    alternates: page.canonicalUrl ? { canonical: page.canonicalUrl } : undefined,
  };
}

export default async function DynamicCmsPage({ params }: PageProps) {
  const { slug } = await params;
  const [theme, page] = await Promise.all([
    getTheme(),
    getPage(slug),
  ]);

  if (!page) {
    notFound();
  }

  return <CmsPageRenderer page={page} theme={theme} />;
}
