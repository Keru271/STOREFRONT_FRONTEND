'use client';

import React from 'react';
import PawzyHeader from './Header';
import PawzyFooter from './Footer';
import { WishlistBody } from '@/components/shared/WishlistBody';
import type { WishlistPageProps } from '@/templates';

export default function PawzyWishlistPage({ theme }: WishlistPageProps) {
  return (
    <div
      className="min-h-screen flex flex-col bg-[#fdfdfd] text-[#1f2937]"
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >
      <PawzyHeader />
      <WishlistBody theme={theme} />
      <PawzyFooter />
    </div>
  );
}
