'use client';

import LuxeHeader from './Header';
import LuxeFooter from './Footer';
import { ForgotPasswordBody } from '@/components/shared/ForgotPasswordBody';
import type { ThemeConfig } from '@/lib/api/types';

export default function LuxeForgotPasswordPage({ theme }: { theme: ThemeConfig }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0e1014] text-[#f4eee6]">
      <LuxeHeader />
      <main className="flex-1 flex items-center justify-center p-4">
        <ForgotPasswordBody
          theme={theme}
          cardClassName="!bg-[#14171d] !text-[#f4eee6] !border-[#c5a880]/40 !shadow-2xl !rounded-none font-light"
          buttonClassName="!bg-[#c5a880] !hover:bg-[#d5ba94] !text-[#0e1014] uppercase !tracking-[0.25em] !font-normal !rounded-none"
          inputClassName="!bg-[#0e1014] !border-[#c5a880]/30 !text-[#f4eee6] !placeholder:text-slate-600 !focus:border-[#c5a880] !rounded-none"
        />
      </main>
      <LuxeFooter />
    </div>
  );
}
