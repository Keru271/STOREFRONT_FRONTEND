'use client';

import React from 'react';
import CommonCartPage from '@/components/cart/CommonCartPage';
import type { CartPageProps } from '@/templates';

export default function DemoCartPage({ theme }: CartPageProps) {
  return <CommonCartPage theme={theme} />;
}
