'use client';

import LuxeHeader from './Header';
import LuxeFooter from './Footer';
import { SupportBody } from '@/components/shared/SupportBody';
import type { SupportPageProps } from '@/templates';

export default function LuxeSupportPage({ theme }: SupportPageProps) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--sf-bg)' }}>
      <LuxeHeader />
      <SupportBody theme={theme} />
      <LuxeFooter />
    </div>
  );
}
