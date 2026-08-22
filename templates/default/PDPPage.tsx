'use client';
import DefaultHeader from './Header';
import DefaultFooter from './Footer';
import DefaultProductCard from './ProductCard';
import { PDPBody } from '@/components/shared/PDPBody';
import type { PDPPageProps } from '@/templates';

export default function DefaultPDPPage({ theme, product, relatedProducts }: PDPPageProps) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--sf-bg)' }}>
      <DefaultHeader />
      <PDPBody theme={theme} product={product} relatedProducts={relatedProducts} renderRelatedCard={(p) => <DefaultProductCard key={p.id} product={p} />} />
      <DefaultFooter />
    </div>
  );
}
