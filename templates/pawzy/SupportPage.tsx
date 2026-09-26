'use client';

import React from 'react';
import PawzyHeader from './Header';
import PawzyFooter from './Footer';
import { SupportBody } from '@/components/shared/SupportBody';
import type { SupportPageProps } from '@/templates';

export default function PawzySupportPage({ theme }: SupportPageProps) {
  return (
    <div
      className="min-h-screen flex flex-col bg-[#fbfbfb] text-[#1f2937] antialiased"
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >
      <PawzyHeader />
      <SupportBody theme={theme} />
      <PawzyFooter />
    </div>
  );
}
