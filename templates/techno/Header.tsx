'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/context/ThemeContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useMenu } from '@/hooks/useMenu';
import { SearchAutocomplete } from '@/components/shared/SearchAutocomplete';
import {
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  MapPin,
  Sparkles,
  ChevronDown,
  Phone,
  Search,
  ExternalLink,
} from 'lucide-react';

export function MarketNestLogo({ className = 'h-9' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 select-none group cursor-pointer ${className}`}>
      {/* Terracotta Artisan Vase / Leaf Emblem */}
      <div className="w-9 h-9 rounded-[4px] bg-[#C2410C] flex items-center justify-center text-white text-lg font-bold transition-transform group-hover:scale-105 border border-[#9A3412]">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 text-white"
        >
          <path d="M10 2v3a6 6 0 0 0 1.5 4M14 2v3a6 6 0 0 1-1.5 4" />
          <path d="M7 10c0 5 2.5 11 5 11s5-6 5-11H7z" />
          <path d="M12 9v12" />
        </svg>
      </div>
      <div className="flex flex-col">
        <span
          className="text-2xl font-bold tracking-tight text-[#1C1917] leading-none"
          style={{ fontFamily: "'Lora', serif" }}
        >
          MarketNest
        </span>
        <span
          className="text-[10px] uppercase font-bold tracking-widest text-[#D4A373] mt-0.5"
          style={{ fontFamily: "'Open Sans', sans-serif" }}
        >
          Handmade & Artisan
        </span>
      </div>
    </div>
  );
}

export default function TechnoHeader() {
  const { theme } = useTheme();
  const { isAuthenticated, customer, logout } = useAuth();
  const { itemCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();
  const { items: menuItems } = useMenu('header');

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const defaultCategories = [
    { label: 'All Handmade Goods', href: '/products' },
    { label: 'Ceramics & Pottery', href: '/products?category=ceramics' },
    { label: 'Woven Textiles', href: '/products?category=textiles' },
    { label: 'Carved Woodcraft', href: '/products?category=woodwork' },
    { label: 'Fine Jewelry', href: '/products?category=jewelry' },
    { label: 'Botanical & Home', href: '/products?category=home' },
    { label: 'Curated Collections', href: '/collections' },
  ];

  return (
    <>
      {/* ── Google Fonts (Lora, Open Sans, Source Code Pro) ────────────────── */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Source+Code+Pro:wght@400;500;600&display=swap"
      />

      {/* ── Top Provenance Bar (Warm Sand & Cream) ─────────────────────────── */}
      <div
        className="w-full bg-[#FAF6F0] text-[#57534E] text-[12px] py-2 px-4 border-b border-[#E7E5E4]"
        style={{ fontFamily: "'Open Sans', sans-serif" }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-6 text-[12px]">
            <span className="flex items-center gap-1.5 font-medium text-[#1C1917]">
              <span className="text-[#365314]">🌿</span> Free shipping on artisan orders over $75
            </span>
            <span className="hidden md:inline-flex items-center gap-1 text-[#57534E]">
              <span className="text-[#C2410C]">🏺</span> Directly supporting 1,200+ independent makers
            </span>
          </div>

          <div className="flex items-center gap-4 text-[12px]">
            {theme.contactPhone && (
              <span className="hidden sm:flex items-center gap-1 text-[#57534E]">
                <Phone className="w-3 h-3 text-[#D4A373]" /> {theme.contactPhone}
              </span>
            )}
            <Link
              href="/support"
              className="text-[#57534E] hover:text-[#C2410C] transition-colors font-medium"
            >
              Artisan Support
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main Sticky Header ────────────────────────────────────────────── */}
      <header
        className={`sticky top-0 z-40 w-full bg-[#FFFBF5] border-b border-[#E7E5E4] transition-shadow ${
          scrolled ? 'border-b-[#D6D3D1]' : ''
        }`}
        style={{ fontFamily: "'Open Sans', sans-serif" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 flex items-center justify-between gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
            className="lg:hidden p-2 rounded-[4px] border border-[#E7E5E4] text-[#1C1917] hover:bg-[#FDF6EC]"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Brand Logo */}
          <Link href="/" className="flex-shrink-0">
            {theme.logo ? (
              <img
                src={theme.logo}
                alt={theme.storeName || 'MarketNest'}
                className="h-10 w-auto object-contain"
              />
            ) : (
              <MarketNestLogo />
            )}
          </Link>

          {/* Desktop Search Bar (MarketNest Border & Focus styling) */}
          <div className="hidden lg:block flex-1 max-w-lg mx-6">
            <div className="relative">
              <SearchAutocomplete
                placeholder="Search handcrafted goods, pottery, linen, makers..."
                inputClassName="w-full h-[42px] px-4 py-2 bg-white text-[14px] text-[#1C1917] placeholder:text-[#A8A29E] border-[1.5px] border-[#D6D3D1] rounded-[4px] focus:border-[#C2410C] focus:ring-2 focus:ring-[#C2410C]/20 outline-none transition"
              />
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative p-2.5 rounded-[4px] border border-[#E7E5E4] text-[#1C1917] hover:text-[#C2410C] hover:bg-[#FDF6EC] transition-colors"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span
                  className="absolute -top-1.5 -right-1.5 bg-[#C2410C] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white"
                  style={{ fontFamily: "'Source Code Pro', monospace" }}
                >
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Bag Button */}
            <button
              onClick={openCart}
              aria-label="Open Shopping Bag"
              className="relative flex items-center gap-2 h-[42px] px-3.5 sm:px-4 rounded-[4px] bg-[#C2410C] hover:bg-[#9A3412] active:bg-[#7C2D12] text-white transition-colors border border-[#C2410C]"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline text-[13px] font-semibold">Bag</span>
              <span
                className="bg-white/20 px-2 py-0.5 rounded-[4px] text-[11px] font-bold"
                style={{ fontFamily: "'Source Code Pro', monospace" }}
              >
                {itemCount}
              </span>
            </button>

            {/* Account / Profile Dropdown */}
            <div className="relative" ref={userMenuRef}>
              {isAuthenticated ? (
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1.5 h-[42px] px-3 rounded-[4px] border border-[#E7E5E4] text-[#1C1917] hover:bg-[#FDF6EC] transition-colors"
                >
                  <User className="w-4 h-4 text-[#C2410C]" />
                  <span className="hidden md:inline text-[13px] font-semibold truncate max-w-[100px]">
                    {customer?.name || 'My Account'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#57534E]" />
                </button>
              ) : (
                <Link
                  href="/auth/login"
                  className="flex items-center gap-1.5 h-[42px] px-3.5 rounded-[4px] border border-[#D6D3D1] text-[#1C1917] hover:bg-[#FDF6EC] hover:border-[#C2410C] transition-colors text-[13px] font-semibold"
                >
                  <User className="w-4 h-4 text-[#57534E]" />
                  <span className="hidden md:inline">Sign In</span>
                </Link>
              )}

              {/* User Dropdown Menu */}
              {userMenuOpen && isAuthenticated && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-[4px] border border-[#D6D3D1] py-2 z-50">
                  <div className="px-4 py-2 border-b border-[#E7E5E4]">
                    <p className="text-[11px] text-[#A8A29E] uppercase tracking-wider font-semibold">
                      Signed in as
                    </p>
                    <p className="text-[13px] font-bold text-[#1C1917] truncate">
                      {customer?.email}
                    </p>
                  </div>
                  <Link
                    href="/account"
                    onClick={() => setUserMenuOpen(false)}
                    className="block px-4 py-2 text-[13px] text-[#1C1917] hover:bg-[#FDF6EC] hover:text-[#C2410C]"
                  >
                    My Orders & Account
                  </Link>
                  <Link
                    href="/wishlist"
                    onClick={() => setUserMenuOpen(false)}
                    className="block px-4 py-2 text-[13px] text-[#1C1917] hover:bg-[#FDF6EC] hover:text-[#C2410C]"
                  >
                    Saved Artisan Goods
                  </Link>
                  <div className="border-t border-[#E7E5E4] my-1" />
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-4 py-2 text-[13px] text-[#DC2626] hover:bg-[#FEE2E2]"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Desktop Category Navigation Bar ─────────────────────────────── */}
        <nav className="hidden lg:block border-t border-[#E7E5E4] bg-[#FFFBF5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ul className="flex items-center gap-8 py-2.5 text-[14px] font-medium overflow-x-auto scrollbar-none">
              {(menuItems && menuItems.length > 0
                ? menuItems
                : defaultCategories
              ).map((cat, idx) => (
                <li key={idx} className="flex-shrink-0">
                  <Link
                    href={cat.href}
                    className="text-[#1C1917] hover:text-[#C2410C] transition-colors py-1 inline-block border-b-2 border-transparent hover:border-[#C2410C]"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      {/* ── Mobile Drawer Menu ────────────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#1C1917]/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative w-full max-w-xs bg-[#FFFBF5] h-full flex flex-col justify-between border-r border-[#E7E5E4] p-6 overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E7E5E4]">
                <MarketNestLogo />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-[4px] border border-[#E7E5E4] text-[#1C1917]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Search */}
              <div className="relative">
                <SearchAutocomplete
                  placeholder="Search handmade items..."
                  inputClassName="w-full h-[40px] px-3.5 bg-white text-[13px] text-[#1C1917] placeholder:text-[#A8A29E] border border-[#D6D3D1] rounded-[4px] focus:border-[#C2410C] outline-none"
                />
              </div>

              {/* Mobile Navigation List */}
              <div className="space-y-1">
                <p className="text-[11px] font-bold uppercase tracking-widest text-[#A8A29E] px-2 mb-2">
                  Shop By Craft
                </p>
                {defaultCategories.map((cat, idx) => (
                  <Link
                    key={idx}
                    href={cat.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2.5 rounded-[4px] text-[15px] font-medium text-[#1C1917] hover:bg-[#FDF6EC] hover:text-[#C2410C]"
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile Footer Links */}
            <div className="pt-6 border-t border-[#E7E5E4] space-y-3">
              <div className="flex items-center gap-2 text-[12px] text-[#57534E]">
                <MapPin className="w-4 h-4 text-[#D4A373]" />
                <span>Supporting local craft studios worldwide</span>
              </div>
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full py-2.5 rounded-[4px] text-[13px] font-semibold text-[#DC2626] border border-[#DC2626] hover:bg-[#FEE2E2]"
                >
                  Sign Out
                </button>
              ) : (
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center w-full py-2.5 rounded-[4px] text-[13px] font-semibold bg-[#C2410C] text-white hover:bg-[#9A3412]"
                >
                  Sign In / Join MarketNest
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
