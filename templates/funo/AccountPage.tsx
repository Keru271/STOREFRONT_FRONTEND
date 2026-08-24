'use client';

import React from 'react';
import FunoHeader from './Header';
import FunoFooter from './Footer';
import { AccountBody } from '@/components/shared/AccountBody';
import type { AccountPageProps } from '@/templates';

export default function FunoAccountPage({ theme }: AccountPageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdfdfd] text-slate-900">
      <FunoHeader />
      <AccountBody theme={theme} />
      <FunoFooter />
    </div>
  );
}
