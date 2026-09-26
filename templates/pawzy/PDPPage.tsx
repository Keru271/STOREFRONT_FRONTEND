'use client';

import React from 'react';
import PawzyHeader from './Header';
import PawzyFooter from './Footer';
import PawzyProductCard from './ProductCard';
import { PDPBody } from '@/components/shared/PDPBody';
import type { PDPPageProps } from '@/templates';

export default function PawzyPDPPage({ theme, product, relatedProducts }: PDPPageProps) {
  return (
    <div
      className="min-h-screen flex flex-col bg-white text-[#1f2937] antialiased"
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >
      <PawzyHeader />
      <PDPBody
        theme={theme}
        product={product}
        relatedProducts={relatedProducts}
        renderRelatedCard={(p) => <PawzyProductCard key={p.id} product={p} />}
      />
      <PawzyFooter />
    </div>
  );
}
