'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { TemplateLayout } from '@/components/shared/TemplateLayout';
import { getTheme } from '@/lib/api/theme';
import { ThemeConfig } from '@/lib/api/types';

function CheckoutSuccessContent({ theme }: { theme: ThemeConfig }) {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber') || 'ORD-2026-88192';
  const gateway = searchParams.get('gateway') || 'RAZORPAY';
  const paymentId = searchParams.get('paymentId');
  const total = searchParams.get('total') || '0.00';
  const currency = searchParams.get('currency') || (gateway === 'RAZORPAY' ? 'INR' : 'USD');
  const symbol = currency === 'INR' ? '₹' : '$';

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-8">
      {/* Success Icon */}
      <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-4xl shadow-inner border border-emerald-200 dark:border-emerald-800">
        ✓
      </div>

      <div className="space-y-2">
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
          Payment Confirmed & Verified
        </span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mt-3 font-serif">
          Thank you for your order!
        </h1>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          We've received your order at {theme.storeName} and are getting it ready. A confirmation email with tracking details has been sent to your inbox.
        </p>
      </div>

      {/* Order Details Card */}
      <div className="p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl text-left space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
          <div>
            <span className="text-xs text-gray-400 font-semibold block">Order Reference</span>
            <span className="text-lg font-black font-mono text-gray-900 dark:text-gray-100">
              {orderNumber}
            </span>
          </div>
          <span className="px-3 py-1 rounded-xl text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
            Confirmed
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl space-y-1">
            <span className="text-gray-400 font-semibold uppercase text-[10px]">Payment Method</span>
            <p className="font-bold text-gray-900 dark:text-gray-100">
              {gateway === 'UPI' || gateway === 'RAZORPAY'
                ? '📱 UPI & QR Code'
                : gateway === 'CARD' || gateway === 'STRIPE'
                ? '💳 Credit / Debit Card'
                : '💵 Cash on Delivery'}
            </p>
          </div>

          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl space-y-1">
            <span className="text-gray-400 font-semibold uppercase text-[10px]">Total Paid</span>
            <p className="font-bold text-base text-emerald-600">
              {symbol}{parseFloat(total).toFixed(2)} {currency}
            </p>
          </div>

          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl space-y-1">
            <span className="text-gray-400 font-semibold uppercase text-[10px]">Transaction ID</span>
            <p className="font-mono font-semibold text-gray-700 dark:text-gray-300 truncate">
              {paymentId || 'N/A (Doorstep Cash)'}
            </p>
          </div>
        </div>
      </div>

      {/* Action CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link
          href="/products"
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-sm text-white shadow-lg transition hover:opacity-90 cursor-pointer"
          style={{ backgroundColor: theme.themePrimaryColor || 'var(--sf-primary)' }}
        >
          Continue Shopping at {theme.storeName} →
        </Link>
        <Link
          href="/account"
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer"
        >
          View Order in Account
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  const [theme, setTheme] = useState<ThemeConfig | null>(null);

  useEffect(() => {
    getTheme().then(setTheme).catch(console.error);
  }, []);

  const currentTheme = theme || {
    id: 'default',
    storeName: 'Store',
    activeTemplateSlug: 'mincom',
    themePrimaryColor: '#0c2340',
  };

  return (
    <TemplateLayout theme={currentTheme as ThemeConfig}>
      <main className="w-full flex-grow">
        <Suspense fallback={<div className="p-16 text-center text-sm text-gray-400">Loading order receipt...</div>}>
          <CheckoutSuccessContent theme={currentTheme as ThemeConfig} />
        </Suspense>
      </main>
    </TemplateLayout>
  );
}
