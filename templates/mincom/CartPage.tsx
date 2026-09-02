'use client';
import CommonCartPage from '@/components/cart/CommonCartPage';
import type { CartPageProps } from '@/templates';

export default function MincomCartPage({ theme }: CartPageProps) {
  return <CommonCartPage theme={theme} />;
}
