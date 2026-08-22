// ─── Dynamic Sitemap — /sitemap.xml ──────────────────────────────────────────
// Generated at build time / ISR. Includes static pages + all products,
// collections, and categories fetched from the backend.

import type { MetadataRoute } from 'next';
import { getProducts } from '@/lib/api/products';
import { getCollections, getCategories } from '@/lib/api/catalog';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000');

export const revalidate = 3600; // Rebuild sitemap every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, collections, categories] = await Promise.all([
    getProducts({ limit: 1000 }),
    getCollections(),
    getCategories(),
  ]);

  const now = new Date();

  // ── Static routes ──────────────────────────────────────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/products`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/collections`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/cart`,
      lastModified: now,
      changeFrequency: 'never',
      priority: 0.3,
    },
  ];

  // ── Product routes ─────────────────────────────────────────────────────────
  const productRoutes: MetadataRoute.Sitemap = products
    .filter((p) => p.status === 'ACTIVE' || p.status === 'active')
    .map((product) => ({
      url: `${SITE_URL}/products/${product.urlSlug || product.id}`,
      lastModified: product.createdAt ? new Date(product.createdAt) : now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

  // ── Collection routes ──────────────────────────────────────────────────────
  const collectionRoutes: MetadataRoute.Sitemap = collections.map((c) => ({
    url: `${SITE_URL}/collections/${c.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.75,
  }));

  // ── Category filter routes ─────────────────────────────────────────────────
  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${SITE_URL}/products?category=${c.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...productRoutes,
    ...collectionRoutes,
    ...categoryRoutes,
  ];
}
