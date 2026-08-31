'use client';
import DefaultHeader from './Header';
import DefaultFooter from './Footer';
import { CartBody } from '@/components/shared/CartBody';
import type { CartPageProps } from '@/templates';

export default function DefaultCartPage({ theme }: CartPageProps) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: 'var(--sf-bg)', color: 'var(--sf-text)', fontFamily: 'var(--sf-body-font)' }}
    >
      <DefaultHeader />
      <CartBody theme={theme} />
      <DefaultFooter />
    </div>
  );
}
