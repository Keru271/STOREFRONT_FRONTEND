'use client';

import React, { useState, useEffect } from 'react';
import type { ThemeConfig } from '@/lib/api/types';
import {
  Wrench,
  Clock,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Hammer,
  Layers,
} from 'lucide-react';
import { Instagram, Facebook, Twitter, Linkedin } from '@/components/shared/SocialIcons';

export default function MincomMaintenancePage({ theme }: { theme: ThemeConfig }) {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 45,
    seconds: 30,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsSubscribed(true);
    }, 600);
  };

  const title = theme?.maintenanceTitle || 'Crafting a Better Living Space';
  const message =
    theme?.maintenanceMessage ||
    'Our digital showroom is currently undergoing scheduled enhancements to bring you an even more refined interior and furniture shopping experience.';

  return (
    <div
      className="min-h-screen flex flex-col justify-between relative overflow-hidden font-sans"
      style={{
        backgroundColor: 'var(--sf-bg, #FAF8F5)',
        color: 'var(--sf-text, #1E1E1E)',
      }}
    >
      {/* Background Architectural Grid & Subtle Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      <div
        className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: 'var(--sf-primary, #C5A880)' }}
      />
      <div
        className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ backgroundColor: 'var(--sf-accent, #8A6D48)' }}
      />

      {/* Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8 flex items-center justify-between border-b border-stone-200/60 dark:border-stone-800/60">
        <div className="flex items-center gap-3">
          {theme?.logo ? (
            <img src={theme.logo} alt={theme.storeName} className="h-9 w-auto object-contain" />
          ) : (
            <span className="text-2xl font-serif tracking-tight font-bold text-stone-900 dark:text-stone-100">
              {theme?.storeName || 'MINCOM'}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide uppercase bg-amber-100/70 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300/40 dark:border-amber-700/40">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          Showroom Renovation
        </div>
      </header>

      {/* Main Hero Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-3xl w-full mx-auto text-center space-y-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-stone-200/60 dark:bg-stone-800/60 text-stone-700 dark:text-stone-300">
            <Hammer className="w-3.5 h-3.5 text-stone-500" />
            <span>Scheduled Maintenance & Upgrades</span>
          </div>

          {/* Heading & Subheading */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-medium tracking-tight text-stone-900 dark:text-stone-50 leading-[1.15]">
              {title}
            </h1>
            <p className="text-base sm:text-lg text-stone-600 dark:text-stone-400 max-w-2xl mx-auto leading-relaxed">
              {message}
            </p>
          </div>

          {/* Live Countdown Timer */}
          <div className="pt-2">
            <div className="text-xs font-medium uppercase tracking-widest text-stone-500 dark:text-stone-400 mb-4">
              Estimated Showroom Re-Opening In
            </div>
            <div className="inline-grid grid-cols-3 gap-4 sm:gap-6 bg-white/70 dark:bg-stone-900/70 p-4 sm:p-6 rounded-2xl shadow-sm border border-stone-200/80 dark:border-stone-800/80 backdrop-blur-md">
              <div className="flex flex-col items-center">
                <span className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-stone-100">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[11px] font-medium text-stone-500 dark:text-stone-400 uppercase mt-1">Hours</span>
              </div>
              <div className="text-3xl font-serif text-stone-400 dark:text-stone-600 flex items-center justify-center">:</div>
              <div className="flex flex-col items-center">
                <span className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-stone-100">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[11px] font-medium text-stone-500 dark:text-stone-400 uppercase mt-1">Mins</span>
              </div>
            </div>
          </div>

          {/* Newsletter Notification */}
          <div className="max-w-md mx-auto pt-2">
            {!isSubscribed ? (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email for opening alert..."
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-800 dark:focus:ring-stone-200 transition"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 rounded-xl font-medium text-sm text-white bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-70 cursor-pointer shrink-0"
                >
                  {loading ? 'Subscribing...' : 'Notify Me'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800/40">
                <CheckCircle2 className="w-4 h-4" />
                <span>Thank you! We will notify you the moment our doors reopen.</span>
              </div>
            )}
          </div>

          {/* Quick Contact & Inquiries */}
          {(theme?.contactEmail || theme?.contactPhone) && (
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-stone-500 dark:text-stone-400 border-t border-stone-200/50 dark:border-stone-800/50 max-w-lg mx-auto">
              {theme.contactEmail && (
                <a
                  href={`mailto:${theme.contactEmail}`}
                  className="inline-flex items-center gap-1.5 hover:text-stone-900 dark:hover:text-stone-100 transition"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{theme.contactEmail}</span>
                </a>
              )}
              {theme.contactPhone && (
                <a
                  href={`tel:${theme.contactPhone}`}
                  className="inline-flex items-center gap-1.5 hover:text-stone-900 dark:hover:text-stone-100 transition"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{theme.contactPhone}</span>
                </a>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stone-200/60 dark:border-stone-800/60 text-xs text-stone-500 dark:text-stone-400">
        <p>{theme?.footerCopyright || `© ${new Date().getFullYear()} ${theme?.storeName || 'OmniStore'}. All rights reserved.`}</p>

        {/* Social Links */}
        <div className="flex items-center gap-3">
          {theme?.socialInstagram && (
            <a href={theme.socialInstagram} target="_blank" rel="noopener noreferrer" className="hover:text-stone-900 dark:hover:text-stone-100 transition">
              <Instagram className="w-4 h-4" />
            </a>
          )}
          {theme?.socialFacebook && (
            <a href={theme.socialFacebook} target="_blank" rel="noopener noreferrer" className="hover:text-stone-900 dark:hover:text-stone-100 transition">
              <Facebook className="w-4 h-4" />
            </a>
          )}
          {theme?.socialTwitter && (
            <a href={theme.socialTwitter} target="_blank" rel="noopener noreferrer" className="hover:text-stone-900 dark:hover:text-stone-100 transition">
              <Twitter className="w-4 h-4" />
            </a>
          )}
          {theme?.socialLinkedin && (
            <a href={theme.socialLinkedin} target="_blank" rel="noopener noreferrer" className="hover:text-stone-900 dark:hover:text-stone-100 transition">
              <Linkedin className="w-4 h-4" />
            </a>
          )}
        </div>
      </footer>
    </div>
  );
}
