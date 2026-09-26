'use client';

import React from 'react';
import DemoHeader from './Header';
import DemoFooter from './Footer';
import { WishlistBody } from '@/components/shared/WishlistBody';
import type { WishlistPageProps } from '@/templates';

export default function DemoWishlistPage({ theme }: WishlistPageProps) {
  return (
    <div
      className="min-h-screen flex flex-col bg-[#fdfdfd] text-slate-900"
      style={{ fontFamily: "'Jost', sans-serif" }}
    >
      <DemoHeader />
      <WishlistBody theme={theme} />
      <DemoFooter />
    </div>
  );
}
