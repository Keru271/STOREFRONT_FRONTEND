'use client';

import MinimalHeader from './Header';
import MinimalFooter from './Footer';
import { ForgotPasswordBody } from '@/components/shared/ForgotPasswordBody';
import type { ThemeConfig } from '@/lib/api/types';

export default function MinimalForgotPasswordPage({ theme }: { theme: ThemeConfig }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#ffffff] text-black">
      <MinimalHeader />
      <main className="flex-1 flex items-center justify-center p-4 font-mono text-xs">
        <ForgotPasswordBody
          theme={theme}
          cardClassName="!bg-white !text-black !border-2 !border-black !shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] !rounded-none"
          buttonClassName="!bg-black !text-white !hover:bg-neutral-800 uppercase !font-bold !rounded-none !shadow-none"
          inputClassName="!bg-white !border-2 !border-black !text-black !rounded-none"
        />
      </main>
      <MinimalFooter />
    </div>
  );
}
