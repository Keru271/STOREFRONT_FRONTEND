'use client';

import TechnoHeader from './Header';
import TechnoFooter from './Footer';
import { WishlistBody } from '@/components/shared/WishlistBody';
import type { WishlistPageProps } from '@/templates';

export default function TechnoWishlistPage({ theme }: WishlistPageProps) {
  return (
    <div
      className="min-h-screen flex flex-col bg-[#FFFBF5] text-[#1C1917]"
      style={{ fontFamily: "'Open Sans', sans-serif" }}
    >
      <TechnoHeader />
      <WishlistBody theme={theme} />
      <TechnoFooter />
    </div>
  );
}
