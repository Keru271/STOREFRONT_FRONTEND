'use client';

import FunoHeader from './Header';
import FunoFooter from './Footer';
import { SupportBody } from '@/components/shared/SupportBody';
import type { SupportPageProps } from '@/templates';

export default function FunoSupportPage({ theme }: SupportPageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbfb] text-slate-900 font-sans antialiased">
      <FunoHeader />
      <SupportBody theme={theme} />
      <FunoFooter />
    </div>
  );
}
