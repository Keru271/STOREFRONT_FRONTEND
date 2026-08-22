'use client';

import MincomHeader from './Header';
import MincomFooter from './Footer';
import { ForgotPasswordBody } from '@/components/shared/ForgotPasswordBody';
import type { ThemeConfig } from '@/lib/api/types';

export default function MincomForgotPasswordPage({ theme }: { theme: ThemeConfig }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#1e2225] text-white selection:bg-amber-400 selection:text-slate-950">
      <MincomHeader />
      <main className="flex-1 flex items-center justify-center p-4">
        <ForgotPasswordBody
          theme={theme}
          cardClassName="!bg-[#23272a] !text-white !border-slate-700 !shadow-2xl"
          buttonClassName="!bg-amber-400 !text-slate-950 !hover:bg-amber-300 font-black"
          inputClassName="!bg-slate-900 !border-slate-700 !text-white !placeholder:text-slate-500 !focus:border-amber-400"
        />
      </main>
      <MincomFooter />
    </div>
  );
}
