'use client';
import MinimalHeader from './Header';
import MinimalFooter from './Footer';
import { WishlistBody } from '@/components/shared/WishlistBody';
import type { WishlistPageProps } from '@/templates';

export default function MinimalWishlistPage({ theme }: WishlistPageProps) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--sf-bg)' }}>
      <MinimalHeader />
      <WishlistBody theme={theme} />
      <MinimalFooter />
    </div>
  );
}
