'use client';

import MincomHeader from './Header';
import MincomFooter from './Footer';
import { CartBody } from '@/components/shared/CartBody';
import type { CartPageProps } from '@/templates';

export default function MincomCartPage({ theme }: CartPageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf9] text-slate-900">
      <MincomHeader />
      <CartBody theme={theme} />
      <MincomFooter />
    </div>
  );
}
