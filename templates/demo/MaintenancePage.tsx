'use client';

import React, { useState } from 'react';
import type { ThemeConfig } from '@/lib/api/types';
import {
  Compass,
  Mail,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Layers,
  Layout,
} from 'lucide-react';
import { Instagram, Facebook, Twitter } from '@/components/shared/SocialIcons';

export default function DemoMaintenancePage({ theme }: { theme: ThemeConfig }) {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = theme?.maintenanceTitle || 'Designing the Next Showcase';
  const message =
    theme?.maintenanceMessage ||
    'Our multipurpose studio is refreshing showroom layouts, modern collections, and interactive experience suites. Re-opening soon!';

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
      className="min-h-screen flex flex-col justify-between relative overflow-hidden font-sans bg-[#111315] text-[#EDEDED]"
    >
      {/* Dynamic Studio Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#181B1F] via-[#111315] to-[#0D0F11] pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-orange-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-6 py-8 flex items-center justify-between border-b border-zinc-800/80">
        <div className="flex items-center gap-3">
          {theme?.logo ? (
            <img src={theme.logo} alt={theme.storeName} className="h-8 w-auto object-contain" />
          ) : (
            <span className="text-xl font-bold tracking-tight text-white">
              {theme?.storeName || 'DEMO STUDIO'}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-orange-500/10 text-orange-400 border border-orange-500/30">
          <Compass className="w-3.5 h-3.5 animate-spin" />
          <span>Stage: Studio Refresh</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-2xl w-full mx-auto text-center space-y-8">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide bg-zinc-800/90 text-zinc-300 border border-zinc-700">
            <Layout className="w-3.5 h-3.5 text-orange-400" />
            <span>Interactive Catalog Refresh</span>
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              {title}
            </h1>
            <p className="text-base sm:text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed">
              {message}
            </p>
          </div>

          {/* Feature Highlights Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto pt-2">
            <div className="bg-zinc-900/80 p-4 rounded-xl border border-zinc-800 text-left">
              <div className="text-orange-400 text-xs font-mono mb-1">01 // REFINEMENT</div>
              <div className="text-sm font-semibold text-white">Adaptive Themes</div>
              <div className="text-xs text-zinc-400 mt-1">Multi-device fluid rendering</div>
            </div>
            <div className="bg-zinc-900/80 p-4 rounded-xl border border-zinc-800 text-left">
              <div className="text-orange-400 text-xs font-mono mb-1">02 // CATALOG</div>
              <div className="text-sm font-semibold text-white">3D Product Views</div>
              <div className="text-xs text-zinc-400 mt-1">Immersive AR previews</div>
            </div>
            <div className="bg-zinc-900/80 p-4 rounded-xl border border-zinc-800 text-left">
              <div className="text-orange-400 text-xs font-mono mb-1">03 // CHECKOUT</div>
              <div className="text-sm font-semibold text-white">Instant Express</div>
              <div className="text-xs text-zinc-400 mt-1">One-click checkout flow</div>
            </div>
          </div>

          {/* Notification Form */}
          <div className="max-w-md mx-auto pt-2">
            {!isSubscribed ? (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email to get notified..."
                  required
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-orange-500 transition"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 rounded-xl font-semibold text-sm text-zinc-950 bg-orange-400 hover:bg-orange-300 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer shrink-0"
                >
                  {loading ? 'Subscribing...' : 'Notify Me'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-center gap-2 text-sm font-medium text-emerald-400 bg-emerald-950/40 p-3.5 rounded-xl border border-emerald-800/40">
                <CheckCircle2 className="w-4 h-4" />
                <span>Thank you! We will notify you when the new showcase goes live.</span>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-zinc-800/80 text-xs text-zinc-500">
        <div>{theme?.footerCopyright || `© ${new Date().getFullYear()} ${theme?.storeName || 'Demo Studio'}. All rights reserved.`}</div>

        <div className="flex items-center gap-4 text-zinc-400">
          {theme?.socialInstagram && (
            <a href={theme.socialInstagram} target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
              <Instagram className="w-4 h-4" />
            </a>
          )}
          {theme?.socialFacebook && (
            <a href={theme.socialFacebook} target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
              <Facebook className="w-4 h-4" />
            </a>
          )}
          {theme?.socialTwitter && (
            <a href={theme.socialTwitter} target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
              <Twitter className="w-4 h-4" />
            </a>
          )}
        </div>
      </footer>
    </div>
  );
}
