'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { ThemeConfig } from '@/lib/api/types';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/hooks/useCurrency';
import { useLoader } from '@/hooks/useLoader';
import { validateCoupon } from '@/lib/api';
import { Plus, Minus, Trash2, ArrowRight, ShoppingBag, ArrowLeft, Tag, ShieldCheck, Check } from 'lucide-react';

export interface CommonCartPageProps {
  theme: ThemeConfig;
}

export function CommonCartPage({ theme }: CommonCartPageProps) {
  const router = useRouter();
  const { items, itemCount, totalAmount, updateQuantity, deleteToCart, clearCart, isLoading } = useCart();
  const { formatPrice } = useCurrency();
  const { startLoading, stopLoading } = useLoader();

  const [couponCode, setCouponCode] = useState('');
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState<{
    code: string;
    title: string;
    savings: number;
    discountType?: string;
    isAutomatic?: boolean;
  } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccessMessage, setCouponSuccessMessage] = useState('');

  // Shipping & Tax configs from CMS theme
  const freeThreshold = theme?.shippingFreeThreshold ?? 50;
  const flatRate = theme?.shippingFlatRate ?? 4.99;
  const isTaxInclusive = !!theme?.taxInclusive;
  const taxRate = typeof theme?.taxRateStandard === 'number' ? theme.taxRateStandard : 8.875;
  const taxName = theme?.taxName || 'Taxes & Fees';

  // Evaluate automatic discounts or stored coupon
  useEffect(() => {
    if (totalAmount <= 0) {
      setAppliedDiscount(null);
      return;
    }

    const savedCode = typeof window !== 'undefined' ? localStorage.getItem('cart_coupon') : null;
    if (savedCode) {
      handleValidateCode(savedCode, false);
    } else {
      handleEvaluateAutomatic();
    }
  }, [totalAmount, items.length]);

  const handleEvaluateAutomatic = async () => {
    if (totalAmount <= 0) return;
    try {
      const res = await validateCoupon({
        cartSubtotal: totalAmount,
        productIds: items.map((i) => i.productId),
      });

      if (res.valid) {
        setAppliedDiscount({
          code: res.code || res.title || 'AUTOMATIC',
          title: res.title || 'Automatic Promotion',
          savings: res.savings,
          discountType: res.discountType,
          isAutomatic: true,
        });
        setCouponSuccessMessage(res.message || `Automatic discount "${res.title}" applied!`);
      } else {
        setAppliedDiscount(null);
      }
    } catch {
      // Non-blocking
    }
  };

  const handleValidateCode = async (codeToTest: string, showToast = true) => {
    const cleanCode = codeToTest.trim().toUpperCase();
    if (!cleanCode) return;

    setIsValidatingCoupon(true);
    setCouponError('');
    if (showToast) {
      startLoading('Validating promo code...');
    }
    try {
      const res = await validateCoupon({
        code: cleanCode,
        cartSubtotal: totalAmount,
        productIds: items.map((i) => i.productId),
      });

      if (res.valid) {
        setAppliedDiscount({
          code: res.code || cleanCode,
          title: res.title || cleanCode,
          savings: res.savings,
          discountType: res.discountType,
          isAutomatic: res.isAutomatic ?? false,
        });
        setCouponSuccessMessage(res.message || `Coupon "${cleanCode}" applied!`);
        if (typeof window !== 'undefined') {
          localStorage.setItem('cart_coupon', cleanCode);
        }
      } else {
        setAppliedDiscount(null);
        setCouponError(res.message || 'Invalid promo code.');
        setCouponSuccessMessage('');
        if (typeof window !== 'undefined') {
          localStorage.removeItem('cart_coupon');
        }
      }
    } catch (err: any) {
      setAppliedDiscount(null);
      setCouponError(err.message || 'Unable to apply coupon. Please check the code.');
      setCouponSuccessMessage('');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cart_coupon');
      }
    } finally {
      setIsValidatingCoupon(false);
      if (showToast) {
        stopLoading();
      }
    }
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    handleValidateCode(couponCode, true);
  };

  const handleRemoveCoupon = () => {
    setAppliedDiscount(null);
    setCouponCode('');
    setCouponError('');
    setCouponSuccessMessage('');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cart_coupon');
    }
    setTimeout(() => {
      handleEvaluateAutomatic();
    }, 50);
  };

  const discountAmount = appliedDiscount ? appliedDiscount.savings : 0;
  const discountedSubtotal = Math.max(0, totalAmount - discountAmount);
  const shipping = totalAmount === 0 || discountedSubtotal >= freeThreshold ? 0 : flatRate;

  let taxAmount = 0;
  if (isTaxInclusive) {
    const baseSubtotal = discountedSubtotal / (1 + (taxRate > 0 ? taxRate / 100 : 0));
    taxAmount = Number((discountedSubtotal - baseSubtotal).toFixed(2));
  } else {
    taxAmount = Number(((discountedSubtotal * taxRate) / 100).toFixed(2));
  }

  const finalTotal = isTaxInclusive
    ? Number((discountedSubtotal + shipping).toFixed(2))
    : Number((discountedSubtotal + taxAmount + shipping).toFixed(2));

  if (isLoading && items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <div className="w-10 h-10 border-4 border-black dark:border-white border-t-transparent animate-spin rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white flex flex-col font-sans">
      {/* Top Header - Minimal Uber Eats Bar */}
      <header className="sticky top-0 z-30 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold hover:opacity-75 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to store</span>
          </Link>

          <div className="font-extrabold text-lg sm:text-xl tracking-tight">
            {theme?.storeName || 'Store'}
          </div>

          <div className="w-20 flex justify-end">
            {items.length > 0 && (
              <button
                onClick={() => clearCart()}
                className="text-xs font-medium text-neutral-500 hover:text-rose-500 transition cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full flex-1">
        {items.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-20 px-6 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <div className="w-20 h-20 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-4 text-neutral-400">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-sm text-neutral-500 mb-8">
              Explore our selection and add products to start your order.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-black text-white hover:bg-neutral-800 active:scale-[0.99] transition shadow-md"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Cart Items List */}
            <div className="lg:col-span-7 space-y-6">
              {/* Cart Title & Count */}
              <div className="flex items-baseline justify-between">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Your Cart</h1>
                <span className="text-sm font-semibold text-neutral-500">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'}
                </span>
              </div>

              {/* Free Delivery Milestone Progress */}
              {freeThreshold > 0 && (
                <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
                  <div className="flex items-center justify-between text-xs font-semibold mb-2">
                    {discountedSubtotal >= freeThreshold ? (
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-bold">
                        <Check className="w-4 h-4" />
                        You unlocked FREE Delivery!
                      </span>
                    ) : (
                      <span>
                        Add <strong className="text-black dark:text-white">{formatPrice(freeThreshold - discountedSubtotal)}</strong> more for <strong>FREE Delivery</strong>
                      </span>
                    )}
                    <span className="text-neutral-400 font-bold">
                      {Math.min(100, Math.round((discountedSubtotal / freeThreshold) * 100))}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-black dark:bg-white rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.round((discountedSubtotal / freeThreshold) * 100))}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Items Card List */}
              <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 divide-y divide-neutral-100 dark:divide-neutral-800 overflow-hidden shadow-xs">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.variantId || 'base'}`}
                    className="p-5 sm:p-6 flex items-start gap-4 sm:gap-6 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition"
                  >
                    {/* Quantity Pill Stepper */}
                    <div className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700 text-xs font-bold shrink-0 mt-1">
                      <button
                        onClick={() => {
                          if (item.quantity <= 1) {
                            deleteToCart(item.productId, item.variantId);
                          } else {
                            updateQuantity(item.productId, item.quantity - 1, item.variantId);
                          }
                        }}
                        className="text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white transition p-0.5 cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        {item.quantity <= 1 ? <Trash2 className="w-3.5 h-3.5 text-rose-500" /> : <Minus className="w-3.5 h-3.5" />}
                      </button>
                      <span className="w-5 text-center text-sm font-extrabold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                        className="text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white transition p-0.5 cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Middle: Details */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${item.productId}`}
                        className="text-base font-bold text-neutral-900 dark:text-white hover:underline line-clamp-2"
                      >
                        {item.name}
                      </Link>

                      {item.options && (
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-1">
                          {[
                            item.options.variant,
                            item.options.size ? `Size: ${item.options.size}` : null,
                            item.options.color ? `Color: ${item.options.color}` : null,
                          ]
                            .filter(Boolean)
                            .join(' • ')}
                        </p>
                      )}

                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-neutral-400 font-medium">
                          {formatPrice(item.price)} each
                        </span>
                        <span className="text-base font-extrabold text-neutral-900 dark:text-white">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>

                    {/* Right: Square Thumbnail (Uber Eats style) */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 shrink-0 relative border border-neutral-200/60 dark:border-neutral-700/60">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl text-neutral-300">
                          🛍️
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Items Secondary Button */}
              <div>
                <button
                  onClick={() => router.push('/products')}
                  className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm bg-neutral-100 hover:bg-neutral-200 text-neutral-900 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-white border border-neutral-200 dark:border-neutral-800 transition cursor-pointer"
                >
                  + Add more items
                </button>
              </div>
            </div>

            {/* Right Column: Order Summary Card */}
            <div className="lg:col-span-5 sticky top-24 space-y-6">
              <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm space-y-6">
                <h2 className="text-lg font-bold">Order Summary</h2>

                {/* Promo Code Input */}
                <div className="space-y-2">
                  {appliedDiscount && (
                    <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <div>
                          <div className="font-bold text-emerald-700 dark:text-emerald-400 uppercase">
                            {appliedDiscount.code}
                          </div>
                          <div className="text-[11px] text-emerald-600">
                            Saved {formatPrice(appliedDiscount.savings)}
                          </div>
                        </div>
                      </div>
                      {!appliedDiscount.isAutomatic && (
                        <button
                          onClick={handleRemoveCoupon}
                          className="text-xs font-semibold text-rose-500 hover:text-rose-600 transition cursor-pointer"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  )}

                  {(!appliedDiscount || appliedDiscount.isAutomatic) && (
                    <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Add promo code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="flex-1 px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm font-medium uppercase outline-hidden focus:border-black dark:focus:border-white transition"
                          disabled={isValidatingCoupon}
                        />
                        <button
                          type="submit"
                          disabled={isValidatingCoupon || !couponCode.trim()}
                          className="px-5 py-2.5 rounded-xl font-bold text-xs bg-black text-white dark:bg-white dark:text-black hover:opacity-90 disabled:opacity-40 transition cursor-pointer"
                        >
                          {isValidatingCoupon ? '...' : 'Apply'}
                        </button>
                      </div>
                      {couponError && <p className="text-xs text-rose-500 mt-1">{couponError}</p>}
                      {couponSuccessMessage && !appliedDiscount?.isAutomatic && (
                        <p className="text-xs text-emerald-600 mt-1 font-medium">{couponSuccessMessage}</p>
                      )}
                    </form>
                  )}
                </div>

                {/* Cost Breakdown */}
                <div className="space-y-3 text-sm divide-y divide-neutral-100 dark:divide-neutral-800">
                  <div className="flex items-center justify-between pt-2 text-neutral-600 dark:text-neutral-400">
                    <span>Subtotal</span>
                    <span className="font-semibold text-neutral-900 dark:text-white">{formatPrice(totalAmount)}</span>
                  </div>

                  {appliedDiscount && appliedDiscount.savings > 0 && (
                    <div className="flex items-center justify-between pt-2 text-emerald-600 dark:text-emerald-400 font-semibold">
                      <span>Discount ({appliedDiscount.code})</span>
                      <span>-{formatPrice(appliedDiscount.savings)}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 text-neutral-600 dark:text-neutral-400">
                    <span>Estimated Delivery</span>
                    <span className="font-semibold text-neutral-900 dark:text-white">
                      {shipping === 0 ? <span className="text-emerald-600">FREE</span> : formatPrice(shipping)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 text-neutral-600 dark:text-neutral-400">
                    <span>Estimated {taxName}</span>
                    <span className="font-semibold text-neutral-900 dark:text-white">
                      {isTaxInclusive ? 'Included' : formatPrice(taxAmount)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-4 text-base font-bold">
                    <span>Total</span>
                    <span className="text-2xl font-black text-black dark:text-white">{formatPrice(finalTotal)}</span>
                  </div>
                </div>

                {/* Primary CTA Button: Go to checkout */}
                <button
                  onClick={() => {
                    const checkoutUrl = appliedDiscount
                      ? `/checkout?coupon=${encodeURIComponent(appliedDiscount.code)}`
                      : '/checkout';
                    router.push(checkoutUrl);
                  }}
                  className="w-full py-4 px-6 rounded-2xl font-bold text-sm bg-black text-white dark:bg-white dark:text-black hover:opacity-90 active:scale-[0.99] transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Go to checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-center gap-2 text-xs text-neutral-400 text-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Encrypted, safe & secure checkout</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
export default CommonCartPage;
