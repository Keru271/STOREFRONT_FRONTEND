'use client';

import MincomHeader from './Header';
import MincomFooter from './Footer';
import { WishlistBody } from '@/components/shared/WishlistBody';
import type { WishlistPageProps } from '@/templates';

export default function MincomWishlistPage({ theme }: WishlistPageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf9] text-slate-900">
      <MincomHeader />
      <WishlistBody theme={theme} />
      <MincomFooter />
    </div>
  );
}
