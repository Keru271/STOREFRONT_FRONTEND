'use client';
import NovaHeader from './Header';
import NovaFooter from './Footer';
import { AccountBody } from '@/components/shared/AccountBody';
import type { AccountPageProps } from '@/templates';

export default function NovaAccountPage({ theme }: AccountPageProps) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--sf-bg)' }}>
      <NovaHeader />
      <AccountBody theme={theme} />
      <NovaFooter />
    </div>
  );
}
