'use client';

import TechnoHeader from './Header';
import TechnoFooter from './Footer';
import { SupportBody } from '@/components/shared/SupportBody';
import type { SupportPageProps } from '@/templates';

export default function TechnoSupportPage({ theme }: SupportPageProps) {
  return (
    <div
      className="min-h-screen flex flex-col bg-[#FFFBF5] text-[#1C1917] antialiased"
      style={{ fontFamily: "'Open Sans', sans-serif" }}
    >
      <TechnoHeader />
      <SupportBody theme={theme} />
      <TechnoFooter />
    </div>
  );
}
