'use client';
import MinimalHeader from './Header';
import MinimalFooter from './Footer';
import { AccountBody } from '@/components/shared/AccountBody';
import type { AccountPageProps } from '@/templates';

export default function MinimalAccountPage({ theme }: AccountPageProps) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--sf-bg)' }}>
      <MinimalHeader />
      <AccountBody theme={theme} />
      <MinimalFooter />
    </div>
  );
}
