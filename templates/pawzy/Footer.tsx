'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { PawzyLogo } from './Header';

export default function PawzyFooter() {
  const { theme } = useTheme();

  return (
    <footer
      className="w-full bg-[#f6f3f7] text-[#6b7280] pt-16 pb-10 border-t border-[#eaeaea]"
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* ── Top Newsletter Banner ──────────────────────────────────────── */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#eaeaea] shadow-xs text-center max-w-3xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#ffd100] text-[#1f2937] flex items-center justify-center text-2xl mx-auto">
            📩
          </div>
          <h3
            className="text-2xl sm:text-3xl font-bold text-[#1f2937]"
            style={{ fontFamily: "'Fredoka', sans-serif" }}
          >
            Subscribe For Our Newsletter
          </h3>
          <p className="text-[13.44px] text-[#6b7280] max-w-md mx-auto">
            Get exclusive pet care tips, new product drops, and 15% off your first order.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert('Thank you for subscribing to Pawzy News!');
            }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-md mx-auto"
          >
            <input
              type="email"
              required
              placeholder="Enter your email address..."
              className="w-full sm:flex-1 px-5 py-3 rounded-full bg-[#f5f5f5] border border-[#eaeaea] text-[#1f2937] placeholder:text-[#9ca3af] text-[13.33px] focus:outline-none focus:border-[#ffd100] transition"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#ffd100] hover:bg-[#ecbd00] text-[#1f2937] text-[13.33px] font-bold shadow-xs transition cursor-pointer"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* ── Main Links Grid ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pt-4 border-b border-[#eaeaea] pb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <PawzyLogo className="h-9" />
            <p className="text-[13.44px] text-[#6b7280] leading-relaxed">
              Pawzy is your one-stop paradise for pet nutrition, comfy beds, stimulating toys, and
              certified grooming care. Dedicated to happy paws and healthy tails!
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-2 pt-1">
              {['Facebook', 'Twitter', 'Instagram', 'Pinterest'].map((social, idx) => (
                <span
                  key={idx}
                  className="w-8 h-8 rounded-full bg-white hover:bg-[#ffd100] text-[#1f2937] border border-[#eaeaea] flex items-center justify-center text-xs font-bold transition shadow-2xs cursor-pointer"
                  title={social}
                >
                  {social[0]}
                </span>
              ))}
            </div>
          </div>

          {/* Contact Us */}
          <div className="space-y-3">
            <h4
              className="text-[16px] font-bold text-[#1f2937]"
              style={{ fontFamily: "'Fredoka', sans-serif" }}
            >
              Contact Us
            </h4>
            <ul className="space-y-2.5 text-[13.44px]">
              <li className="flex items-start gap-2">
                <span>📍</span>
                <span>123 Pet Boulevard, New York, NY 10001</span>
              </li>
              <li className="flex items-center gap-2">
                <span>📞</span>
                <span>{theme.contactPhone || '+1 (555) 234-5678'}</span>
              </li>
              <li className="flex items-center gap-2">
                <span>✉️</span>
                <span>{theme.contactEmail || 'support@pawzy-store.com'}</span>
              </li>
              <li className="flex items-center gap-2">
                <span>⏰</span>
                <span>Mon - Sat: 8:00 AM - 9:00 PM</span>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div className="space-y-3">
            <h4
              className="text-[16px] font-bold text-[#1f2937]"
              style={{ fontFamily: "'Fredoka', sans-serif" }}
            >
              Information
            </h4>
            <ul className="space-y-2 text-[13.44px] font-medium text-[#6b7280]">
              <li>
                <Link href="/pages/about" className="hover:text-[#1f2937] transition">
                  About Our Studio
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-[#1f2937] transition">
                  Terms of Delivery
                </Link>
              </li>
              <li>
                <Link href="/pages/privacy" className="hover:text-[#1f2937] transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-[#1f2937] transition">
                  FAQs & Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Our Policies */}
          <div className="space-y-3">
            <h4
              className="text-[16px] font-bold text-[#1f2937]"
              style={{ fontFamily: "'Fredoka', sans-serif" }}
            >
              Our Policies
            </h4>
            <ul className="space-y-2 text-[13.44px] font-medium text-[#6b7280]">
              <li>
                <Link href="/support" className="hover:text-[#1f2937] transition">
                  Pet Care Guarantee
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-[#1f2937] transition">
                  Secure Shopping
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-[#1f2937] transition">
                  Track Your Shipment
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-[#1f2937] transition">
                  Returns & Replacements
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Bottom Bar & Payment Icons ─────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-[#6b7280]">
          <div>
            © {new Date().getFullYear()} {theme.storeName || 'Pawzy - Multipurpose Shopify 2.0 Theme'}. All rights reserved.
          </div>
          <div className="flex items-center gap-3">
            <span className="px-2 py-1 bg-white rounded border border-[#eaeaea] font-bold text-[10px] text-blue-600">VISA</span>
            <span className="px-2 py-1 bg-white rounded border border-[#eaeaea] font-bold text-[10px] text-red-500">Mastercard</span>
            <span className="px-2 py-1 bg-white rounded border border-[#eaeaea] font-bold text-[10px] text-blue-500">PayPal</span>
            <span className="px-2 py-1 bg-white rounded border border-[#eaeaea] font-bold text-[10px] text-black"> Pay</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
