'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { FunoLogo } from './Header';

export default function FunoFooter() {
  const { theme } = useTheme();

  return (
    <footer className="w-full bg-[#161616] text-[#a0a0a0] pt-16 pb-12 border-t border-[#262626]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Newsletter & Brand Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-14 border-b border-[#282828]">
          
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-5">
            <div className="text-white">
              <FunoLogo className="h-9 brightness-0 invert" />
            </div>
            <p className="text-xs text-[#888] leading-relaxed max-w-sm">
              Contemporary furniture and Scandinavian interior objects designed for calm, functional living. Sourced responsibly and crafted to endure.
            </p>
            <div className="space-y-1.5 text-xs text-[#aaa]">
              {theme.contactPhone && (
                <div>📞 Direct Line: <strong className="text-white">{theme.contactPhone}</strong></div>
              )}
              {theme.contactEmail && (
                <div>✉️ Concierge: <strong className="text-white">{theme.contactEmail}</strong></div>
              )}
            </div>
          </div>

          {/* Quick Links Column 1: Shop */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-black text-white uppercase tracking-widest">
              Catalog
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <Link href="/products?category=living-room" className="hover:text-white hover:underline transition">
                  Living Room
                </Link>
              </li>
              <li>
                <Link href="/products?category=bedroom" className="hover:text-white hover:underline transition">
                  Bedroom Suites
                </Link>
              </li>
              <li>
                <Link href="/products?category=dining" className="hover:text-white hover:underline transition">
                  Dining & Kitchen
                </Link>
              </li>
              <li>
                <Link href="/products?category=lighting" className="hover:text-white hover:underline transition">
                  Lighting & Lamps
                </Link>
              </li>
              <li>
                <Link href="/products?category=decor" className="hover:text-white hover:underline transition">
                  Ceramics & Accents
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links Column 2: Studio */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-black text-white uppercase tracking-widest">
              Studio
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <Link href="/pages/about" className="hover:text-white hover:underline transition">
                  Our Philosophy
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-white hover:underline transition">
                  Lookbook & Drops
                </Link>
              </li>
              <li>
                <Link href="/pages/faq" className="hover:text-white hover:underline transition">
                  Care & Warranty
                </Link>
              </li>
              <li>
                <Link href="/pages/contact" className="hover:text-white hover:underline transition">
                  Studio Locations
                </Link>
              </li>
              <li>
                <Link href="/pages/privacy" className="hover:text-white hover:underline transition">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs font-black text-white uppercase tracking-widest">
              Join Our Design Journal
            </h4>
            <p className="text-xs text-[#888] leading-relaxed">
              Subscribe to receive preview invites for seasonal drops, craft stories, and exclusive subscriber perks.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Thank you for subscribing to Funie Journal!'); }} className="flex gap-2">
              <input
                type="email"
                required
                placeholder="Enter your email address..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#222] border border-[#333] text-white placeholder:text-[#666] text-xs focus:outline-none focus:border-orange-500 transition"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition shadow"
              >
                Join
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Copyright & Badges */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#666]">
          <div>
            © {new Date().getFullYear()} {theme.storeName || 'Funie Furniture Studio'}. All rights reserved.
          </div>
          <div className="flex items-center gap-6 text-[#888]">
            <span className="flex items-center gap-1.5">
              <span>🌿</span> 100% Sustainable Woods
            </span>
            <span className="flex items-center gap-1.5">
              <span>🛡️</span> 5-Year Craft Guarantee
            </span>
            <span className="flex items-center gap-1.5">
              <span>🚚</span> Express White-Glove Delivery
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
