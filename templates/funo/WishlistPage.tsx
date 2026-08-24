'use client';

import React from 'react';
import FunoHeader from './Header';
import FunoFooter from './Footer';
import { WishlistBody } from '@/components/shared/WishlistBody';
import type { WishlistPageProps } from '@/templates';

export default function FunoWishlistPage({ theme }: WishlistPageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdfdfd] text-slate-900">
      <FunoHeader />
      <WishlistBody theme={theme} />
      <FunoFooter />
    </div>
  );
}
