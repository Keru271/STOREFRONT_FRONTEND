'use client';

import TechnoHeader from './Header';
import TechnoFooter from './Footer';
import { ForgotPasswordBody } from '@/components/shared/ForgotPasswordBody';
import type { ThemeConfig } from '@/lib/api/types';

export default function TechnoForgotPasswordPage({ theme }: { theme: ThemeConfig }) {
  return (
    <div
      className="min-h-screen flex flex-col bg-[#FFFBF5] text-[#1C1917] antialiased"
      style={{ fontFamily: "'Open Sans', sans-serif" }}
    >
      <TechnoHeader />
      <main className="flex-1 flex items-center justify-center p-4 py-16">
        <ForgotPasswordBody
          theme={theme}
          cardClassName="!bg-white !text-[#1C1917] !border-[#E7E5E4] !rounded-[8px] !shadow-none !border"
          buttonClassName="!bg-[#C2410C] !text-white !hover:bg-[#9A3412] !rounded-[4px] font-semibold !border !border-[#C2410C]"
          inputClassName="!bg-white !border-[1.5px] !border-[#D6D3D1] !text-[#1C1917] !placeholder:text-[#A8A29E] !focus:border-[#C2410C] !rounded-[4px]"
        />
      </main>
      <TechnoFooter />
    </div>
  );
}
