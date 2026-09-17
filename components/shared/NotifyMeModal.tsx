'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { submitProductNotification } from '@/lib/api/notifications';
import { useCurrency } from '@/hooks/useCurrency';

export interface NotifyMeModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    image?: string | null;
    sku?: string | null;
    price?: number | null;
  };
  variant?: {
    id?: string | null;
    name?: string | null;
    sku?: string | null;
    price?: number | null;
  } | null;
  activeTemplate?: string;
}

export default function NotifyMeModal({
  isOpen,
  onClose,
  product,
  variant,
  activeTemplate = 'default',
}: NotifyMeModalProps) {
  const { customer, isAuthenticated } = useAuth();
  const { formatPrice } = useCurrency();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isLuxe = activeTemplate === 'luxe';
  const isMinimal = activeTemplate === 'minimal';
  const isNova = activeTemplate === 'nova';
  const isFuno = activeTemplate === 'funo';
  const isMincom = activeTemplate === 'mincom';

  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
      setErrorMessage('');
      if (isAuthenticated && customer) {
        setEmail(customer.email || '');
        setName(customer.name || '');
        setPhone(customer.phone || '');
      } else {
        setEmail('');
        setName('');
        setPhone('');
      }
    }
  }, [isOpen, isAuthenticated, customer]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage('');

      await submitProductNotification({
        productId: product.id,
        productName: product.name,
        productSku: variant?.sku || product.sku || null,
        productImage: product.image || null,
        productPrice: variant?.price !== undefined && variant?.price !== null ? variant.price : product.price,
        variantId: variant?.id || null,
        variantName: variant?.name || null,
        customerEmail: email.trim(),
        customerName: name.trim() || undefined,
        customerPhone: phone.trim() || undefined,
      });

      setSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to subscribe right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const modalRadius = isMinimal
    ? 'rounded-none'
    : isLuxe
    ? 'rounded-none'
    : isNova || isFuno
    ? 'rounded-3xl'
    : isMincom
    ? 'rounded-xl'
    : 'rounded-2xl';

  const buttonRadius = isMinimal
    ? 'rounded-none'
    : isLuxe
    ? 'rounded-none'
    : isNova || isFuno
    ? 'rounded-full'
    : isMincom
    ? 'rounded-lg'
    : 'rounded-xl';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={`relative w-full max-w-md overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-10 transition-all ${modalRadius}`}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full transition z-20 cursor-pointer"
          aria-label="Close dialog"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {submitted ? (
          /* Success Screen */
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto text-2xl shadow-inner">
              ✓
            </div>
            <h3
              className={`text-xl font-bold text-slate-900 dark:text-white ${
                isLuxe ? 'font-serif' : ''
              }`}
            >
              You&apos;re on the VIP Waitlist!
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              We&apos;ve registered <strong className="text-slate-900 dark:text-white">{email}</strong>. As soon as{' '}
              <span className="font-semibold text-slate-900 dark:text-slate-200">{product.name}</span>
              {variant?.name ? ` (${variant.name})` : ''} is restocked, you will receive an instant alert!
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className={`w-full py-3 text-xs font-bold uppercase tracking-wider bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition ${buttonRadius}`}
              >
                Got It, Thanks!
              </button>
            </div>
          </div>
        ) : (
          /* Subscription Form */
          <div className="p-6 sm:p-7 space-y-5">
            {/* Header / Product summary */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-amber-500/10 text-amber-600 border border-amber-500/20 mb-3">
                <span>🔔</span>
                <span>Back-in-Stock Alert</span>
              </div>
              <h3
                className={`text-lg sm:text-xl font-black text-slate-900 dark:text-white ${
                  isLuxe ? 'font-serif font-normal' : ''
                }`}
              >
                Notify Me When Available
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Enter your details below to get notified the second this item is back in stock.
              </p>
            </div>

            {/* Product Card Micro-preview */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
              {product.image ? (
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-200 shrink-0">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-lg shrink-0">
                  🛍️
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {product.name}
                </h4>
                <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                  {variant?.name && (
                    <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-[10px] font-semibold">
                      {variant.name}
                    </span>
                  )}
                  {product.price && (
                    <span className="font-bold text-slate-900 dark:text-slate-300">
                      {formatPrice(variant?.price || product.price)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {errorMessage && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300 text-xs rounded-xl">
                  {errorMessage}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Mobile (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 555-0199"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-tight">
                🔒 We will strictly use your email only to send this single restock notification. No spam.
              </p>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full py-3.5 text-xs font-bold tracking-wider uppercase transition shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                    isLuxe
                      ? 'bg-stone-950 hover:bg-stone-800 text-white'
                      : isMinimal
                      ? 'bg-black hover:bg-zinc-800 text-white dark:bg-white dark:text-black'
                      : isNova
                      ? 'bg-[#0071e3] hover:bg-[#0077ed] text-white'
                      : isFuno
                      ? 'bg-orange-500 hover:bg-orange-600 text-white'
                      : 'bg-slate-900 hover:bg-black text-white dark:bg-white dark:text-slate-900'
                  } ${buttonRadius}`}
                >
                  {submitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      <span>Saving Request...</span>
                    </>
                  ) : (
                    <>
                      <span>🔔 Send Me Restock Alert</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
