'use client';

import React from 'react';
import FurnitureHeader from './Header';
import FurnitureFooter from './Footer';
import { SupportBody } from '@/components/shared/SupportBody';
import type { SupportPageProps } from '@/templates';

export default function FurnitureSupportPage({ theme }: SupportPageProps) {
  return (
    <div
      className="min-h-screen flex flex-col bg-[#faf9f6] text-[#1a1c1a] antialiased"
      style={{ fontFamily: 'var(--font-plus-jakarta, sans-serif)' }}
    >
      <FurnitureHeader />
      <div className="pt-28 flex-1">
        <SupportBody theme={theme} />
      </div>
      <FurnitureFooter />
    </div>
  );
}

