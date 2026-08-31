'use client';

import React from 'react';
import FunoHeader from './Header';
import FunoFooter from './Footer';
import { CartBody } from '@/components/shared/CartBody';
import type { CartPageProps } from '@/templates';

export default function FunoCartPage({ theme }: CartPageProps) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: 'var(--sf-bg)', color: 'var(--sf-text)', fontFamily: 'var(--sf-body-font)' }}
    >
      <FunoHeader />
      <CartBody theme={theme} />
      <FunoFooter />
    </div>
  );
}
