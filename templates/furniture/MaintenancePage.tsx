'use client';

import React, { useState, useEffect } from 'react';
import type { ThemeConfig } from '@/lib/api/types';
import { Clock, Mail, Check, Leaf } from 'lucide-react';
import { AuraBrandLogo } from './Header';

export default function FurnitureMaintenancePage({ theme }: { theme: ThemeConfig }) {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 30,
    seconds: 0,
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
    }, 500);
  };

  const title =
    theme?.maintenanceTitle || 'Our Archive is Preparing for the Next Seasonal Exhibition';
  const message =
    theme?.maintenanceMessage ||
    'Our workshop and sanctuary are currently undergoing scheduled curation. New handcrafted ceramic vessels, lighting archetypes, and organic textiles will arrive shortly.';

  return (
    <div
      className="min-h-screen flex flex-col justify-between bg-[#faf9f6] text-[#1a1c1a] p-6 sm:p-12 relative overflow-hidden antialiased"
      style={{ fontFamily: 'var(--font-plus-jakarta, sans-serif)' }}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between z-10">
        <AuraBrandLogo storeName={theme?.storeName || 'AURA'} />
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#efeeeb] text-[#466557] border border-[#c5e7d6] text-xs font-semibold uppercase tracking-wider">
          <Leaf className="w-3.5 h-3.5" />
          <span>Sanctuary Update</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto my-auto py-16 text-center z-10">
        <h1
          className="text-3xl sm:text-5xl text-[#040505] tracking-tight mb-6 leading-tight"
          style={{ fontFamily: 'var(--font-playfair, serif)' }}
        >
          {title}
        </h1>
        <p className="text-base text-[#444748] leading-relaxed mb-10 max-w-xl mx-auto">
          {message}
        </p>

        {/* Countdown Timer */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="bg-[#ffffff] border border-[#e3e2e0] rounded-xl px-5 py-3 shadow-sm min-w-[80px]">
            <span
              className="text-2xl font-semibold text-[#040505] block"
              style={{ fontFamily: 'var(--font-playfair, serif)' }}
            >
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="text-[10px] uppercase font-bold text-[#747878] tracking-widest">
              Hours
            </span>
          </div>
          <span className="text-xl text-[#c4c7c7]">:</span>
          <div className="bg-[#ffffff] border border-[#e3e2e0] rounded-xl px-5 py-3 shadow-sm min-w-[80px]">
            <span
              className="text-2xl font-semibold text-[#040505] block"
              style={{ fontFamily: 'var(--font-playfair, serif)' }}
            >
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="text-[10px] uppercase font-bold text-[#747878] tracking-widest">
              Mins
            </span>
          </div>
          <span className="text-xl text-[#c4c7c7]">:</span>
          <div className="bg-[#ffffff] border border-[#e3e2e0] rounded-xl px-5 py-3 shadow-sm min-w-[80px]">
            <span
              className="text-2xl font-semibold text-[#040505] block"
              style={{ fontFamily: 'var(--font-playfair, serif)' }}
            >
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
            <span className="text-[10px] uppercase font-bold text-[#747878] tracking-widest">
              Secs
            </span>
          </div>
        </div>

        {/* Notification Subscription */}
        <div className="max-w-md mx-auto">
          {isSubscribed ? (
            <div className="flex items-center justify-center gap-2 p-3 bg-[#c5e7d6] text-[#012116] rounded-xl text-xs font-semibold">
              <Check className="w-4 h-4 text-[#466557]" />
              <span>We will dispatch a private notification the moment doors open.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email for private reopening..."
                className="w-full bg-[#ffffff] border border-[#e3e2e0] rounded-lg px-4 py-2.5 text-xs text-[#040505] placeholder:text-[#747878] focus:outline-none focus:border-[#466557]"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-[#040505] text-white hover:bg-[#466557] px-6 py-2.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap"
              >
                {loading ? 'Subscribing...' : 'Notify Me'}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Footer info */}
      <div className="text-center text-xs text-[#747878] z-10 pt-8 border-t border-[#e3e2e0]">
        <p>© {new Date().getFullYear()} {theme?.storeName || 'AURA'} • Sustainable Craft & Guild Provenance</p>
      </div>
    </div>
  );
}

