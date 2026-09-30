'use client';

import React, { useState } from 'react';
import type { ThemeConfig } from '@/lib/api/types';
import {
  Heart,
  Mail,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Phone,
} from 'lucide-react';
import { Instagram, Facebook, Twitter } from '@/components/shared/SocialIcons';

function PawPrintIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <circle cx="12" cy="14" r="4.5" />
      <circle cx="7" cy="8.5" r="2.2" />
      <circle cx="11" cy="6.5" r="2.2" />
      <circle cx="15.5" cy="7" r="2.2" />
      <circle cx="18.5" cy="11" r="2" />
    </svg>
  );
}

export default function PawzyMaintenancePage({ theme }: { theme: ThemeConfig }) {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = theme?.maintenanceTitle || "We're Giving Our Pet Store a Pawsome Grooming! 🐾";
  const message =
    theme?.maintenanceMessage ||
    "We are restocking healthy treats, tuning up cozy pet beds, and adding tail-wagging surprises. We will be back shortly for your furry best friends!";

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsSubscribed(true);
    }, 500);
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-between relative overflow-hidden font-sans bg-[#FFFDF7] text-[#2C2318]"
    >
      {/* Decorative Paw Background & Soft Organic Blobs */}
      <div className="absolute top-10 -left-10 w-48 h-48 rounded-full bg-amber-200/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-10 w-64 h-64 rounded-full bg-orange-200/40 blur-3xl pointer-events-none" />

      {/* Floating Paw Prints */}
      <div className="absolute top-24 left-1/4 opacity-15 pointer-events-none rotate-12 text-amber-600">
        <PawPrintIcon className="w-12 h-12" />
      </div>
      <div className="absolute bottom-28 right-1/4 opacity-15 pointer-events-none -rotate-12 text-orange-600">
        <PawPrintIcon className="w-16 h-16" />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {theme?.logo ? (
            <img src={theme.logo} alt={theme.storeName} className="h-10 w-auto object-contain" />
          ) : (
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-sm">
                <PawPrintIcon className="w-4 h-4" />
              </span>
              <span className="text-2xl font-black tracking-tight text-amber-950">
                {theme?.storeName || 'PAWZY'}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300/60 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span>Grooming in Progress</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-10">
        <div className="max-w-2xl w-full mx-auto text-center space-y-8">
          {/* Badge Icon */}
          <div className="inline-flex p-5 rounded-3xl bg-amber-100/80 border-2 border-amber-300/80 shadow-md text-amber-700 animate-bounce">
            <PawPrintIcon className="w-12 h-12" />
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#2B1B0F] leading-tight">
              {title}
            </h1>
            <p className="text-base sm:text-lg text-amber-900/80 max-w-xl mx-auto leading-relaxed font-medium">
              {message}
            </p>
          </div>

          {/* Fun Status Checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto pt-2">
            <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs text-center flex flex-col items-center">
              <span className="text-2xl mb-1">🦴</span>
              <span className="text-xs font-bold text-amber-950">Treats Restocked</span>
              <span className="text-[11px] text-amber-700">100% Organic</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs text-center flex flex-col items-center">
              <span className="text-2xl mb-1">🐾</span>
              <span className="text-xs font-bold text-amber-950">Toy Vault Updated</span>
              <span className="text-[11px] text-amber-700">Ultra-Durable</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs text-center flex flex-col items-center">
              <span className="text-2xl mb-1">💖</span>
              <span className="text-xs font-bold text-amber-950">Speedy Delivery</span>
              <span className="text-[11px] text-amber-700">Same-Day Dispatch</span>
            </div>
          </div>

          {/* Join VIP Pack Form */}
          <div className="max-w-md mx-auto pt-3">
            {!isSubscribed ? (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email for opening treat perk..."
                  required
                  className="w-full px-4 py-3.5 rounded-2xl bg-white border-2 border-amber-200 text-sm text-amber-950 placeholder:text-amber-800/40 focus:outline-none focus:border-amber-500 shadow-xs font-medium"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3.5 rounded-2xl font-bold text-sm text-white bg-amber-600 hover:bg-amber-700 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer shrink-0 border-2 border-amber-700"
                >
                  {loading ? 'Joining...' : 'Join VIP Pack'}
                  <PawPrintIcon className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-center gap-2 text-sm font-bold text-emerald-800 bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Woof! You are on the VIP alert list.</span>
              </div>
            )}
          </div>

          {/* Urgent Pet Needs Contact */}
          {(theme?.contactEmail || theme?.contactPhone) && (
            <div className="pt-4 text-xs font-medium text-amber-800 flex items-center justify-center gap-4">
              <span>Urgent Pet Order?</span>
              {theme.contactEmail && (
                <a href={`mailto:${theme.contactEmail}`} className="underline font-bold hover:text-amber-950">
                  {theme.contactEmail}
                </a>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-amber-200/80 text-xs text-amber-900/70">
        <div>{theme?.footerCopyright || `© ${new Date().getFullYear()} ${theme?.storeName || 'Pawzy'}. Happy Tails Guaranteed.`}</div>

        <div className="flex items-center gap-4 text-amber-800">
          {theme?.socialInstagram && (
            <a href={theme.socialInstagram} target="_blank" rel="noopener noreferrer" className="hover:text-amber-950 transition">
              <Instagram className="w-4 h-4" />
            </a>
          )}
          {theme?.socialFacebook && (
            <a href={theme.socialFacebook} target="_blank" rel="noopener noreferrer" className="hover:text-amber-950 transition">
              <Facebook className="w-4 h-4" />
            </a>
          )}
          {theme?.socialTwitter && (
            <a href={theme.socialTwitter} target="_blank" rel="noopener noreferrer" className="hover:text-amber-950 transition">
              <Twitter className="w-4 h-4" />
            </a>
          )}
        </div>
      </footer>
    </div>
  );
}
