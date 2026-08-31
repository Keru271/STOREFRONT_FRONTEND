'use client';
import MinimalHeader from './Header';
import MinimalFooter from './Footer';
import MinimalProductCard from './ProductCard';
import { PDPBody } from '@/components/shared/PDPBody';
import type { PDPPageProps } from '@/templates';

export default function MinimalPDPPage({ theme, product, relatedProducts }: PDPPageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-black dark:text-white antialiased font-sans">
      <MinimalHeader />
      <PDPBody
        theme={theme}
        product={product}
        relatedProducts={relatedProducts}
        renderRelatedCard={(p) => <MinimalProductCard key={p.id} product={p} />}
      />
      <MinimalFooter />
    </div>
  );
}
