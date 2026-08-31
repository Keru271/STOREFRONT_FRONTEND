'use client';
import NovaHeader from './Header';
import NovaFooter from './Footer';
import { CartBody } from '@/components/shared/CartBody';
import type { CartPageProps } from '@/templates';

export default function NovaCartPage({ theme }: CartPageProps) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: 'var(--sf-bg)', color: 'var(--sf-text)', fontFamily: 'var(--sf-body-font)' }}
    >
      <NovaHeader />
      <CartBody theme={theme} />
      <NovaFooter />
    </div>
  );
}
