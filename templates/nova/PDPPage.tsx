'use client';
import NovaHeader from './Header';
import NovaFooter from './Footer';
import NovaProductCard from './ProductCard';
import { PDPBody } from '@/components/shared/PDPBody';
import type { PDPPageProps } from '@/templates';

export default function NovaPDPPage({ theme, product, relatedProducts }: PDPPageProps) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--sf-bg)' }}>
      <NovaHeader />
      <PDPBody theme={theme} product={product} relatedProducts={relatedProducts} renderRelatedCard={(p) => <NovaProductCard key={p.id} product={p} />} />
      <NovaFooter />
    </div>
  );
}
