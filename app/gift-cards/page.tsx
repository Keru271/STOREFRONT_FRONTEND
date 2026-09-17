'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Gift, CreditCard, ShieldCheck, Sparkles, ArrowRight, CheckCircle2, AlertCircle, ShoppingBag, Copy, Check } from 'lucide-react';
import { checkGiftCardBalance } from '@/lib/api/checkout';
import { useCurrency } from '@/hooks/useCurrency';
import { GiftCardBalanceResponse } from '@/lib/api/types';

export default function GiftCardsPage() {
  const { formatPrice } = useCurrency();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GiftCardBalanceResponse | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCheckBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await checkGiftCardBalance(code.trim());
      if (res.valid) {
        setResult(res);
      } else {
        setError(res.message || 'Invalid or expired gift card code');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to verify gift card');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-neutral-50/50 dark:bg-neutral-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-violet-600 via-indigo-600 to-purple-800 text-white p-8 sm:p-12 shadow-2xl">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 max-w-xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Digital Gift Cards</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Give the Gift of Choice
            </h1>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed">
              Check your gift card balance, redeem credit at checkout, or purchase digital gift vouchers for loved ones.
            </p>
          </div>

          {/* Floating decorative card graphic */}
          <div className="hidden md:block absolute right-8 bottom-8 w-72 h-44 rounded-2xl bg-white/15 backdrop-blur-xl border border-white/20 p-5 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <div className="flex justify-between items-start">
              <Gift className="w-8 h-8 text-amber-300" />
              <span className="font-mono text-xs text-white/70">DIGITAL CARD</span>
            </div>
            <div className="mt-8">
              <div className="text-xs text-white/60 tracking-widest font-mono">CODE</div>
              <div className="font-mono text-sm font-bold tracking-widest text-white mt-0.5">GC-••••-••••-••••</div>
            </div>
            <div className="mt-4 flex justify-between items-center text-[10px] text-white/70 uppercase">
              <span>Instant Redemption</span>
              <span>No Expiry Fees</span>
            </div>
          </div>
        </div>

        {/* Balance Checker Tool */}
        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-10 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-violet-600 dark:text-violet-400" />
              Check Card Balance
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Enter your 16-character gift card code below to see your available balance and card status.
            </p>
          </div>

          <form onSubmit={handleCheckBalance} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Gift className="w-5 h-5 text-neutral-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  placeholder="e.g. GC-A1B2-C3D4-E5F6"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white font-mono text-sm font-bold tracking-wide uppercase outline-hidden focus:ring-2 focus:ring-violet-500 transition"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !code.trim()}
                className="px-8 py-3.5 rounded-2xl bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white font-bold text-sm tracking-wide shadow-lg shadow-violet-500/20 disabled:opacity-50 transition cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? 'Checking...' : 'Check Balance'}
              </button>
            </div>
          </form>

          {/* Error state */}
          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 text-sm flex items-center gap-3 animate-fade-in">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Success / Result card */}
          {result && (
            <div className="p-6 rounded-3xl bg-linear-to-br from-violet-50 to-indigo-50 dark:from-violet-950/30 dark:to-indigo-950/20 border border-violet-200 dark:border-violet-800 space-y-4 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
                    Available Balance
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white mt-1">
                    {formatPrice(result.balance || 0)}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-mono text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
                    <span>{result.code}</span>
                    {result.code && (
                      <button
                        onClick={() => copyToClipboard(result.code!)}
                        className="text-neutral-400 hover:text-neutral-600 dark:hover:text-white transition"
                        title="Copy code"
                      >
                        {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-violet-200/60 dark:border-violet-800/60 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-neutral-500 dark:text-neutral-400 block">Initial Value:</span>
                  <span className="font-bold text-neutral-800 dark:text-neutral-200">
                    {formatPrice(result.initialValue || 0)}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 dark:text-neutral-400 block">Expires:</span>
                  <span className="font-bold text-neutral-800 dark:text-neutral-200">
                    {result.expiresAt ? new Date(result.expiresAt).toLocaleDateString() : 'Never expires'}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 dark:text-neutral-400 block">Status:</span>
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Active
                  </span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black dark:bg-white text-white dark:text-black text-xs font-bold hover:opacity-90 transition"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Shop Now</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* How to use Gift Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 flex items-center justify-center font-black text-base">
              1
            </div>
            <h3 className="font-bold text-neutral-900 dark:text-white">Shop Your Favorites</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Explore our catalog and add items to your cart. Gift cards can be applied to any product or delivery fee.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-base">
              2
            </div>
            <h3 className="font-bold text-neutral-900 dark:text-white">Redeem at Checkout</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              On the checkout screen, click <strong>Apply Gift Card</strong> and paste your 16-character code.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-base">
              3
            </div>
            <h3 className="font-bold text-neutral-900 dark:text-white">Instant Balance Deduction</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Your gift card balance will be deducted immediately. Any remaining balance stays on your card for next time!
            </p>
          </div>
        </div>

        {/* Security / FAQ Banner */}
        <div className="rounded-3xl bg-neutral-100 dark:bg-neutral-900/60 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center justify-center shadow-xs shrink-0">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-neutral-900 dark:text-white">
                Safe, Secure & Instant
              </h4>
              <p className="text-xs text-neutral-500 mt-0.5">
                Our digital gift cards are encrypted, fraud-protected, and ready to use immediately.
              </p>
            </div>
          </div>

          <Link
            href="/products"
            className="px-6 py-3 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold hover:opacity-90 transition shrink-0 flex items-center gap-2"
          >
            <span>Start Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
