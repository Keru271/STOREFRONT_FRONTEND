'use client';
import LuxeHeader from './Header';
import LuxeFooter from './Footer';
import { CartBody } from '@/components/shared/CartBody';
import type { CartPageProps } from '@/templates';

export default function LuxeCartPage({ theme }: CartPageProps) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--sf-bg)' }}>
      <LuxeHeader />
      <CartBody theme={theme} />
      <LuxeFooter />
    </div>
  );
}
