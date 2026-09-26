'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { TemplateLayout } from '@/components/shared/TemplateLayout';
import { getTheme } from '@/lib/api/theme';
import { getOrderConfirmation, OrderConfirmationDetails } from '@/lib/api/checkout';
import { ThemeConfig } from '@/lib/api/types';
import { trackPurchase } from '@/lib/analytics/events';
import {
  CheckCircle2,
  Package,
  MapPin,
  Receipt,
  CreditCard,
  ArrowRight,
  Printer,
  Clock,
  Truck,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

function CheckoutSuccessContent({ theme }: { theme: ThemeConfig }) {
  const searchParams = useSearchParams();
  const orderNumberParam = searchParams.get('orderNumber') || '';
  const [orderDetails, setOrderDetails] = useState<OrderConfirmationDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderNumberParam) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setFetchError(null);

    getOrderConfirmation(orderNumberParam)
      .then((res) => {
        if (!isMounted) return;
        if (res && res.order) {
          setOrderDetails(res.order);
          // Analytics Track Purchase
          trackPurchase({
            id: res.order.orderNumber || orderNumberParam,
            total: res.order.totalAmount || 0,
            currency: res.order.currency || 'INR',
          });
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.warn('Could not load order confirmation from API, using URL params fallback:', err);
        setFetchError('Order receipt loaded with basic confirmation details.');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [orderNumberParam]);

  // Fallbacks from URL search params
  const fallbackOrderNumber = orderNumberParam || 'ORD-' + Date.now().toString().slice(-6);
  const fallbackGateway = searchParams.get('gateway') || 'RAZORPAY';
  const fallbackPaymentId = searchParams.get('paymentId');
  const fallbackTotal = parseFloat(searchParams.get('total') || '0');
  const fallbackCurrency =
    searchParams.get('currency') || theme.currency || (fallbackGateway === 'RAZORPAY' ? 'INR' : 'USD');

  const orderNumber = orderDetails?.orderNumber || fallbackOrderNumber;
  const currency = orderDetails?.currency || fallbackCurrency;
  const totalAmount = orderDetails ? orderDetails.totalAmount : fallbackTotal;
  const subtotalAmount = orderDetails ? orderDetails.subtotalAmount : totalAmount;
  const shippingAmount = orderDetails ? orderDetails.shippingAmount : 0;
  const taxAmount = orderDetails ? orderDetails.taxAmount : 0;
  const paymentMethod =
    orderDetails?.payment?.method ||
    (fallbackGateway === 'RAZORPAY' || fallbackGateway === 'UPI'
      ? 'UPI / Online Cards (Razorpay)'
      : fallbackGateway === 'PAYPAL'
      ? 'PayPal'
      : fallbackGateway === 'CARD'
      ? 'Credit or Debit Card'
      : 'Cash on Delivery');
  const transactionId =
    orderDetails?.payment?.paymentId ||
    fallbackPaymentId ||
    orderDetails?.payment?.orderId ||
    'Confirmed On Delivery';

  const formatPrice = (val: number) => {
    const symbol = currency === 'INR' ? '₹' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$';
    return `${symbol}${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div
      className="max-w-4xl mx-auto px-4 py-12 sm:py-16 space-y-8"
      style={{ fontFamily: 'var(--sf-body-font)' }}
    >
      {/* Header Banner */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner border border-emerald-200 dark:border-emerald-800 animate-in zoom-in-75 duration-300">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Order Confirmed & Verified
          </span>
          <h1
            className="text-3xl sm:text-4xl font-black tracking-tight"
            style={{ fontFamily: 'var(--sf-heading-font)', color: 'var(--sf-text)' }}
          >
            Thank you for your order!
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-lg mx-auto leading-relaxed">
            We've received your order at <strong className="text-neutral-900 dark:text-white">{theme.storeName}</strong> and are preparing it for delivery. A confirmation has been sent to{' '}
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">
              {orderDetails?.customerEmail || 'your email'}
            </span>.
          </p>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold text-neutral-400 animate-pulse">
            Retrieving live order confirmation details...
          </span>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top Quick Status Pill Card */}
          <div className="p-6 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 shadow-xl text-left space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100 dark:border-neutral-800">
              <div>
                <span className="text-[11px] text-neutral-400 font-bold uppercase tracking-wider block">
                  Order Reference
                </span>
                <span className="text-xl font-black font-mono text-neutral-900 dark:text-white">
                  {orderNumber}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer print:hidden"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <span className="px-3.5 py-2 rounded-xl text-xs font-extrabold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{orderDetails?.fulfillmentStatus || 'Confirmed'}</span>
                </span>
              </div>
            </div>

            {/* 3 Metric Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div className="p-4 bg-neutral-50 dark:bg-neutral-800/60 rounded-2xl border border-neutral-100 dark:border-neutral-800 space-y-1">
                <span className="text-neutral-400 font-bold uppercase text-[10px] tracking-wider block flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Payment Method</span>
                </span>
                <p className="font-bold text-xs text-neutral-900 dark:text-white truncate">
                  {paymentMethod}
                </p>
              </div>

              <div className="p-4 bg-neutral-50 dark:bg-neutral-800/60 rounded-2xl border border-neutral-100 dark:border-neutral-800 space-y-1">
                <span className="text-neutral-400 font-bold uppercase text-[10px] tracking-wider block flex items-center gap-1.5">
                  <Receipt className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Total Amount Paid</span>
                </span>
                <p className="font-black text-base text-emerald-600 dark:text-emerald-400">
                  {formatPrice(totalAmount)}
                </p>
              </div>

              <div className="p-4 bg-neutral-50 dark:bg-neutral-800/60 rounded-2xl border border-neutral-100 dark:border-neutral-800 space-y-1">
                <span className="text-neutral-400 font-bold uppercase text-[10px] tracking-wider block flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Transaction Reference</span>
                </span>
                <p className="font-mono text-xs font-bold text-neutral-700 dark:text-neutral-300 truncate">
                  {transactionId}
                </p>
              </div>
            </div>
          </div>

          {/* Two Columns: Purchased Items List + Shipping & Cost Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
            {/* Left Column: Purchased Items (2 Cols) */}
            <div className="lg:col-span-2 p-6 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm space-y-4">
              <h3 className="font-extrabold text-sm text-neutral-900 dark:text-white flex items-center gap-2">
                <Package className="w-4 h-4 text-neutral-500" />
                <span>Purchased Items ({orderDetails?.items?.length || 1})</span>
              </h3>

              <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {orderDetails?.items && orderDetails.items.length > 0 ? (
                  orderDetails.items.map((item, idx) => (
                    <div key={idx} className="py-3.5 flex items-center justify-between gap-4 first:pt-1 last:pb-1">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 overflow-hidden relative shrink-0 border border-neutral-200/60 dark:border-neutral-700/60">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-base">
                              🛍️
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-xs text-neutral-900 dark:text-white line-clamp-1">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-neutral-400 mt-0.5">
                            Qty: <strong className="text-neutral-700 dark:text-neutral-300">{item.quantity}</strong> × {formatPrice(item.price)}
                          </p>
                        </div>
                      </div>
                      <span className="font-black text-xs text-neutral-900 dark:text-white shrink-0">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="py-4 text-xs text-neutral-400 flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    <span>Order items confirmed and synced to your merchant account.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Financial Breakdown & Shipping Details */}
            <div className="space-y-6">
              {/* Cost Summary Card */}
              <div className="p-6 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm space-y-3 text-xs">
                <h4 className="font-extrabold text-sm text-neutral-900 dark:text-white flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-neutral-500" />
                  <span>Payment Summary</span>
                </h4>

                <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
                  <span>Subtotal</span>
                  <span className="font-bold text-neutral-900 dark:text-white">{formatPrice(subtotalAmount)}</span>
                </div>

                <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
                  <span>Delivery & Shipping</span>
                  <span className="font-bold text-neutral-900 dark:text-white">
                    {shippingAmount === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : formatPrice(shippingAmount)}
                  </span>
                </div>

                {taxAmount > 0 && (
                  <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
                    <span>Taxes</span>
                    <span className="font-bold text-neutral-900 dark:text-white">{formatPrice(taxAmount)}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-sm font-black">
                  <span className="text-neutral-900 dark:text-white">Total Amount</span>
                  <span className="text-base text-emerald-600 dark:text-emerald-400">{formatPrice(totalAmount)}</span>
                </div>
              </div>

              {/* Shipping Address Card */}
              {orderDetails?.shippingAddress && (
                <div className="p-6 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm space-y-2 text-xs">
                  <h4 className="font-extrabold text-sm text-neutral-900 dark:text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-indigo-500" />
                    <span>Shipping Address</span>
                  </h4>
                  <div className="text-neutral-600 dark:text-neutral-300 space-y-0.5 pt-1">
                    <p className="font-bold text-neutral-900 dark:text-white">
                      {orderDetails.shippingAddress.name || orderDetails.customerName}
                    </p>
                    <p>{orderDetails.shippingAddress.street}</p>
                    <p>
                      {[
                        orderDetails.shippingAddress.city,
                        orderDetails.shippingAddress.state,
                        orderDetails.shippingAddress.zip,
                      ]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                    <p className="text-neutral-400">{orderDetails.shippingAddress.country}</p>
                    {orderDetails.shippingAddress.phone && (
                      <p className="text-neutral-400 font-mono mt-1">
                        Phone: {orderDetails.shippingAddress.phone}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 print:hidden">
        <Link
          href="/products"
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-xs sm:text-sm text-white shadow-lg transition hover:opacity-90 flex items-center justify-center gap-2 cursor-pointer"
          style={{ backgroundColor: 'var(--sf-primary)' }}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Continue Shopping at {theme.storeName}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/account/orders"
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-xs sm:text-sm bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>View All Orders in Account</span>
          <ExternalLink className="w-3.5 h-3.5" />
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
        <Suspense
          fallback={
            <div className="p-16 text-center text-sm text-gray-400">Loading order receipt...</div>
          }
        >
          <CheckoutSuccessContent theme={currentTheme as ThemeConfig} />
        </Suspense>
      </main>
    </TemplateLayout>
  );
}

