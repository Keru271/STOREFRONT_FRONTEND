'use client';
import NovaHeader from './Header';
import NovaFooter from './Footer';
import { WishlistBody } from '@/components/shared/WishlistBody';
import type { WishlistPageProps } from '@/templates';

export default function NovaWishlistPage({ theme }: WishlistPageProps) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--sf-bg)' }}>
      <NovaHeader />
      <WishlistBody theme={theme} />
      <NovaFooter />
    </div>
  );
}
