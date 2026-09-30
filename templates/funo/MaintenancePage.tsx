'use client';

import React, { useState } from 'react';
import type { ThemeConfig } from '@/lib/api/types';
import {
  Coffee,
  Sparkles,
  Mail,
  ArrowRight,
  CheckCircle2,
  Smile,
  Heart,
} from 'lucide-react';
import { Instagram, Facebook, Twitter } from '@/components/shared/SocialIcons';

export default function FunoMaintenancePage({ theme }: { theme: ThemeConfig }) {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = theme?.maintenanceTitle || 'Taking a Quick Fika Break ☕';
  const message =
    theme?.maintenanceMessage ||
    'We are busy polishing our playful Nordic collections, assembling new furniture inspirations, and brewing some fresh ideas. Back in a splash!';

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
      className="min-h-screen flex flex-col justify-between relative overflow-hidden font-sans bg-[#FFFDF9] text-[#2C2825]"
    >
      {/* Playful Colorful Polka Dots & Soft Shapes */}
      <div className="absolute top-12 left-12 w-28 h-28 rounded-full bg-amber-200/40 blur-2xl pointer-events-none" />
      <div className="absolute bottom-20 right-16 w-36 h-36 rounded-full bg-rose-200/40 blur-2xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-32 h-32 rounded-full bg-emerald-200/30 blur-2xl pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {theme?.logo ? (
            <img src={theme.logo} alt={theme.storeName} className="h-9 w-auto object-contain" />
          ) : (
            <span className="text-2xl font-black tracking-tight text-amber-900">
              {theme?.storeName || 'FUNO'}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200 shadow-sm">
          <Smile className="w-4 h-4 text-amber-600" />
          <span>Polishing Showroom</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-2xl w-full mx-auto text-center space-y-8">
          {/* Animated Coffee Cup / Fika Badge */}
          <div className="inline-flex p-4 rounded-3xl bg-amber-50 border-2 border-amber-200/80 shadow-md transform hover:rotate-3 transition duration-300">
            <Coffee className="w-10 h-10 text-amber-600 animate-bounce" />
          </div>

          {/* Heading & Text */}
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#1F1B18] leading-tight">
              {title}
            </h1>
            <p className="text-base sm:text-lg text-stone-600 max-w-xl mx-auto leading-relaxed font-medium">
              {message}
            </p>
          </div>

          {/* Cheerful Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto pt-2">
            <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-xs flex flex-col items-center text-center">
              <span className="text-2xl mb-1">🛋️</span>
              <span className="text-xs font-bold text-stone-800">Fresh Designs</span>
              <span className="text-[11px] text-stone-500">Curating styles</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-xs flex flex-col items-center text-center">
              <span className="text-2xl mb-1">⚡</span>
              <span className="text-xs font-bold text-stone-800">Speed Boost</span>
              <span className="text-[11px] text-stone-500">Faster checkout</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs flex flex-col items-center text-center">
              <span className="text-2xl mb-1">🎁</span>
              <span className="text-xs font-bold text-stone-800">Surprise Drops</span>
              <span className="text-[11px] text-stone-500">Ready at launch</span>
            </div>
          </div>

          {/* Newsletter Form */}
          <div className="max-w-md mx-auto pt-4">
            {!isSubscribed ? (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email to get opening gift..."
                  required
                  className="w-full px-4 py-3.5 rounded-2xl bg-white border-2 border-stone-200 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-amber-500 shadow-xs font-medium"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3.5 rounded-2xl font-bold text-sm text-amber-950 bg-amber-400 hover:bg-amber-300 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer shrink-0 border-2 border-amber-500"
                >
                  {loading ? 'Adding...' : 'Notify Me!'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-center gap-2 text-sm font-bold text-emerald-800 bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Hurray! We saved your spot for opening day perks.</span>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stone-200/80 text-xs text-stone-500">
        <div>{theme?.footerCopyright || `© ${new Date().getFullYear()} ${theme?.storeName || 'Funo'}. Made with hygge.`}</div>

        <div className="flex items-center gap-4 text-stone-600">
          {theme?.socialInstagram && (
            <a href={theme.socialInstagram} target="_blank" rel="noopener noreferrer" className="hover:text-amber-600 transition">
              <Instagram className="w-4 h-4" />
            </a>
          )}
          {theme?.socialFacebook && (
            <a href={theme.socialFacebook} target="_blank" rel="noopener noreferrer" className="hover:text-amber-600 transition">
              <Facebook className="w-4 h-4" />
            </a>
          )}
          {theme?.socialTwitter && (
            <a href={theme.socialTwitter} target="_blank" rel="noopener noreferrer" className="hover:text-amber-600 transition">
              <Twitter className="w-4 h-4" />
            </a>
          )}
        </div>
      </footer>
    </div>
  );
}
