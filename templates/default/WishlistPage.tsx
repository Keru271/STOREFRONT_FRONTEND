'use client';
import DefaultHeader from './Header';
import DefaultFooter from './Footer';
import { WishlistBody } from '@/components/shared/WishlistBody';
import type { WishlistPageProps } from '@/templates';

export default function DefaultWishlistPage({ theme }: WishlistPageProps) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--sf-bg)' }}>
      <DefaultHeader />
      <WishlistBody theme={theme} />
      <DefaultFooter />
    </div>
  );
}
