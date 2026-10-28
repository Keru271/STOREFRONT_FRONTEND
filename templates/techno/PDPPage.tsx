'use client';

import TechnoHeader from './Header';
import TechnoFooter from './Footer';
import TechnoProductCard from './ProductCard';
import { PDPBody } from '@/components/shared/PDPBody';
import type { PDPPageProps } from '@/templates';

export default function TechnoPDPPage({ theme, product, relatedProducts }: PDPPageProps) {
  return (
    <div
      className="min-h-screen flex flex-col bg-[#FFFBF5] text-[#1C1917] antialiased"
      style={{ fontFamily: "'Open Sans', sans-serif" }}
    >
      <TechnoHeader />
      <PDPBody
        theme={theme}
        product={product}
        relatedProducts={relatedProducts}
        renderRelatedCard={(p) => <TechnoProductCard key={p.id} product={p} />}
      />
      <TechnoFooter />
    </div>
  );
}
