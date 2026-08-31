'use client';
import LuxeHeader from './Header';
import LuxeFooter from './Footer';
import LuxeProductCard from './ProductCard';
import { PDPBody } from '@/components/shared/PDPBody';
import type { PDPPageProps } from '@/templates';

export default function LuxePDPPage({ theme, product, relatedProducts }: PDPPageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f6] dark:bg-[#0c0a09] text-stone-900 dark:text-stone-100 antialiased">
      <LuxeHeader />
      <PDPBody
        theme={theme}
        product={product}
        relatedProducts={relatedProducts}
        renderRelatedCard={(p) => <LuxeProductCard key={p.id} product={p} />}
      />
      <LuxeFooter />
    </div>
  );
}
