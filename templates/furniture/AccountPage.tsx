'use client';

import React from 'react';
import FurnitureHeader from './Header';
import FurnitureFooter from './Footer';
import { AccountBody } from '@/components/shared/AccountBody';
import type { AccountPageProps } from '@/templates';

export default function FurnitureAccountPage({ theme }: AccountPageProps) {
  return (
    <div
      className="min-h-screen flex flex-col bg-[#faf9f6] text-[#1a1c1a]"
      style={{ fontFamily: 'var(--font-plus-jakarta, sans-serif)' }}
    >
      <FurnitureHeader />
      <div className="pt-28 flex-1">
        <AccountBody theme={theme} />
      </div>
      <FurnitureFooter />
    </div>
  );
}

