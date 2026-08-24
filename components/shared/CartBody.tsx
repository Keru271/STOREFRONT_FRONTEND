'use client';

// ─── Shared Cart Logic Component ──────────────────────────────────────────────
// Contains all cart commerce logic: items list, quantity updates, removal,
// coupon code calculation, subtotal/tax/shipping summary, and checkout navigation.
// Each template wraps this with its own Header and Footer.

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { ThemeConfig } from '@/lib/api/types';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/hooks/useCurrency';
import { useLoader } from '@/hooks/useLoader';
import { validateCoupon } from '@/lib/api';

export interface CartBodyProps {
  theme: ThemeConfig;
}

export function CartBody({ theme }: CartBodyProps) {
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

  // Evaluate automatic discounts or stored coupon whenever cart items or subtotal change
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
          title: res.title || 'Automatic Discount',
          savings: res.savings,
          discountType: res.discountType,
          isAutomatic: true,
        });
        setCouponSuccessMessage(res.message || `Automatic discount "${res.title}" applied!`);
      } else {
        setAppliedDiscount(null);
      }
    } catch {
      // Non-blocking for automatic evaluation
    }
  };

  const handleUpdateQuantity = async (productId: string, quantity: number, variantId?: string) => {
    startLoading(quantity <= 0 ? 'Removing item...' : 'Updating quantity...');
    try {
      if (quantity <= 0) {
        await deleteToCart(productId, variantId);
      } else {
        await updateQuantity(productId, quantity, variantId);
      }
    } finally {
      stopLoading();
    }
  };

  const handleRemoveItem = async (productId: string, variantId?: string) => {
    startLoading('Removing item from bag...');
    try {
      await deleteToCart(productId, variantId);
    } finally {
      stopLoading();
    }
  };

  const handleClearBag = async () => {
    startLoading('Clearing shopping bag...');
    try {
      await clearCart();
    } finally {
      stopLoading();
    }
  };

  const handleValidateCode = async (codeToTest: string, showToast = true) => {
    const cleanCode = codeToTest.trim().toUpperCase();
    if (!cleanCode) return;

    setIsValidatingCoupon(true);
    setCouponError('');
    if (showToast) {
      startLoading('Validating coupon code...');
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
    startLoading('Updating order summary...');
    try {
      setAppliedDiscount(null);
      setCouponCode('');
      setCouponError('');
      setCouponSuccessMessage('');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cart_coupon');
      }
      // Re-evaluate automatic discount after user removes manual coupon
      setTimeout(() => {
        handleEvaluateAutomatic();
      }, 50);
    } finally {
      stopLoading();
    }
  };

  // Tax & Shipping Configuration from CMS Theme
  const freeThreshold = theme?.shippingFreeThreshold ?? 50;
  const flatRate = theme?.shippingFlatRate ?? 9.99;
  const isTaxInclusive = !!theme?.taxInclusive;
  const taxRate = typeof theme?.taxRateStandard === 'number' ? theme.taxRateStandard : 18;
  const taxName = theme?.taxName || 'GST';

  const discountAmount = appliedDiscount ? appliedDiscount.savings : 0;
  const discountedSubtotal = Math.max(0, totalAmount - discountAmount);

  // Shipping fee
  const shipping = totalAmount === 0 || discountedSubtotal >= freeThreshold ? 0 : flatRate;

  // Dynamic Tax Calculation
  let taxAmount = 0;
  if (isTaxInclusive) {
    // Inclusive: Tax is already baked into item prices; compute the included tax fraction for transparency
    const baseSubtotal = discountedSubtotal / (1 + (taxRate > 0 ? taxRate / 100 : 0));
    taxAmount = Number((discountedSubtotal - baseSubtotal).toFixed(2));
  } else {
    // Exclusive: Tax is added on top of the discounted subtotal
    taxAmount = Number(((discountedSubtotal * taxRate) / 100).toFixed(2));
  }

  // Grand total
  const finalTotal = isTaxInclusive
    ? Number((discountedSubtotal + shipping).toFixed(2))
    : Number((discountedSubtotal + taxAmount + shipping).toFixed(2));

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <div
          className="animate-spin rounded-full h-10 w-10 border-4 border-t-transparent"
          style={{ borderColor: 'var(--sf-primary)', borderTopColor: 'transparent' }}
        />
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-grow">
      {/* Top Header */}
      <div
        className="flex items-center justify-between pb-6 border-b mb-8"
        style={{ borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)' }}
      >
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: 'var(--sf-text)' }}>
            Shopping Bag
          </h1>
          <p className="text-xs mt-1" style={{ color: 'color-mix(in srgb, var(--sf-text) 50%, transparent)' }}>
            {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        {items.length > 0 && (
          <button
            onClick={handleClearBag}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl transition hover:opacity-70 text-rose-500 cursor-pointer"
            style={{ backgroundColor: 'color-mix(in srgb, var(--sf-text) 4%, var(--sf-bg))' }}
          >
            Clear Bag
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div
          className="text-center py-20 px-4 rounded-3xl border"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--sf-text) 2%, var(--sf-bg))',
            borderColor: 'color-mix(in srgb, var(--sf-text) 8%, transparent)',
          }}
        >
          <div className="text-5xl mb-4">🛍️</div>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--sf-text)' }}>
            Your bag is empty
          </h2>
          <p className="text-xs max-w-sm mx-auto mb-6" style={{ color: 'color-mix(in srgb, var(--sf-text) 50%, transparent)' }}>
            Looks like you haven't added anything to your cart yet. Explore our curated collections to find what you love.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-xs text-white shadow-lg transition hover:opacity-90 active:scale-95"
            style={{ backgroundColor: 'var(--sf-primary)' }}
          >
            Explore Catalog →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.variantId || 'base'}`}
                className="flex flex-col sm:flex-row items-center gap-4 p-5 rounded-3xl border transition shadow-sm"
                style={{
                  backgroundColor: 'var(--sf-bg)',
                  borderColor: 'color-mix(in srgb, var(--sf-text) 8%, transparent)',
                }}
              >
                {/* Product Thumbnail */}
                <div
                  className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center relative"
                  style={{ backgroundColor: 'color-mix(in srgb, var(--sf-text) 4%, var(--sf-bg))' }}
                >
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-2xl opacity-40">🛍️</span>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                    <Link
                      href={`/products/${item.productId}`}
                      className="font-bold text-base transition line-clamp-1 hover:underline"
                      style={{ color: 'var(--sf-text)' }}
                    >
                      {item.name}
                    </Link>

                    {((item as any).isOutOfStock || (item as any).stockQuantity === 0) ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500 text-white shadow-xs">
                        Out of Stock
                      </span>
                    ) : typeof (item as any).stockQuantity === 'number' && (item as any).stockQuantity <= 5 ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400">
                        Only {(item as any).stockQuantity} left
                      </span>
                    ) : null}
                  </div>

                  {item.sku && (
                    <p className="text-xs mt-0.5" style={{ color: 'color-mix(in srgb, var(--sf-text) 40%, transparent)' }}>
                      SKU: {item.sku}
                    </p>
                  )}

                  {item.options && (
                    <div className="flex items-center gap-2 mt-1 justify-center sm:justify-start text-xs" style={{ color: 'color-mix(in srgb, var(--sf-text) 50%, transparent)' }}>
                      {item.options.size && <span>Size: {item.options.size}</span>}
                      {item.options.color && <span>• Color: {item.options.color}</span>}
                    </div>
                  )}

                  {((item as any).isOutOfStock || (item as any).stockQuantity === 0) && (
                    <p className="text-[11px] font-bold text-rose-500 mt-1">
                      ⚠️ Item is out of stock. Please remove it to complete your checkout.
                    </p>
                  )}

                  <div className="mt-2 text-sm font-extrabold" style={{ color: 'var(--sf-primary)' }}>
                    {formatPrice(item.price)}
                  </div>
                </div>

                {/* Quantity Stepper */}
                <div
                  className="flex items-center rounded-xl p-1 border"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--sf-text) 3%, var(--sf-bg))',
                    borderColor: 'color-mix(in srgb, var(--sf-text) 12%, transparent)',
                  }}
                >
                  <button
                    onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1, item.variantId)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs hover:opacity-70 transition cursor-pointer"
                    style={{ color: 'var(--sf-text)' }}
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-bold text-xs" style={{ color: 'var(--sf-text)' }}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1, item.variantId)}
                    disabled={(item as any).isOutOfStock || (item as any).stockQuantity === 0 || (typeof (item as any).stockQuantity === 'number' && item.quantity >= (item as any).stockQuantity)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs hover:opacity-70 transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{ color: 'var(--sf-text)' }}
                    title={typeof (item as any).stockQuantity === 'number' && item.quantity >= (item as any).stockQuantity ? 'Maximum available stock reached' : 'Add one more'}
                  >
                    +
                  </button>
                </div>

                {/* Line Total */}
                <div className="text-right font-black text-base w-24" style={{ color: 'var(--sf-text)' }}>
                  {formatPrice(item.price * item.quantity)}
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveItem(item.productId, item.variantId)}
                  className="p-2 transition rounded-lg hover:text-rose-500 cursor-pointer"
                  style={{ color: 'color-mix(in srgb, var(--sf-text) 40%, transparent)' }}
                  title="Remove from cart"
                  aria-label="Remove item"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div
              className="p-6 rounded-3xl border shadow-lg sticky top-24"
              style={{
                backgroundColor: 'var(--sf-bg)',
                borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)',
              }}
            >
              <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--sf-text)' }}>Order Summary</h2>

              {/* Promo Code Form & Automatic Promo Banner */}
              <div className="mb-6 space-y-3">
                {appliedDiscount && (
                  <div
                    className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                      appliedDiscount.isAutomatic
                        ? 'bg-amber-500/10 border-amber-500/30'
                        : 'bg-emerald-500/10 border-emerald-500/30'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 font-bold text-xs">
                        <span>{appliedDiscount.isAutomatic ? '⚡' : '🏷️'}</span>
                        <span
                          className={`font-mono tracking-wider uppercase ${
                            appliedDiscount.isAutomatic ? 'text-amber-700 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
                          }`}
                        >
                          {appliedDiscount.isAutomatic ? 'Automatic Promotion' : appliedDiscount.code}
                        </span>
                      </div>
                      <p
                        className={`text-[11px] truncate mt-0.5 font-medium ${
                          appliedDiscount.isAutomatic ? 'text-amber-800 dark:text-amber-300' : 'text-emerald-700/80 dark:text-emerald-300'
                        }`}
                      >
                        {appliedDiscount.title} (-{formatPrice(appliedDiscount.savings)})
                      </p>
                    </div>
                    {!appliedDiscount.isAutomatic && (
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="px-2.5 py-1 text-[11px] font-bold rounded-lg text-rose-500 hover:bg-rose-50 transition shrink-0 cursor-pointer"
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
                        placeholder="Have a promo code?"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="sf-input flex-1 py-2 px-3 text-xs uppercase font-mono font-bold"
                        disabled={isValidatingCoupon}
                      />
                      <button
                        type="submit"
                        disabled={isValidatingCoupon || !couponCode.trim()}
                        className="px-4 py-2 text-white text-xs font-bold rounded-xl hover:opacity-90 transition disabled:opacity-50 flex items-center gap-1 cursor-pointer"
                        style={{ backgroundColor: 'var(--sf-text)', color: 'var(--sf-bg)' }}
                      >
                        {isValidatingCoupon ? 'Checking...' : 'Apply'}
                      </button>
                    </div>
                    {couponError && <p className="text-xs text-rose-500 mt-1">{couponError}</p>}
                    {couponSuccessMessage && !appliedDiscount?.isAutomatic && (
                      <p className="text-xs text-emerald-600 mt-1 font-semibold">{couponSuccessMessage}</p>
                    )}
                  </form>
                )}
              </div>

              {/* Breakdown */}
              <div
                className="space-y-3 text-sm divide-y"
                style={{ borderColor: 'color-mix(in srgb, var(--sf-text) 8%, transparent)' }}
              >
                <div className="flex justify-between pt-2" style={{ color: 'color-mix(in srgb, var(--sf-text) 60%, transparent)' }}>
                  <span>Subtotal</span>
                  <span className="font-semibold" style={{ color: 'var(--sf-text)' }}>{formatPrice(totalAmount)}</span>
                </div>

                {appliedDiscount && appliedDiscount.savings > 0 && (
                  <div className="flex justify-between pt-2 text-emerald-600 font-semibold">
                    <span>Discount ({appliedDiscount.code})</span>
                    <span>-{formatPrice(appliedDiscount.savings)}</span>
                  </div>
                )}

                <div className="flex justify-between pt-2" style={{ color: 'color-mix(in srgb, var(--sf-text) 60%, transparent)' }}>
                  <span>Shipping</span>
                  <span className="font-semibold" style={{ color: 'var(--sf-text)' }}>
                    {shipping === 0 ? <span className="text-emerald-600">FREE</span> : formatPrice(shipping)}
                  </span>
                </div>

                {isTaxInclusive ? (
                  <div className="flex justify-between pt-2" style={{ color: 'color-mix(in srgb, var(--sf-text) 60%, transparent)' }}>
                    <div className="flex items-center gap-1.5">
                      <span>Included {taxName} ({taxRate}%)</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-semibold">
                        Included
                      </span>
                    </div>
                    <span className="font-semibold" style={{ color: 'var(--sf-text)' }}>
                      {formatPrice(taxAmount)}
                    </span>
                  </div>
                ) : (
                  <div className="flex justify-between pt-2" style={{ color: 'color-mix(in srgb, var(--sf-text) 60%, transparent)' }}>
                    <span>Estimated {taxName} ({taxRate}%)</span>
                    <span className="font-semibold" style={{ color: 'var(--sf-text)' }}>
                      {taxAmount === 0 ? formatPrice(0) : `+${formatPrice(taxAmount)}`}
                    </span>
                  </div>
                )}

                <div className="flex justify-between pt-4 text-base font-black">
                  <span style={{ color: 'var(--sf-text)' }}>Estimated Total</span>
                  <span className="text-xl" style={{ color: 'var(--sf-primary)' }}>{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {/* Out of Stock Notice */}
              {items.some((it) => (it as any).isOutOfStock || (it as any).stockQuantity === 0) && (
                <div className="mt-4 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-start gap-2">
                  <span className="text-sm">⚠️</span>
                  <span>Some items in your shopping bag are currently Out of Stock. Please remove them to proceed with checkout.</span>
                </div>
              )}

              {/* Checkout CTA */}
              {items.some((it) => (it as any).isOutOfStock || (it as any).stockQuantity === 0) ? (
                <button
                  type="button"
                  disabled
                  className="w-full mt-4 py-4 rounded-2xl font-bold text-sm bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-700"
                >
                  <span>⚠️ Remove Out of Stock Items to Checkout</span>
                </button>
              ) : (
                <Link
                  href={appliedDiscount ? `/checkout?coupon=${encodeURIComponent(appliedDiscount.code)}` : '/checkout'}
                  onClick={() => startLoading('Navigating to secure checkout...')}
                  className="w-full mt-6 py-4 rounded-2xl font-bold text-sm text-white shadow-xl transition-all duration-200 flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] cursor-pointer"
                  style={{ backgroundColor: 'var(--sf-primary)' }}
                >
                  <span>Proceed to Checkout</span>
                  <span>→</span>
                </Link>
              )}

              <div className="space-y-1.5 mt-4 text-center">
                <p className="text-xs" style={{ color: 'color-mix(in srgb, var(--sf-text) 40%, transparent)' }}>
                  🔒 Guaranteed Safe & Secure Checkout
                </p>
                {theme?.taxNumber && (
                  <p className="text-[11px] font-mono" style={{ color: 'color-mix(in srgb, var(--sf-text) 45%, transparent)' }}>
                    Tax ID: {theme.taxNumber}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
