'use client';

import DefaultHeader from './Header';
import DefaultFooter from './Footer';
import { SupportBody } from '@/components/shared/SupportBody';
import type { SupportPageProps } from '@/templates';

export default function DefaultSupportPage({ theme }: SupportPageProps) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--sf-bg)' }}>
      <DefaultHeader />
      <SupportBody theme={theme} />
      <DefaultFooter />
    </div>
  );
}
