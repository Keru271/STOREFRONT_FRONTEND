'use client';

import React from 'react';
import DemoHeader from './Header';
import DemoFooter from './Footer';
import { AccountBody } from '@/components/shared/AccountBody';
import type { AccountPageProps } from '@/templates';

export default function DemoAccountPage({ theme }: AccountPageProps) {
  return (
    <div
      className="min-h-screen flex flex-col bg-[#fdfdfd] text-slate-900"
      style={{ fontFamily: "'Jost', sans-serif" }}
    >
      <DemoHeader />
      <AccountBody theme={theme} />
      <DemoFooter />
    </div>
  );
}
