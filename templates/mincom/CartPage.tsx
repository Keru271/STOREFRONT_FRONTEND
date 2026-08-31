'use client';

import MincomHeader from './Header';
import MincomFooter from './Footer';
import { CartBody } from '@/components/shared/CartBody';
import type { CartPageProps } from '@/templates';

export default function MincomCartPage({ theme }: CartPageProps) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: 'var(--sf-bg)', color: 'var(--sf-text)', fontFamily: 'var(--sf-body-font)' }}
    >
      <MincomHeader />
      <CartBody theme={theme} />
      <MincomFooter />
    </div>
  );
}
