'use client';

import React from 'react';
import DemoHeader from './Header';
import DemoFooter from './Footer';
import { SupportBody } from '@/components/shared/SupportBody';
import type { SupportPageProps } from '@/templates';

export default function DemoSupportPage({ theme }: SupportPageProps) {
  return (
    <div
      className="min-h-screen flex flex-col bg-[#fbfbfb] text-slate-900 font-sans antialiased"
      style={{ fontFamily: "'Jost', sans-serif" }}
    >
      <DemoHeader />
      <SupportBody theme={theme} />
      <DemoFooter />
    </div>
  );
}
