'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import type { ThemeConfig } from '@/lib/api/types';
import {
  Cookie,
  ShieldCheck,
  Lock,
  Sparkles,
  BarChart2,
  Tag,
  Sliders,
  X,
  ExternalLink,
} from 'lucide-react';

export interface StorefrontCookieConsentProps {
  theme: ThemeConfig;
}

export interface StorefrontCookiePreferences {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

export function StorefrontCookieConsent({ theme }: StorefrontCookieConsentProps) {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  const storageKey = `sf_cookie_consent_${theme.slug || 'store'}`;

  const [preferences, setPreferences] = useState<StorefrontCookiePreferences>({
    necessary: true,
    functional: true,
    analytics: true,
    marketing: true,
    timestamp: '',
  });

  const template = (theme.activeTemplateSlug || 'mincom').toLowerCase();
  const isLuxe = template === 'luxe' || template === 'velvet-luxury';
  const isMincom = template === 'mincom' || template === 'mincom-furniture' || template === 'artisan-craft';
  const isFuno = template === 'funo';
  const isMinimal = template === 'minimal' || template === 'nova' || template === 'nova-tech';

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setPreferences(JSON.parse(stored));
        setIsOpen(false);
      } else {
        const timer = setTimeout(() => setIsOpen(true), 1000);
        return () => clearTimeout(timer);
      }
    } catch {
      setIsOpen(true);
    }
  }, [storageKey]);

  const saveConsent = (updated: StorefrontCookiePreferences) => {
    const finalData = { ...updated, timestamp: new Date().toISOString() };
    setPreferences(finalData);
    try {
      localStorage.setItem(storageKey, JSON.stringify(finalData));
    } catch {}
    setIsOpen(false);
    setShowPreferences(false);
  };

  const handleAcceptAll = () => {
    saveConsent({
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
      timestamp: '',
    });
  };

  const handleRejectNonEssential = () => {
    saveConsent({
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
      timestamp: '',
    });
  };

  const handleSaveCustom = () => {
    saveConsent(preferences);
  };

  if (!mounted) return null;

  return (
    <>
      {/* ─── Persistent Re-open Trigger (bottom-left) ─── */}
      {!isOpen && !showPreferences && (
        <button
          type="button"
          onClick={() => setShowPreferences(true)}
          title="Cookie & Privacy Settings"
          aria-label="Cookie & Privacy Settings"
          className={`fixed bottom-4 left-4 z-40 p-2.5 shadow-xl transition-all hover:scale-105 flex items-center gap-2 text-xs group cursor-pointer ${
            isLuxe
              ? 'rounded-none border border-neutral-800 bg-black text-white hover:border-amber-400/60'
              : isFuno
                ? 'rounded-2xl border-2 border-black bg-yellow-300 text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                : isMincom
                  ? 'rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-slate-800 dark:text-slate-100 shadow-md'
                  : 'rounded-full border border-slate-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md text-neutral-800 dark:text-white'
          }`}
        >
          <Cookie className="w-4 h-4 text-[var(--sf-primary)] group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline font-semibold text-[11px] opacity-80 group-hover:opacity-100">
            Cookies
          </span>
        </button>
      )}

      {/* ─── Main Consent Banner ─── */}
      {isOpen && !showPreferences && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-lg z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div
            className={`p-5 sm:p-6 shadow-2xl border transition-all ${
              isLuxe
                ? 'rounded-none border-neutral-800 bg-neutral-950 text-white'
                : isFuno
                  ? 'rounded-3xl border-2 border-black bg-white dark:bg-neutral-900 text-black dark:text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'
                  : isMincom
                    ? 'rounded-3xl border-slate-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md text-neutral-900 dark:text-white'
                    : 'rounded-2xl border-slate-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md text-neutral-900 dark:text-white'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`w-10 h-10 flex items-center justify-center shrink-0 ${
                  isLuxe
                    ? 'rounded-none border border-neutral-700 bg-neutral-900 text-amber-300'
                    : isFuno
                      ? 'rounded-2xl bg-black text-white'
                      : 'rounded-2xl bg-slate-100 dark:bg-neutral-800 text-[var(--sf-primary)]'
                }`}
              >
                <Cookie className="w-5 h-5" />
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center justify-between">
                  <h3
                    className={`text-sm sm:text-base font-bold tracking-tight ${
                      isLuxe ? 'font-serif uppercase tracking-widest' : ''
                    }`}
                  >
                    {isLuxe ? 'Private Client Privacy & Cookies' : 'We Value Your Privacy'}
                  </h3>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  We use cookies to remember your bag items, deliver currency preferences,
                  personalize recommendations, and ensure a seamless shopping experience on{' '}
                  <strong>{theme.storeName}</strong>.
                </p>
                <div className="pt-0.5">
                  <Link
                    href="/privacy"
                    className="text-[11px] underline opacity-70 hover:opacity-100 inline-flex items-center gap-1"
                  >
                    <span>Read our Privacy Policy</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 mt-2 border-t border-slate-100 dark:border-neutral-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              <button
                type="button"
                onClick={() => setShowPreferences(true)}
                className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white underline flex items-center justify-center gap-1.5 py-1.5 transition cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Customize</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRejectNonEssential}
                  className={`flex-1 sm:flex-initial px-3.5 py-2 text-xs font-semibold border transition active:scale-[0.98] cursor-pointer ${
                    isLuxe
                      ? 'rounded-none border-neutral-700 hover:bg-neutral-900 text-neutral-300'
                      : isFuno
                        ? 'rounded-xl border-2 border-black bg-slate-100 hover:bg-slate-200 text-black'
                        : isMincom
                          ? 'rounded-xl border-slate-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                          : 'rounded-xl border-slate-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  Essential Only
                </button>
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-bold text-white shadow-md transition active:scale-[0.98] cursor-pointer ${
                    isLuxe
                      ? 'rounded-none uppercase tracking-wider bg-white text-black hover:opacity-90'
                      : isFuno
                        ? 'rounded-xl border-2 border-black bg-black text-white hover:bg-neutral-800 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                        : isMincom
                          ? 'rounded-xl hover:opacity-90'
                          : 'rounded-xl hover:opacity-90'
                  }`}
                  style={{ backgroundColor: isLuxe ? '#ffffff' : isFuno ? '#000000' : 'var(--sf-primary)' }}
                >
                  Accept All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Preferences Modal ─── */}
      {showPreferences && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className={`w-full max-w-lg shadow-2xl border overflow-hidden flex flex-col max-h-[90vh] ${
              isLuxe
                ? 'rounded-none border-neutral-800 bg-neutral-950 text-white'
                : isFuno
                  ? 'rounded-3xl border-2 border-black bg-white dark:bg-neutral-900 text-black dark:text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'
                  : 'rounded-3xl border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white'
            }`}
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 flex items-center justify-center ${
                    isLuxe
                      ? 'rounded-none border border-neutral-700 bg-neutral-900 text-amber-300'
                      : 'rounded-2xl bg-slate-100 dark:bg-neutral-800 text-[var(--sf-primary)]'
                  }`}
                >
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3
                    className={`text-base font-bold ${
                      isLuxe ? 'font-serif uppercase tracking-widest' : ''
                    }`}
                  >
                    Cookie Preferences
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Customize which cookies you wish to allow on {theme.storeName}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPreferences(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs sm:text-sm">
              {/* Category 1: Strictly Necessary */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-neutral-800/60 border border-slate-200/60 dark:border-neutral-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-neutral-900 dark:text-white">
                    <Lock className="w-4 h-4 text-emerald-500" />
                    <span>Strictly Necessary (Always Active)</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">
                    Essential
                  </span>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Required to save cart items, manage customer account logins, process secure
                  checkouts, and prevent CSRF attacks. These cannot be disabled.
                </p>
              </div>

              {/* Category 2: Functional & Experience */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-neutral-800/60 border border-slate-200/60 dark:border-neutral-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-neutral-900 dark:text-white">
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                    <span>Functional & Experience</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.functional}
                      onChange={(e) =>
                        setPreferences({ ...preferences, functional: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-neutral-300 dark:bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--sf-primary)]" />
                  </label>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Remembers your currency selection, recently viewed products, wishlist items,
                  and dark/light mode preference.
                </p>
              </div>

              {/* Category 3: Analytics & Performance */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-neutral-800/60 border border-slate-200/60 dark:border-neutral-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-neutral-900 dark:text-white">
                    <BarChart2 className="w-4 h-4 text-amber-500" />
                    <span>Analytics & Performance</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) =>
                        setPreferences({ ...preferences, analytics: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-neutral-300 dark:bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--sf-primary)]" />
                  </label>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Helps us understand which collections and products are most loved and improve
                  page load performance.
                </p>
              </div>

              {/* Category 4: Marketing & Tailored Offers */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-neutral-800/60 border border-slate-200/60 dark:border-neutral-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-neutral-900 dark:text-white">
                    <Tag className="w-4 h-4 text-rose-500" />
                    <span>Marketing & Tailored Deals</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={(e) =>
                        setPreferences({ ...preferences, marketing: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-neutral-300 dark:bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--sf-primary)]" />
                  </label>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Allows display of relevant seasonal discounts, member-exclusive gift cards,
                  and coupon code notifications.
                </p>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-slate-100 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900/50 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleRejectNonEssential}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
              >
                Reject Non-Essential
              </button>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleSaveCustom}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-bold border border-slate-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
                >
                  Save Preferences
                </button>
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-bold text-white transition shadow-sm hover:opacity-90 cursor-pointer"
                  style={{ backgroundColor: 'var(--sf-primary)' }}
                >
                  Accept All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
