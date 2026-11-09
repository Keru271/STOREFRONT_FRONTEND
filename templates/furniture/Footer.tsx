'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { useMenu } from '@/hooks/useMenu';
import { AuraBrandLogo } from './Header';
import { Leaf, ArrowRight, ShieldCheck, Check } from 'lucide-react';

export default function FurnitureFooter() {
  const { theme } = useTheme();
  const { items: cmsFooterItems } = useMenu('footer');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const storeTitle = theme.storeName || 'AURA Goods';

  return (
    <footer className="w-full bg-[#f4f3f1] text-[#1a1c1a] pt-16 pb-12 border-t border-[#e3e2e0]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
          {/* Brand + Journal Newsletter */}
          <div className="lg:col-span-4">
            <p
              className="text-[22px] font-semibold text-[#040505] mb-3"
              style={{ fontFamily: 'var(--font-playfair, serif)' }}
            >
              {storeTitle}
            </p>
            <p
              className="text-[14px] text-[#444748] max-w-sm mb-6 leading-relaxed"
              style={{ fontFamily: 'var(--font-plus-jakarta, sans-serif)' }}
            >
              Curated living through mindful materiality. We honor heritage craftsmanship,
              earth-kind finishes, and timeless architectural proportion.
            </p>

            <div className="max-w-md">
              <p
                className="text-[11px] font-semibold text-[#040505] uppercase mb-2 tracking-wider"
                style={{ fontFamily: 'var(--font-plus-jakarta, sans-serif)' }}
              >
                Join Our Archive Journal
              </p>
              {subscribed ? (
                <div className="flex items-center gap-2 p-3 bg-[#c5e7d6] text-[#012116] rounded-lg text-xs font-medium">
                  <Check className="w-4 h-4 text-[#466557]" />
                  <span>Welcome to the archive. Your first dispatch is on its way.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex items-stretch gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full bg-[#ffffff] px-4 py-2.5 rounded-lg text-[13px] text-[#1a1c1a] placeholder:text-[#747878] border border-[#e3e2e0] focus:outline-none focus:border-[#466557] transition-colors"
                  />
                  <button
                    type="submit"
                    className="bg-[#040505] text-white hover:bg-[#466557] px-5 py-2.5 rounded-lg text-[13px] font-medium transition-colors whitespace-nowrap"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Curations Column */}
          <div className="lg:col-span-2 lg:col-start-6">
            <p
              className="text-[11px] font-semibold text-[#040505] uppercase mb-4 tracking-wider"
              style={{ fontFamily: 'var(--font-plus-jakarta, sans-serif)' }}
            >
              Curations
            </p>
            <ul className="space-y-2.5 text-[13px]">
              <li>
                <Link href="/products" className="text-[#444748] hover:text-[#040505] transition-colors">
                  All Objects
                </Link>
              </li>
              <li>
                <Link href="/products?category=furniture" className="text-[#444748] hover:text-[#040505] transition-colors">
                  Artisanal Furniture
                </Link>
              </li>
              <li>
                <Link href="/products?category=ceramics" className="text-[#444748] hover:text-[#040505] transition-colors">
                  Ceramics & Decor
                </Link>
              </li>
              <li>
                <Link href="/products?category=wellness" className="text-[#444748] hover:text-[#040505] transition-colors">
                  Botanical Wellness
                </Link>
              </li>
              <li>
                <Link href="/products?sort=newest" className="text-[#444748] hover:text-[#040505] transition-colors">
                  Seasonal Releases
                </Link>
              </li>
            </ul>
          </div>

          {/* Client Care Column */}
          <div className="lg:col-span-2">
            <p
              className="text-[11px] font-semibold text-[#040505] uppercase mb-4 tracking-wider"
              style={{ fontFamily: 'var(--font-plus-jakarta, sans-serif)' }}
            >
              Client Care
            </p>
            <ul className="space-y-2.5 text-[13px]">
              <li>
                <Link href="/support" className="text-[#444748] hover:text-[#040505] transition-colors">
                  Worldwide Shipping
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-[#444748] hover:text-[#040505] transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-[#444748] hover:text-[#040505] transition-colors">
                  Material Care Guide
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-[#444748] hover:text-[#040505] transition-colors">
                  Bespoke Inquiries
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-[#444748] hover:text-[#040505] transition-colors">
                  Contact Concierge
                </Link>
              </li>
            </ul>
          </div>

          {/* Pledge to Earth Column */}
          <div className="lg:col-span-3">
            <p
              className="text-[11px] font-semibold text-[#040505] uppercase mb-4 tracking-wider"
              style={{ fontFamily: 'var(--font-plus-jakarta, sans-serif)' }}
            >
              Pledge to Earth
            </p>
            <p
              className="text-[13px] text-[#444748] leading-relaxed mb-4"
              style={{ fontFamily: 'var(--font-plus-jakarta, sans-serif)' }}
            >
              100% plastic-free carbon-neutral fulfillment. We partner exclusively with regional guilds
              utilizing responsibly sourced woods, stone, and wildcrafted botanicals.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#efeeeb] text-[#466557] border border-[#c5e7d6]">
              <Leaf className="w-4 h-4" />
              <span className="text-[11px] font-semibold uppercase tracking-wider">
                Certified B-Corp Pending
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Sub-bar */}
        <div className="pt-8 border-t border-[#e3e2e0] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#747878]">
          <div className="flex items-center gap-6">
            <span className="tracking-wider uppercase">
              © {new Date().getFullYear()} {storeTitle.toUpperCase()} INC.
            </span>
            <Link href="/support" className="hover:text-[#040505] transition-colors uppercase tracking-wider">
              PRIVACY
            </Link>
            <Link href="/support" className="hover:text-[#040505] transition-colors uppercase tracking-wider">
              TERMS
            </Link>
          </div>

          {/* Payment Badges */}
          <div className="flex items-center gap-4 text-[11px] font-semibold tracking-wider text-[#444748] uppercase">
            <span>Visa</span>
            <span>Mastercard</span>
            <span>Amex</span>
            <span>Apple Pay</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

