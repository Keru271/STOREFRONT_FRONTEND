'use client';

import React, { useState, useEffect } from 'react';
import type { ThemeConfig } from '@/lib/api/types';
import { Leaf, Clock, Mail, Phone, MapPin, Check, Sparkles } from 'lucide-react';
import { MarketNestLogo } from './Header';

export default function TechnoMaintenancePage({ theme }: { theme: ThemeConfig }) {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const [timeLeft, setTimeLeft] = useState({
    hours: 7,
    minutes: 42,
    seconds: 15,
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

  const title =
    theme?.maintenanceTitle || 'The Artisan Workshop is Preparing Something Special';
  const message =
    theme?.maintenanceMessage ||
    'Our digital marketplace is undergoing scheduled studio maintenance. Our makers are busily packing new handmade collections and will be back shortly.';

  return (
    <div
      className="min-h-screen flex flex-col justify-between bg-[#FFFBF5] text-[#1C1917] p-6 sm:p-12 relative overflow-hidden antialiased"
      style={{ fontFamily: "'Open Sans', sans-serif" }}
    >
      {/* ── Top Bar with Logo ────────────────────────────────────── */}
      <div className="flex items-center justify-between max-w-5xl mx-auto w-full pb-6 border-b border-[#E7E5E4]">
        <MarketNestLogo />
        <span className="text-[12px] font-semibold text-[#365314] bg-[#DCFCE7] px-3 py-1 rounded-[4px] border border-[#365314]/20 flex items-center gap-1.5">
          <Leaf className="w-3.5 h-3.5" /> Slow Craft Studio
        </span>
      </div>

      {/* ── Center Content ───────────────────────────────────────── */}
      <main className="max-w-2xl mx-auto text-center py-12 space-y-8">
        <div className="w-14 h-14 rounded-[4px] bg-[#C2410C] text-white text-2xl font-bold flex items-center justify-center mx-auto border border-[#9A3412]">
          🏺
        </div>

        <div className="space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-[0.09em] text-[#C2410C]">
            ATELIER UPGRADE IN PROGRESS
          </span>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1C1917] leading-tight"
            style={{ fontFamily: "'Lora', serif" }}
          >
            {title}
          </h1>
          <p className="text-[15px] sm:text-[16px] text-[#57534E] leading-relaxed max-w-xl mx-auto">
            {message}
          </p>
        </div>

        {/* Countdown Timer (Flat bordered cards, mono digits) */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 pt-2">
          {[
            { label: 'Hours', val: String(timeLeft.hours).padStart(2, '0') },
            { label: 'Minutes', val: String(timeLeft.minutes).padStart(2, '0') },
            { label: 'Seconds', val: String(timeLeft.seconds).padStart(2, '0') },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#D6D3D1] rounded-[6px] p-3 sm:p-4 min-w-[76px] sm:min-w-[90px] text-center"
            >
              <span
                className="text-2xl sm:text-3xl font-bold text-[#1C1917] block"
                style={{ fontFamily: "'Source Code Pro', monospace" }}
              >
                {item.val}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A8A29E] mt-0.5 block">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Notify Me On Reopening */}
        <div className="bg-white border border-[#E7E5E4] rounded-[8px] p-6 max-w-md mx-auto text-left space-y-3">
          <h3 className="text-[14px] font-semibold text-[#1C1917]">
            Get notified the moment our doors reopen:
          </h3>

          {isSubscribed ? (
            <div className="p-3 bg-[#DCFCE7] border border-[#22C55E]/40 text-[#166534] text-[13px] rounded-[4px] flex items-center gap-2">
              <Check className="w-4 h-4 text-[#166534]" />
              <span>Thank you! We will email you right as the workshop goes live.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="flex-1 h-[42px] px-3.5 bg-white text-[13px] border-[1.5px] border-[#D6D3D1] rounded-[4px] focus:border-[#C2410C] outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="h-[42px] px-5 rounded-[4px] bg-[#C2410C] hover:bg-[#9A3412] text-white text-[13px] font-semibold flex items-center justify-center transition-colors flex-shrink-0"
              >
                {loading ? 'Subscribing...' : 'Notify Me'}
              </button>
            </form>
          )}
        </div>
      </main>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="max-w-5xl mx-auto w-full pt-6 border-t border-[#E7E5E4] flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-[#A8A29E]">
        <p>© {new Date().getFullYear()} {theme.storeName || 'MarketNest'}. Artisan craft guarantee.</p>
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5 text-[#57534E]">
            <MapPin className="w-3.5 h-3.5 text-[#D4A373]" /> Asheville, NC & Kyoto, Japan
          </span>
          {theme.contactEmail && (
            <span className="flex items-center gap-1 text-[#57534E]">
              <Mail className="w-3.5 h-3.5 text-[#D4A373]" /> {theme.contactEmail}
            </span>
          )}
        </div>
      </footer>
    </div>
  );
}
