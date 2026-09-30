'use client';

import React, { useState } from 'react';
import type { ThemeConfig } from '@/lib/api/types';
import {
  Sparkles,
  Mail,
  Lock,
  ArrowRight,
  CheckCircle2,
  Crown,
} from 'lucide-react';
import { Instagram, Facebook, Twitter, Linkedin } from '@/components/shared/SocialIcons';

export default function LuxeMaintenancePage({ theme }: { theme: ThemeConfig }) {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = theme?.maintenanceTitle || 'Private Salon Under Exclusive Curation';
  const message =
    theme?.maintenanceMessage ||
    'Our digital atelier is currently preparing an exquisite new collection. Access to the boutique is temporarily reserved for private preview staging.';

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsSubscribed(true);
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between relative bg-[#0A0A0A] text-[#E5E5E5] font-serif overflow-hidden selection:bg-[#D4AF37] selection:text-black">
      {/* Opulent Gold Gradients & Ambient Dust */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1C1813] via-[#0A0A0A] to-[#0A0A0A] pointer-events-none" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#D4AF37]/15 to-transparent rounded-full blur-[120px] pointer-events-none" />

      {/* Decorative Border Frame */}
      <div className="absolute inset-4 sm:inset-8 border border-[#D4AF37]/20 pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-8 sm:px-12 py-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {theme?.logo ? (
            <img src={theme.logo} alt={theme.storeName} className="h-10 w-auto object-contain brightness-125" />
          ) : (
            <span className="text-2xl sm:text-3xl tracking-[0.25em] uppercase font-light text-[#F3E5AB]">
              {theme?.storeName || 'LUXE ATELIER'}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1 text-[11px] font-sans tracking-[0.2em] uppercase border border-[#D4AF37]/40 text-[#D4AF37] bg-[#D4AF37]/5">
          <Crown className="w-3.5 h-3.5" />
          <span>Private Curation</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-8 sm:px-12 py-12">
        <div className="max-w-2xl w-full mx-auto text-center space-y-10">
          {/* Subtle Icon */}
          <div className="flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border border-[#D4AF37]/30 flex items-center justify-center bg-[#D4AF37]/5 shadow-[0_0_30px_rgba(212,175,55,0.15)]">
              <Sparkles className="w-7 h-7 text-[#D4AF37]" />
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-5">
            <div className="text-[12px] font-sans uppercase tracking-[0.3em] text-[#D4AF37]">
              Haute Couture & Fine Living
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight text-[#FAF5E8] leading-tight font-serif">
              {title}
            </h1>
            <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto my-6" />
            <p className="text-sm sm:text-base text-zinc-400 font-sans max-w-xl mx-auto leading-relaxed font-light">
              {message}
            </p>
          </div>

          {/* VIP Invitation Form */}
          <div className="max-w-md mx-auto pt-4">
            {!isSubscribed ? (
              <form onSubmit={handleSubscribe} className="space-y-3 font-sans">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Request VIP Reopening Invitation..."
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-black/70 border border-[#D4AF37]/30 text-xs text-[#FAF5E8] placeholder:text-zinc-500 tracking-wider focus:outline-none focus:border-[#D4AF37] transition"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-[#C5A028] via-[#D4AF37] to-[#B38F1E] text-black font-semibold text-xs tracking-[0.25em] uppercase hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.2)] cursor-pointer disabled:opacity-70"
                >
                  {loading ? 'Submitting...' : 'Request Private Access'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-center gap-2 text-xs font-sans tracking-wider text-[#D4AF37] bg-[#D4AF37]/10 p-4 border border-[#D4AF37]/30">
                <CheckCircle2 className="w-4 h-4" />
                <span>Your private access request has been recorded with our concierge.</span>
              </div>
            )}
          </div>

          {/* Concierge Hotline */}
          {theme?.contactEmail && (
            <div className="pt-4 text-xs font-sans tracking-widest uppercase text-zinc-500">
              Concierge Inquiries:{' '}
              <a href={`mailto:${theme.contactEmail}`} className="text-[#D4AF37] hover:underline">
                {theme.contactEmail}
              </a>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto px-8 sm:px-12 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-[11px] text-zinc-500 tracking-widest uppercase">
        <div>{theme?.footerCopyright || `© ${new Date().getFullYear()} ${theme?.storeName || 'OmniStore'}. By Appointment Only.`}</div>

        <div className="flex items-center gap-4 text-zinc-400">
          {theme?.socialInstagram && (
            <a href={theme.socialInstagram} target="_blank" rel="noopener noreferrer" className="hover:text-[#D4AF37] transition">
              <Instagram className="w-4 h-4" />
            </a>
          )}
          {theme?.socialFacebook && (
            <a href={theme.socialFacebook} target="_blank" rel="noopener noreferrer" className="hover:text-[#D4AF37] transition">
              <Facebook className="w-4 h-4" />
            </a>
          )}
          {theme?.socialTwitter && (
            <a href={theme.socialTwitter} target="_blank" rel="noopener noreferrer" className="hover:text-[#D4AF37] transition">
              <Twitter className="w-4 h-4" />
            </a>
          )}
        </div>
      </footer>
    </div>
  );
}
