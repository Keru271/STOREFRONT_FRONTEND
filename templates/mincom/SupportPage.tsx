'use client';

import MincomHeader from './Header';
import MincomFooter from './Footer';
import { SupportBody } from '@/components/shared/SupportBody';
import type { SupportPageProps } from '@/templates';

export default function MincomSupportPage({ theme }: SupportPageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf9] text-slate-900 font-sans antialiased">
      <MincomHeader />
      <SupportBody theme={theme} />
      <MincomFooter />
    </div>
  );
}
