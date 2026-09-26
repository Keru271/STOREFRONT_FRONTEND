'use client';

import React from 'react';
import DemoHeader from './Header';
import DemoFooter from './Footer';
import DemoProductCard from './ProductCard';
import { PDPBody } from '@/components/shared/PDPBody';
import type { PDPPageProps } from '@/templates';

export default function DemoPDPPage({ theme, product, relatedProducts }: PDPPageProps) {
  return (
    <div
      className="min-h-screen flex flex-col bg-[#fbfaf8] dark:bg-[#0f172a] text-slate-900 dark:text-white antialiased font-sans"
      style={{ fontFamily: "'Jost', sans-serif" }}
    >
      <DemoHeader />
      <PDPBody
        theme={theme}
        product={product}
        relatedProducts={relatedProducts}
        renderRelatedCard={(p) => <DemoProductCard key={p.id} product={p} />}
      />
      <DemoFooter />
    </div>
  );
}
