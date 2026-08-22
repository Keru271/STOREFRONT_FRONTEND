// ─── Product Detail — /products/[slug] ───────────────────────────────────────
// Server Component. Fetches product + related products, then delegates rendering
// to the active template's PDPPage.

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductDetail, getProducts } from '@/lib/api/products';
import { getTheme } from '@/lib/api/theme';
import { resolveTemplate } from '@/templates';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const [product, theme] = await Promise.all([getProductDetail(slug), getTheme()]);

  if (!product) {
    return { title: 'Product Not Found' };
  }

  return {
    title: product.metaTitle || product.name,
    description:
      product.metaDescription ||
      product.description ||
      `Buy ${product.name} at ${theme.storeName}`,
    openGraph: {
      title: product.name,
      description: product.description || '',
      images:
        product.images.length > 0
          ? [{ url: product.images[0] }]
          : product.image
          ? [{ url: product.image }]
          : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const [theme, product, allProducts] = await Promise.all([
    getTheme(),
    getProductDetail(slug),
    getProducts({ limit: 8 }),
  ]);

  if (!product) {
    notFound();
  }

  // Pick related products: same category first, exclude current
  const related = allProducts
    .filter((p) => p.id !== product.id && (product.categoryName ? p.categoryName === product.categoryName : true))
    .slice(0, 4)
    .concat(
      allProducts.filter((p) => p.id !== product.id && p.categoryName !== product.categoryName).slice(0, 4)
    )
    .slice(0, 4);

  const { PDPPage } = resolveTemplate(theme.activeTemplateSlug);

  return <PDPPage theme={theme} product={product} relatedProducts={related} />;
}
