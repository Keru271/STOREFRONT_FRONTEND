'use client';

import React from 'react';
import FurnitureHeader from './Header';
import FurnitureFooter from './Footer';
import FurnitureProductCard from './ProductCard';
import { PDPBody } from '@/components/shared/PDPBody';
import type { PDPPageProps } from '@/templates';

export default function FurniturePDPPage({ theme, product, relatedProducts }: PDPPageProps) {
  return (
    <div
      className="min-h-screen flex flex-col bg-[#faf9f6] text-[#1a1c1a] antialiased"
      style={{ fontFamily: 'var(--font-plus-jakarta, sans-serif)' }}
    >
      <FurnitureHeader />
      <div className="pt-24 flex-1">
        <PDPBody
          theme={theme}
          product={product}
          relatedProducts={relatedProducts}
          renderRelatedCard={(p) => <FurnitureProductCard key={p.id} product={p} />}
        />
      </div>
      <FurnitureFooter />
    </div>
  );
}

