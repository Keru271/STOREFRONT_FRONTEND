'use client';
import LuxeHeader from './Header';
import LuxeFooter from './Footer';
import { WishlistBody } from '@/components/shared/WishlistBody';
import type { WishlistPageProps } from '@/templates';

export default function LuxeWishlistPage({ theme }: WishlistPageProps) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--sf-bg)' }}>
      <LuxeHeader />
      <WishlistBody theme={theme} />
      <LuxeFooter />
    </div>
  );
}
