'use client';
import FunoHeader from './Header';
import FunoFooter from './Footer';
import FunoProductCard from './ProductCard';
import { PDPBody } from '@/components/shared/PDPBody';
import type { PDPPageProps } from '@/templates';

export default function FunoPDPPage({ theme, product, relatedProducts }: PDPPageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf8] dark:bg-[#0f172a] text-slate-900 dark:text-white antialiased font-sans">
      <FunoHeader />
      <PDPBody
        theme={theme}
        product={product}
        relatedProducts={relatedProducts}
        renderRelatedCard={(p) => <FunoProductCard key={p.id} product={p} />}
      />
      <FunoFooter />
    </div>
  );
}
