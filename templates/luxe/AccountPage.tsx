'use client';
import LuxeHeader from './Header';
import LuxeFooter from './Footer';
import { AccountBody } from '@/components/shared/AccountBody';
import type { AccountPageProps } from '@/templates';

export default function LuxeAccountPage({ theme }: AccountPageProps) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--sf-bg)' }}>
      <LuxeHeader />
      <AccountBody theme={theme} />
      <LuxeFooter />
    </div>
  );
}
