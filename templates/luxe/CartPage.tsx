'use client';
import CommonCartPage from '@/components/cart/CommonCartPage';
import type { CartPageProps } from '@/templates';

export default function LuxeCartPage({ theme }: CartPageProps) {
  return <CommonCartPage theme={theme} />;
}
