'use client';

import NovaHeader from './Header';
import NovaFooter from './Footer';
import { ForgotPasswordBody } from '@/components/shared/ForgotPasswordBody';
import type { ThemeConfig } from '@/lib/api/types';

export default function NovaForgotPasswordPage({ theme }: { theme: ThemeConfig }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f7] text-[#1d1d1f]">
      <NovaHeader />
      <main className="flex-1 flex items-center justify-center p-4">
        <ForgotPasswordBody
          theme={theme}
          cardClassName="!bg-white/80 !backdrop-blur-xl !border-slate-200/80 !shadow-[0_20px_40px_rgba(0,0,0,0.06)] !rounded-[28px]"
          buttonClassName="!bg-[#0071e3] !hover:bg-[#0077ed] !text-white font-medium !rounded-full"
          inputClassName="!bg-[#f5f5f7] !border-transparent !focus:bg-white !focus:border-[#0071e3] !rounded-xl text-slate-900"
        />
      </main>
      <NovaFooter />
    </div>
  );
}
