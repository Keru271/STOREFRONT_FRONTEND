'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/context/ThemeContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCurrency } from '@/hooks/useCurrency';
import { useMenu } from '@/hooks/useMenu';
import { SearchAutocomplete } from '@/components/shared/SearchAutocomplete';
import {
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  Package,
  LogOut,
} from 'lucide-react';

export function AuraBrandLogo({ storeName = 'AURA' }: { storeName?: string }) {
  return (
    <Link href="/" className="flex items-center gap-2.5 group select-none">
      <div className="w-8 h-8 rounded-sm bg-[#040505] flex items-center justify-center text-white transition-transform group-hover:scale-105">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4.5 h-4.5 text-[#faf9f6]"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      </div>
      <span
        className="text-[22px] font-semibold tracking-tight text-[#040505]"
        style={{ fontFamily: 'var(--font-playfair, serif)' }}
      >
        {storeName}
      </span>
    </Link>
  );
}

export default function FurnitureHeader() {
  const { theme } = useTheme();
  const { isAuthenticated, customer, logout } = useAuth();
  const { itemCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();
  const { currency, formatPrice } = useCurrency();
  const { items: menuItems } = useMenu('header');

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
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
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks =
    menuItems && menuItems.length > 0
      ? menuItems.map((item) => ({
        label: item.title,
        href: item.url || '#',
      }))
      : [
        { label: 'Shop All', href: '/products' },
        { label: 'New Arrivals', href: '/products?sort=newest' },
        { label: 'Furniture & Decor', href: '/products?category=furniture' },
        { label: 'Wellness', href: '/products?category=wellness' },
        { label: 'Editorial', href: '/about' },
      ];

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-[#faf9f6]/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.03)] border-b border-[#e3e2e0]/50 transition-all duration-200">
      {/* Top Announcement Bar */}
      <div className="bg-[#e9e8e5] py-1.5 px-4 sm:px-8 text-center border-b border-[#c4c7c7]/20">
        <p
          className="text-[11px] font-semibold text-[#444748] uppercase tracking-widest"
          style={{ fontFamily: 'var(--font-plus-jakarta, sans-serif)' }}
        >
          {theme.headerAnnouncement ||
            'Complimentary worldwide shipping on orders over $150 • Sustainable craft'}
        </p>
      </div>

      {/* Main Nav Container */}
      <div className="h-20 max-w-[1440px] mx-auto px-4 sm:px-8 flex items-center justify-between gap-6">
        {/* Left: Brand + Desktop Navigation */}
        <div className="flex items-center gap-10">
          <AuraBrandLogo storeName={theme.storeName || 'AURA'} />

          <nav
            className="hidden xl:flex items-center gap-6"
            style={{ fontFamily: 'var(--font-plus-jakarta, sans-serif)' }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[13px] font-medium text-[#444748] hover:text-[#040505] transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#040505] after:scale-x-0 after:transition-transform hover:after:scale-x-100"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right: Search, Currency, Wishlist, Bag, Profile */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Autocomplete Search Bar */}
          <div className="hidden lg:block w-64">
            <SearchAutocomplete />
          </div>

          {/* Currency Indicator */}
          <div className="hidden md:flex items-center px-2 py-1 text-[#444748]">
            <span
              className="text-[11px] font-semibold uppercase tracking-wider"
              style={{ fontFamily: 'var(--font-plus-jakarta, sans-serif)' }}
            >
              {currency || 'USD'} $
            </span>
          </div>

          {/* Wishlist Icon */}
          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className="relative p-2 text-[#444748] hover:text-[#040505] transition-colors"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#466557] text-white rounded-full flex items-center justify-center text-[9px] font-bold leading-none">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Shopping Bag Icon */}
          <button
            onClick={openCart}
            aria-label="Shopping Bag"
            className="relative p-2 text-[#444748] hover:text-[#040505] transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#040505] text-white rounded-full flex items-center justify-center text-[9px] font-bold leading-none">
                {itemCount}
              </span>
            )}
          </button>

          {/* Member Profile Dropdown */}
          <div className="relative" ref={userMenuRef}>
            {isAuthenticated ? (
              <div>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-full focus:outline-none hover:ring-2 hover:ring-[#466557]/20 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-[#efeeeb] flex items-center justify-center text-[#040505] font-semibold text-xs border border-[#c4c7c7]">
                    {customer?.name?.[0] || 'U'}
                  </div>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-[#ffffff] shadow-[0_12px_32px_-8px_rgba(30,30,30,0.08)] rounded-xl py-2 border border-[#e3e2e0] z-50">
                    <div className="px-4 py-2 border-b border-[#e3e2e0]">
                      <p className="text-[11px] font-semibold text-[#747878] uppercase tracking-wider">
                        Member
                      </p>
                      <p className="text-[13px] text-[#040505] font-semibold truncate">
                        {customer?.name || 'Customer'}
                      </p>
                    </div>
                    <Link
                      href="/account"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-[13px] text-[#444748] hover:bg-[#f4f3f1] hover:text-[#040505] transition-colors"
                    >
                      <User className="w-4 h-4" />
                      My Account
                    </Link>
                    <Link
                      href="/account?tab=orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-[13px] text-[#444748] hover:bg-[#f4f3f1] hover:text-[#040505] transition-colors"
                    >
                      <Package className="w-4 h-4" />
                      Orders
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-[13px] text-[#ba1a1a] hover:bg-[#ffdad6]/20 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:flex items-center gap-1.5 text-[13px] font-medium text-[#444748] hover:text-[#040505] px-3 py-1.5 rounded-lg border border-[#e3e2e0] hover:bg-[#f4f3f1] transition-colors"
                style={{ fontFamily: 'var(--font-plus-jakarta, sans-serif)' }}
              >
                <User className="w-4 h-4" />
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 text-[#040505] hover:text-[#466557]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#faf9f6] border-b border-[#e3e2e0] px-4 py-4 space-y-3">
          <div className="mb-3">
            <SearchAutocomplete />
          </div>
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-[15px] font-medium text-[#1a1c1a] py-2 border-b border-[#e3e2e0]/40"
              >
                {link.label}
              </Link>
            ))}
            {!isAuthenticated && (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[15px] font-medium text-[#466557] py-2"
              >
                Sign In / Register
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}