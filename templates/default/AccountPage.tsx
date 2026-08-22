'use client';
import DefaultHeader from './Header';
import DefaultFooter from './Footer';
import { AccountBody } from '@/components/shared/AccountBody';
import type { AccountPageProps } from '@/templates';

export default function DefaultAccountPage({ theme }: AccountPageProps) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--sf-bg)' }}>
      <DefaultHeader />
      <AccountBody theme={theme} />
      <DefaultFooter />
    </div>
  );
}
