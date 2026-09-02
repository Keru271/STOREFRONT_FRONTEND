'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/hooks/useCurrency';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CommonCartDrawer() {
  const router = useRouter();
  const { items, itemCount, totalAmount, isOpen, closeCart, updateQuantity, deleteToCart, clearCart } = useCart();
  const { formatPrice } = useCurrency();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  const handleGoToCheckout = () => {
    closeCart();
    router.push('/checkout');
  };

  const handleAddItems = () => {
    closeCart();
    router.push('/products');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300 animate-fade-in"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        ref={drawerRef}
        className="relative z-10 w-full max-w-md bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-2xl flex flex-col h-full overflow-hidden transition-transform duration-300 animate-slide-left border-l border-neutral-200 dark:border-neutral-800"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight">Your Cart</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={() => clearCart()}
                className="text-xs font-medium text-neutral-400 hover:text-rose-500 transition px-2 py-1 rounded-md"
                title="Clear Cart"
              >
                Clear
              </button>
            )}
            <button
              onClick={closeCart}
              className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4 text-neutral-400">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-1">Your cart is empty</h3>
            <p className="text-sm text-neutral-500 max-w-xs mb-6">
              Explore our curated selection and add items to your cart to get started.
            </p>
            <button
              onClick={handleAddItems}
              className="w-full max-w-xs py-3.5 px-6 rounded-xl font-bold text-sm bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 transition shadow-sm"
            >
              Explore Products
            </button>
          </div>
        ) : (
          <>
            {/* Items List */}
            <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-neutral-100 dark:divide-neutral-800">
              {items.map((item) => (
                <div key={`${item.productId}-${item.variantId || 'base'}`} className="py-4 flex items-start gap-4">
                  {/* Left: Quantity Pill Stepper (Uber Eats style: '1 ⌄' / stepper) */}
                  <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5">
                    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700 text-xs font-bold">
                      <button
                        onClick={() => {
                          if (item.quantity <= 1) {
                            deleteToCart(item.productId, item.variantId);
                          } else {
                            updateQuantity(item.productId, item.quantity - 1, item.variantId);
                          }
                        }}
                        className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition p-0.5"
                        aria-label="Decrease quantity"
                      >
                        {item.quantity <= 1 ? <Trash2 className="w-3 h-3 text-rose-500" /> : <Minus className="w-3 h-3" />}
                      </button>
                      <span className="w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                        className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition p-0.5"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Middle: Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold leading-snug line-clamp-2 text-neutral-900 dark:text-white">
                      {item.name}
                    </h4>
                    {item.options && (
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 line-clamp-1">
                        {[
                          item.options.variant,
                          item.options.size ? `Size: ${item.options.size}` : null,
                          item.options.color ? `Color: ${item.options.color}` : null,
                        ]
                          .filter(Boolean)
                          .join(' • ')}
                      </p>
                    )}
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-xs text-neutral-400 font-medium">
                        {formatPrice(item.price)} each
                      </span>
                      <span className="text-sm font-bold text-neutral-900 dark:text-white">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>

                  {/* Right: Square Thumbnail (Uber Eats style) */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 shrink-0 relative border border-neutral-200/50 dark:border-neutral-700/50">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl text-neutral-300">
                        🛍️
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Footer / Actions */}
            <div className="p-6 border-t border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
              {/* Subtotal */}
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-neutral-900 dark:text-white">Subtotal</span>
                <span className="text-xl font-extrabold text-neutral-900 dark:text-white">
                  {formatPrice(totalAmount)}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={handleGoToCheckout}
                  className="w-full py-4 px-6 rounded-xl font-bold text-sm bg-black text-white hover:bg-neutral-800 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  <span>Go to checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleAddItems}
                  className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-neutral-100 hover:bg-neutral-200 text-neutral-900 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-white transition cursor-pointer"
                >
                  Add items
                </button>
              </div>

              <div className="text-center">
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 underline font-medium"
                >
                  View full cart page
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
