'use client';

import React from 'react';
import PawzyHeader from './Header';
import PawzyFooter from './Footer';
import { AccountBody } from '@/components/shared/AccountBody';
import type { AccountPageProps } from '@/templates';

export default function PawzyAccountPage({ theme }: AccountPageProps) {
  return (
    <div
      className="min-h-screen flex flex-col bg-[#fdfdfd] text-[#1f2937]"
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >
      <PawzyHeader />
      <AccountBody theme={theme} />
      <PawzyFooter />
    </div>
  );
}
