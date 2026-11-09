'use client';

import React from 'react';
import FurnitureHeader from './Header';
import FurnitureFooter from './Footer';
import { ForgotPasswordBody } from '@/components/shared/ForgotPasswordBody';
import type { ThemeConfig } from '@/lib/api/types';

export default function FurnitureForgotPasswordPage({ theme }: { theme: ThemeConfig }) {
  return (
    <div
      className="min-h-screen flex flex-col bg-[#faf9f6] text-[#1a1c1a] antialiased"
      style={{ fontFamily: 'var(--font-plus-jakarta, sans-serif)' }}
    >
      <FurnitureHeader />
      <main className="flex-1 flex items-center justify-center p-4 pt-32 pb-16">
        <ForgotPasswordBody
          theme={theme}
          cardClassName="!bg-white !text-[#1a1c1a] !border-[#e3e2e0] !rounded-2xl !shadow-sm !border"
          buttonClassName="!bg-[#040505] !text-white !hover:bg-[#466557] !rounded-lg font-medium"
          inputClassName="!bg-white !border !border-[#e3e2e0] !text-[#1a1c1a] !placeholder:text-[#747878] !focus:border-[#466557] !rounded-lg"
        />
      </main>
      <FurnitureFooter />
    </div>
  );
}

