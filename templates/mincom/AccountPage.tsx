'use client';

import MincomHeader from './Header';
import MincomFooter from './Footer';
import { AccountBody } from '@/components/shared/AccountBody';
import type { AccountPageProps } from '@/templates';

export default function MincomAccountPage({ theme }: AccountPageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf9] text-slate-900">
      <MincomHeader />
      <AccountBody theme={theme} />
      <MincomFooter />
    </div>
  );
}
