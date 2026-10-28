'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { useMenu } from '@/hooks/useMenu';
import { MarketNestLogo } from './Header';
import {
  Heart,
  Mail,
  ShieldCheck,
  Truck,
  Leaf,
  Users,
  Award,
  Sparkles,
  MapPin,
  Check,
} from 'lucide-react';
import { Instagram, Facebook, Twitter, Linkedin } from '@/components/shared/SocialIcons';

export default function TechnoFooter() {
  const { theme } = useTheme();
  const { items: cmsFooterItems } = useMenu('footer');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const footerLinks = {
    discover: [
      { label: 'Ceramics & Stoneware', href: '/products?category=ceramics' },
      { label: 'Handwoven Textiles', href: '/products?category=textiles' },
      { label: 'Solid Wood Furniture', href: '/products?category=woodwork' },
      { label: 'Handcrafted Jewelry', href: '/products?category=jewelry' },
      { label: 'Botanical Candles & Scents', href: '/products?category=home' },
      { label: 'Featured Collections', href: '/collections' },
    ],
    makers: [
      { label: 'Meet the Makers', href: '/about' },
      { label: 'Artisan Directory', href: '/makers' },
      { label: 'Craft Standards & Materials', href: '/standards' },
      { label: 'Apply as an Artisan', href: '/sell' },
      { label: 'Maker Stories & Journal', href: '/journal' },
    ],
    support: [
      { label: 'Track Order & Shipping', href: '/account' },
      { label: '30-Day Artisan Returns', href: '/returns' },
      { label: 'Help & FAQs', href: '/support' },
      { label: 'Carbon-Neutral Delivery', href: '/shipping' },
      { label: 'Contact Workshop Team', href: '/contact' },
    ],
  };

  return (
    <footer
      className="w-full bg-[#1C1917] text-[#D6D3D1] border-t border-[#292524] pt-16 pb-12"
      style={{ fontFamily: "'Open Sans', sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* ── 1. Artisan Value Pillars (Flat layout with subtle border) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 sm:p-8 rounded-[8px] bg-[#292524] border border-[#44403C]">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-[4px] bg-[#C2410C]/20 border border-[#C2410C]/40 flex items-center justify-center text-[#C2410C] flex-shrink-0">
              <Users className="w-5 h-5 text-[#D4A373]" />
            </div>
            <div>
              <h4
                className="text-[15px] font-semibold text-white"
                style={{ fontFamily: "'Lora', serif" }}
              >
                1,200+ Independent Makers
              </h4>
              <p className="text-[12px] text-[#A8A29E] mt-0.5 leading-relaxed">
                Directly supporting family workshops and local artisans.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-[4px] bg-[#365314]/30 border border-[#365314] flex items-center justify-center text-[#DCFCE7] flex-shrink-0">
              <Leaf className="w-5 h-5 text-[#86EFAC]" />
            </div>
            <div>
              <h4
                className="text-[15px] font-semibold text-white"
                style={{ fontFamily: "'Lora', serif" }}
              >
                100% Natural Materials
              </h4>
              <p className="text-[12px] text-[#A8A29E] mt-0.5 leading-relaxed">
                Clay, solid timber, pure wool, and non-toxic botanical glazes.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-[4px] bg-[#C2410C]/20 border border-[#C2410C]/40 flex items-center justify-center text-[#C2410C] flex-shrink-0">
              <Truck className="w-5 h-5 text-[#D4A373]" />
            </div>
            <div>
              <h4
                className="text-[15px] font-semibold text-white"
                style={{ fontFamily: "'Lora', serif" }}
              >
                Carbon-Neutral Shipping
              </h4>
              <p className="text-[12px] text-[#A8A29E] mt-0.5 leading-relaxed">
                Plastic-free, biodegradable packaging delivered consciously.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-[4px] bg-[#365314]/30 border border-[#365314] flex items-center justify-center text-[#DCFCE7] flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#86EFAC]" />
            </div>
            <div>
              <h4
                className="text-[15px] font-semibold text-white"
                style={{ fontFamily: "'Lora', serif" }}
              >
                Artisan Guarantee
              </h4>
              <p className="text-[12px] text-[#A8A29E] mt-0.5 leading-relaxed">
                Authenticity promised with 30-day returns and repair support.
              </p>
            </div>
          </div>
        </div>

        {/* ── 2. Workshop Newsletter Box ───────────────────────────── */}
        {theme.footerShowNewsletter !== false && (
          <div className="rounded-[8px] bg-[#292524] border border-[#44403C] p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#D4A373] flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> Stories From The Workshop
              </span>
              <h3
                className="text-2xl sm:text-3xl font-semibold text-white"
                style={{ fontFamily: "'Lora', serif" }}
              >
                Join our circle of craft and design lovers
              </h3>
              <p className="text-[#A8A29E] text-[13px] max-w-xl leading-relaxed">
                Receive weekly maker studio visits, slow-living inspiration, and early access to
                strictly limited handmade batches.
              </p>
            </div>

            <div className="lg:col-span-5">
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email for maker stories..."
                  className="flex-1 h-[44px] px-4 rounded-[4px] bg-[#1C1917] text-white text-[13px] border border-[#57534E] focus:border-[#C2410C] outline-none placeholder:text-[#A8A29E]"
                />
                <button
                  type="submit"
                  className="h-[44px] px-6 rounded-[4px] bg-[#C2410C] hover:bg-[#9A3412] active:bg-[#7C2D12] text-white text-[13px] font-semibold transition-colors flex-shrink-0 flex items-center justify-center gap-1.5"
                >
                  {subscribed ? (
                    <>
                      <Check className="w-4 h-4" /> Welcome!
                    </>
                  ) : (
                    'Subscribe'
                  )}
                </button>
              </form>
              <p className="text-[11px] text-[#78716C] mt-2">
                No marketing clutter. Unsubscribe at any time.
              </p>
            </div>
          </div>
        )}

        {/* ── 3. Multi-Column Navigation Links ─────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#292524]">
          {/* Brand Story Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-[4px] bg-[#C2410C] flex items-center justify-center text-white font-bold">
                  🌿
                </div>
                <span
                  className="text-2xl font-bold tracking-tight text-white"
                  style={{ fontFamily: "'Lora', serif" }}
                >
                  {theme.storeName || 'MarketNest'}
                </span>
              </div>
            </Link>

            <p className="text-[13px] text-[#A8A29E] leading-relaxed max-w-sm">
              A curated marketplace for handmade goods and independent ateliers. Every product is
              crafted with natural materials and has a human maker behind it.
            </p>

            <div className="pt-2 text-[12px] text-[#A8A29E] space-y-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#D4A373]" />
                <span>Headquarters: Asheville, NC & Kyoto, Japan</span>
              </div>
              {theme.contactEmail && (
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#D4A373]" />
                  <span>{theme.contactEmail}</span>
                </div>
              )}
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-[4px] border border-[#44403C] flex items-center justify-center text-[#D6D3D1] hover:text-[#C2410C] hover:border-[#C2410C] transition"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-[4px] border border-[#44403C] flex items-center justify-center text-[#D6D3D1] hover:text-[#C2410C] hover:border-[#C2410C] transition"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-[4px] border border-[#44403C] flex items-center justify-center text-[#D6D3D1] hover:text-[#C2410C] hover:border-[#C2410C] transition"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-[4px] border border-[#44403C] flex items-center justify-center text-[#D6D3D1] hover:text-[#C2410C] hover:border-[#C2410C] transition"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links Column 1: Discover */}
          <div className="space-y-3">
            <h5
              className="text-[14px] font-semibold text-white tracking-wide uppercase"
              style={{ fontFamily: "'Lora', serif" }}
            >
              Handcrafted Goods
            </h5>
            <ul className="space-y-2 text-[13px]">
              {footerLinks.discover.map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.href}
                    className="text-[#A8A29E] hover:text-[#D4A373] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column 2: Maker Community */}
          <div className="space-y-3">
            <h5
              className="text-[14px] font-semibold text-white tracking-wide uppercase"
              style={{ fontFamily: "'Lora', serif" }}
            >
              For Artisans
            </h5>
            <ul className="space-y-2 text-[13px]">
              {footerLinks.makers.map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.href}
                    className="text-[#A8A29E] hover:text-[#D4A373] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column 3: Customer Care */}
          <div className="space-y-3">
            <h5
              className="text-[14px] font-semibold text-white tracking-wide uppercase"
              style={{ fontFamily: "'Lora', serif" }}
            >
              Customer Care
            </h5>
            <ul className="space-y-2 text-[13px]">
              {footerLinks.support.map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.href}
                    className="text-[#A8A29E] hover:text-[#D4A373] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── 4. Copyright & Provenance Bar ────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-[#78716C]">
          <p>© {new Date().getFullYear()} {theme.storeName || 'MarketNest'}. Handcrafted with care.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition">
              Terms of Craft
            </Link>
            <Link href="/standards" className="hover:text-white transition">
              Artisan Charter
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
