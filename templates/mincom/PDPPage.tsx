'use client';
import MincomHeader from './Header';
import MincomFooter from './Footer';
import MincomProductCard from './ProductCard';
import { PDPBody } from '@/components/shared/PDPBody';
import type { PDPPageProps } from '@/templates';

export default function MincomPDPPage({ theme, product, relatedProducts }: PDPPageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#18181b] text-slate-900 dark:text-slate-100 antialiased font-sans">
      <MincomHeader />
      <PDPBody
        theme={theme}
        product={product}
        relatedProducts={relatedProducts}
        renderRelatedCard={(p) => <MincomProductCard key={p.id} product={p} />}
      />
      <MincomFooter />
    </div>
  );
}
