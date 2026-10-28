'use client';

import TechnoHeader from './Header';
import TechnoFooter from './Footer';
import { AccountBody } from '@/components/shared/AccountBody';
import type { AccountPageProps } from '@/templates';

export default function TechnoAccountPage({ theme }: AccountPageProps) {
  return (
    <div
      className="min-h-screen flex flex-col bg-[#FFFBF5] text-[#1C1917]"
      style={{ fontFamily: "'Open Sans', sans-serif" }}
    >
      <TechnoHeader />
      <AccountBody theme={theme} />
      <TechnoFooter />
    </div>
  );
}
