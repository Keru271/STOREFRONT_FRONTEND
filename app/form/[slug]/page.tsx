import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTheme } from '@/lib/api/theme';
import { getStorefrontForm } from '@/lib/api/forms';
import { StorefrontFormRenderer } from '@/components/shared/StorefrontFormRenderer';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const [theme, form] = await Promise.all([
    getTheme(),
    getStorefrontForm(slug),
  ]);

  if (!form) {
    return {
      title: `Form Not Found — ${theme.storeName}`,
    };
  }

  return {
    title: `${form.title} | ${theme.storeName}`,
    description: form.description || `Fill out ${form.title} on ${theme.storeName}.`,
  };
}

export default async function StorefrontFormPage({ params }: PageProps) {
  const { slug } = await params;
  const form = await getStorefrontForm(slug);

  if (!form) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12 sm:py-16 max-w-2xl">
      <StorefrontFormRenderer form={form} />
    </div>
  );
}
