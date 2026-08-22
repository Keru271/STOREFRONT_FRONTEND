'use client';
import MinimalHeader from './Header';
import MinimalFooter from './Footer';
import { CartBody } from '@/components/shared/CartBody';
import type { CartPageProps } from '@/templates';

export default function MinimalCartPage({ theme }: CartPageProps) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--sf-bg)' }}>
      <MinimalHeader />
      <CartBody theme={theme} />
      <MinimalFooter />
    </div>
  );
}
