'use client';

import React, { useState } from 'react';
import type { ThemeConfig } from '@/lib/api/types';
import {
  Zap,
  Mail,
  ArrowRight,
  CheckCircle2,
  Radio,
  Flame,
} from 'lucide-react';
import { Instagram, Facebook, Twitter } from '@/components/shared/SocialIcons';

export default function DefaultMaintenancePage({ theme }: { theme: ThemeConfig }) {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = theme?.maintenanceTitle || 'DROP TRANSMISSION PAUSED // SYSTEM UPGRADE';
  const message =
    theme?.maintenanceMessage ||
    'We are syncing inventory for the upcoming seasonal drop and upgrading the checkout engine for zero-lag cart access. Stand by.';

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
      className="min-h-screen flex flex-col justify-between relative overflow-hidden font-sans bg-[#0B0C10] text-[#E0E2EC]"
    >
      {/* Neon Cyber Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-fuchsia-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-6 py-8 flex items-center justify-between border-b border-zinc-800">
        <div className="flex items-center gap-3">
          {theme?.logo ? (
            <img src={theme.logo} alt={theme.storeName} className="h-8 w-auto object-contain brightness-125" />
          ) : (
            <span className="text-2xl font-black italic tracking-tighter text-white uppercase">
              {theme?.storeName || 'PULSE'}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 px-3 py-1 rounded-sm text-xs font-mono font-bold bg-cyan-950/80 text-cyan-400 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>DROP SYSTEM 2.0</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-2xl w-full mx-auto text-center space-y-8">
          {/* Neon Icon */}
          <div className="inline-flex p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.25)]">
            <Zap className="w-8 h-8" />
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white uppercase italic leading-[1.1]">
              {title}
            </h1>
            <p className="text-base sm:text-lg text-zinc-400 max-w-xl mx-auto font-mono text-sm leading-relaxed">
              {message}
            </p>
          </div>

          {/* Alert Signup */}
          <div className="max-w-md mx-auto pt-4">
            {!isSubscribed ? (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email for drop alert..."
                  required
                  className="w-full px-4 py-3.5 bg-zinc-900/90 border border-zinc-700 text-sm text-white placeholder:text-zinc-500 font-mono focus:outline-none focus:border-cyan-400 transition"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3.5 font-bold text-xs uppercase tracking-wider text-black bg-cyan-400 hover:bg-cyan-300 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer shrink-0 font-mono"
                >
                  {loading ? 'Subscribing...' : 'Get Drop Alert'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-center gap-2 text-xs font-mono font-bold text-cyan-300 bg-cyan-950/60 p-4 border border-cyan-500/40">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>You are verified for priority drop notification.</span>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-zinc-900 font-mono text-xs text-zinc-500">
        <div>{theme?.footerCopyright || `© ${new Date().getFullYear()} ${theme?.storeName || 'Pulse'}. Transmission Encrypted.`}</div>

        <div className="flex items-center gap-4 text-zinc-400">
          {theme?.socialInstagram && (
            <a href={theme.socialInstagram} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition">
              <Instagram className="w-4 h-4" />
            </a>
          )}
          {theme?.socialTwitter && (
            <a href={theme.socialTwitter} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition">
              <Twitter className="w-4 h-4" />
            </a>
          )}
        </div>
      </footer>
    </div>
  );
}
