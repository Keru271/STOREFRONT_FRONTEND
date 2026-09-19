'use client';

import MinimalHeader from './Header';
import MinimalFooter from './Footer';
import { SupportBody } from '@/components/shared/SupportBody';
import type { SupportPageProps } from '@/templates';

export default function MinimalSupportPage({ theme }: SupportPageProps) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--sf-bg)' }}>
      <MinimalHeader />
      <SupportBody theme={theme} />
      <MinimalFooter />
    </div>
  );
}
