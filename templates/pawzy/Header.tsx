'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/context/ThemeContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useMenu } from '@/hooks/useMenu';
import { SearchAutocomplete } from '@/components/shared/SearchAutocomplete';
import type { MenuItem } from '@/lib/api/types';

// Custom SVG Pawzy Brand Logo
export function PawzyLogo({ className = 'h-9' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 select-none group cursor-pointer ${className}`}>
      {/* Cute Paw Icon in Yellow Circle */}
      <div className="w-8 h-8 rounded-full bg-[#ffd100] flex items-center justify-center text-lg shadow-xs transition-transform group-hover:rotate-12">
        🐾
      </div>
      {/* Wordmark */}
      <span
        className="text-2xl font-bold tracking-tight text-[#1f2937]"
        style={{ fontFamily: "'Fredoka', 'Fredoka One', cursive, sans-serif" }}
      >
        Pawzy
      </span>
    </div>
  );
}

export default function PawzyHeader() {
  const { theme } = useTheme();
  const { isAuthenticated, customer, logout } = useAuth();
  const { itemCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();
  const { items: menuItems } = useMenu('header');

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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

  const handleMouseEnter = (key: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(key);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  return (
    <>
      {/* ── Google Fonts Link ─────────────────────────────────────────────── */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@300;400;500;600;700;800;900&display=swap"
      />

      {/* ── Top Utility Notification Bar ──────────────────────────────────── */}
      <div
        className="w-full bg-[#fbfbfb] text-[#6b7280] text-[12px] py-2 px-4 border-b border-[#eaeaea]"
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6 text-[12px] font-medium">
            <span className="flex items-center gap-1.5">
              <span className="text-[#ffd100]">📍</span> 123 Pet Avenue, New York, USA
            </span>
            {theme.contactPhone && (
              <span className="hidden md:flex items-center gap-1.5">
                <span className="text-[#ffd100]">📞</span> {theme.contactPhone}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 text-[12px] font-semibold text-[#1f2937]">
            {theme.headerAnnouncement && (
              <span className="hidden lg:inline text-[#6b7280] font-normal">
                🎉 {theme.headerAnnouncement}
              </span>
            )}
            <span className="text-[#eaeaea]">|</span>
            <span className="flex items-center gap-1 cursor-pointer hover:text-[#ffd100] transition">
              <span>🇺🇸</span> English ({theme.currency || 'USD'})
            </span>
          </div>
        </div>
      </div>

      {/* ── Main Navigation Header ────────────────────────────────────────── */}
      <header
        className={`w-full bg-white text-[#1f2937] transition-all duration-300 z-50 ${
          (theme.headerSticky ?? true) ? 'sticky top-0' : ''
        } ${scrolled ? 'shadow-sm py-3' : 'py-4'} border-b border-[#eaeaea]`}
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6">
          {/* 1. Left: Mobile Menu & Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#1f2937] hover:text-[#ffd100] transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>

            <Link href="/" className="flex items-center">
              {theme.logo ? (
                <Image
                  src={theme.logo}
                  alt={theme.storeName || 'Pawzy'}
                  width={140}
                  height={40}
                  priority
                  className="h-9 w-auto object-contain"
                />
              ) : (
                <PawzyLogo className="h-9" />
              )}
            </Link>
          </div>

          {/* 2. Center: Desktop Menu */}
          <nav className="hidden lg:flex items-center gap-8 text-[14px] font-bold text-[#1f2937]">
            {menuItems && menuItems.length > 0 ? (
              menuItems.map((item: MenuItem) => (
                <div
                  key={item.id || item.title}
                  className="relative py-2"
                  onMouseEnter={() => handleMouseEnter(item.id || item.title || '')}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    href={item.url || '#'}
                    className="hover:text-[#ffd100] transition-colors flex items-center gap-1"
                  >
                    <span>{item.title}</span>
                    {item.children && item.children.length > 0 && (
                      <svg className="w-3.5 h-3.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </Link>

                  {item.children && item.children.length > 0 && activeDropdown === (item.id || item.title) && (
                    <div className="absolute top-full left-0 w-60 bg-white border border-[#eaeaea] shadow-lg rounded-2xl p-3 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                      <div className="space-y-1">
                        {item.children.map((child: MenuItem) => (
                          <Link
                            key={child.id || child.title}
                            href={child.url || '#'}
                            className="block p-2.5 rounded-xl hover:bg-[#f5f5f5] text-[13px] font-semibold text-[#1f2937] hover:text-[#ffd100] transition"
                          >
                            {child.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <>
                <Link href="/" className="hover:text-[#ffd100] transition-colors">
                  Home
                </Link>

                {/* Collections / Categories dropdown */}
                <div
                  className="relative py-2"
                  onMouseEnter={() => handleMouseEnter('collections')}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    href="/products"
                    className="hover:text-[#ffd100] transition-colors flex items-center gap-1"
                  >
                    <span>Collections</span>
                    <svg className="w-3.5 h-3.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </Link>

                  {activeDropdown === 'collections' && (
                    <div className="absolute top-full -left-20 w-[640px] bg-white border border-[#eaeaea] shadow-xl rounded-3xl p-6 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                      <div className="grid grid-cols-3 gap-6">
                        <div>
                          <h4 className="text-[12px] font-bold uppercase tracking-wider text-[#6b7280] mb-3 pb-1 border-b border-[#eaeaea]">
                            Shop By Pet
                          </h4>
                          <ul className="space-y-2 text-[13px] font-semibold text-[#1f2937]">
                            <li>
                              <Link href="/products?category=dogs" className="hover:text-[#ffd100] flex items-center gap-2">
                                <span>🐕</span> Dogs Collection
                              </Link>
                            </li>
                            <li>
                              <Link href="/products?category=cats" className="hover:text-[#ffd100] flex items-center gap-2">
                                <span>🐈</span> Cats Collection
                              </Link>
                            </li>
                            <li>
                              <Link href="/products?category=birds" className="hover:text-[#ffd100] flex items-center gap-2">
                                <span>🦜</span> Birds & Parrots
                              </Link>
                            </li>
                            <li>
                              <Link href="/products?category=fish" className="hover:text-[#ffd100] flex items-center gap-2">
                                <span>🐠</span> Aquarium & Fish
                              </Link>
                            </li>
                            <li>
                              <Link href="/products?category=small-pets" className="hover:text-[#ffd100] flex items-center gap-2">
                                <span>🐹</span> Small Pets & Mice
                              </Link>
                            </li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="text-[12px] font-bold uppercase tracking-wider text-[#6b7280] mb-3 pb-1 border-b border-[#eaeaea]">
                            Categories
                          </h4>
                          <ul className="space-y-2 text-[13px] font-semibold text-[#1f2937]">
                            <li><Link href="/products?category=food" className="hover:text-[#ffd100]">🥩 Pet Food & Nutrition</Link></li>
                            <li><Link href="/products?category=toys" className="hover:text-[#ffd100]">🎾 Toys & Training</Link></li>
                            <li><Link href="/products?category=beds" className="hover:text-[#ffd100]">🛏️ Beds & Furniture</Link></li>
                            <li><Link href="/products?category=apparel" className="hover:text-[#ffd100]">👕 Costumes & Apparel</Link></li>
                            <li><Link href="/products?category=grooming" className="hover:text-[#ffd100]">🧼 Grooming & Hygiene</Link></li>
                          </ul>
                        </div>

                        <div className="relative rounded-2xl overflow-hidden bg-[#eff5ff] p-4 flex flex-col justify-between">
                          <div className="space-y-1">
                            <span className="px-2 py-0.5 rounded-full bg-[#ffd100] text-[#1f2937] text-[10px] font-bold uppercase">
                              Special Offer
                            </span>
                            <h5 className="font-bold text-[14px] text-[#1f2937]" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                              40% Off Pet Kibble
                            </h5>
                          </div>
                          <Link
                            href="/products?discount=40"
                            className="mt-3 inline-block text-center py-2 px-3 rounded-full bg-[#1f2937] hover:bg-[#ffd100] hover:text-[#1f2937] text-white text-[12px] font-bold transition shadow-xs"
                          >
                            Shop Sale →
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <Link href="/products" className="hover:text-[#ffd100] transition-colors">
                  Products
                </Link>

                <Link href="/pages/about" className="hover:text-[#ffd100] transition-colors">
                  About Us
                </Link>

                <Link href="/support" className="hover:text-[#ffd100] transition-colors">
                  Contact
                </Link>
              </>
            )}
          </nav>

          {/* 3. Right: Search Box & Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search Pill Trigger */}
            <div
              onClick={() => setSearchOpen(true)}
              className="hidden md:flex items-center justify-between bg-[#f5f5f5] text-[#6b7280] text-[13px] rounded-full px-4 py-2 w-48 lg:w-64 cursor-pointer hover:bg-[#eaeaea] transition border border-[#f5f5f5]"
            >
              <span>Search products...</span>
              <span className="w-6 h-6 rounded-full bg-[#ffd100] text-[#1f2937] flex items-center justify-center text-xs">
                🔍
              </span>
            </div>

            {/* Mobile search icon */}
            <button
              onClick={() => setSearchOpen(true)}
              className="md:hidden p-2 text-[#1f2937] hover:text-[#ffd100] cursor-pointer"
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" strokeWidth={2} />
                <path strokeLinecap="round" strokeWidth={2} d="M21 21l-4.35-4.35" />
              </svg>
            </button>

            {/* Account Icon */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="w-10 h-10 rounded-full bg-[#f5f5f5] hover:bg-[#ffd100] text-[#1f2937] flex items-center justify-center transition cursor-pointer"
                title="Account"
                aria-label="Account"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-[#eaeaea] shadow-xl rounded-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {isAuthenticated ? (
                    <div className="space-y-1">
                      <div className="px-3 py-2 border-b border-[#eaeaea]">
                        <div className="text-[13px] font-bold text-[#1f2937] truncate">
                          {customer?.name || 'Pet Parent'}
                        </div>
                        <div className="text-[11px] text-[#6b7280] truncate">{customer?.email}</div>
                      </div>
                      <Link
                        href="/account"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-3 py-2 rounded-xl hover:bg-[#f5f5f5] text-[13px] font-semibold text-[#1f2937] hover:text-[#ffd100] transition"
                      >
                        🐾 My Orders & Account
                      </Link>
                      <Link
                        href="/wishlist"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-3 py-2 rounded-xl hover:bg-[#f5f5f5] text-[13px] font-semibold text-[#1f2937] hover:text-[#ffd100] transition"
                      >
                        ❤️ Wishlist ({wishlistCount})
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-rose-50 text-[13px] font-semibold text-rose-600 transition"
                      >
                        🚪 Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2 p-1">
                      <Link
                        href="/auth/login"
                        onClick={() => setUserMenuOpen(false)}
                        className="block w-full py-2 text-center rounded-full bg-[#ffd100] hover:bg-[#ecbd00] text-[#1f2937] text-[13px] font-bold transition shadow-xs"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/auth/signup"
                        onClick={() => setUserMenuOpen(false)}
                        className="block w-full py-2 text-center rounded-full bg-[#f5f5f5] text-[#1f2937] text-[13px] font-bold hover:bg-[#eaeaea] transition"
                      >
                        Register
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist Icon */}
            <Link
              href="/wishlist"
              className="relative w-10 h-10 rounded-full bg-[#f5f5f5] hover:bg-[#ffd100] text-[#1f2937] flex items-center justify-center transition"
              title="Wishlist"
              aria-label="Wishlist"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#1f2937] text-[#ffd100] rounded-full text-[10px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Button with Count Badge */}
            <button
              onClick={openCart}
              className="relative flex items-center gap-2 bg-[#ffd100] hover:bg-[#ecbd00] text-[#1f2937] px-3.5 py-2 rounded-full font-bold text-[13px] shadow-xs transition cursor-pointer"
              title="Shopping Cart"
              aria-label="Cart"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="hidden sm:inline font-bold">Cart</span>
              <span className="w-5 h-5 rounded-full bg-[#1f2937] text-white text-[11px] font-bold flex items-center justify-center">
                {itemCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Search Modal Overlay ──────────────────────────────────────────── */}
      {searchOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex flex-col items-center pt-24 px-4 animate-in fade-in duration-150">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative border border-[#eaeaea]">
            <button
              onClick={() => setSearchOpen(false)}
              className="absolute top-5 right-5 p-2 text-[#6b7280] hover:text-[#1f2937] transition"
              aria-label="Close search"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-[#1f2937]" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                Search Pawzy Pet Supplies
              </h3>
              <p className="text-[13px] text-[#6b7280]">
                Find healthy food, fun toys, warm beds, and grooming essentials for your pets.
              </p>
            </div>

            <SearchAutocomplete placeholder="Search dog kibble, cat toys, bird cages, shampoos..." />

            <div className="pt-3 border-t border-[#eaeaea] flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold text-[#6b7280] uppercase tracking-wider">
                Popular Searches:
              </span>
              {['Puppy Kibble', 'Cat Tree', 'Costumes', 'Salmon Oil', 'Chew Toys'].map((term) => (
                <Link
                  key={term}
                  href={`/products?search=${encodeURIComponent(term)}`}
                  onClick={() => setSearchOpen(false)}
                  className="px-3 py-1 rounded-full bg-[#f5f5f5] hover:bg-[#ffd100] text-[#1f2937] text-[12px] font-semibold transition"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile Drawer Menu ────────────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[90] lg:hidden bg-black/60 backdrop-blur-xs flex">
          <div className="w-4/5 max-w-sm bg-white h-full p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-200">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#eaeaea]">
                <PawzyLogo className="h-8" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-[#6b7280] hover:text-[#1f2937]"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <nav className="space-y-3 font-bold text-[14px] text-[#1f2937]">
                <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 hover:text-[#ffd100]">
                  Home
                </Link>
                <Link href="/products" onClick={() => setMobileMenuOpen(false)} className="block py-2 hover:text-[#ffd100]">
                  All Products
                </Link>
                <Link href="/products?category=dogs" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 pl-4 text-[13px] text-[#6b7280]">
                  🐕 Dogs Supplies
                </Link>
                <Link href="/products?category=cats" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 pl-4 text-[13px] text-[#6b7280]">
                  🐈 Cats Supplies
                </Link>
                <Link href="/products?category=food" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 pl-4 text-[13px] text-[#6b7280]">
                  🥩 Food & Treats
                </Link>
                <Link href="/products?category=toys" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 pl-4 text-[13px] text-[#6b7280]">
                  🎾 Toys & Accessories
                </Link>
                <Link href="/pages/about" onClick={() => setMobileMenuOpen(false)} className="block py-2 hover:text-[#ffd100]">
                  About Pawzy
                </Link>
                <Link href="/support" onClick={() => setMobileMenuOpen(false)} className="block py-2 hover:text-[#ffd100]">
                  Help & Contact
                </Link>
              </nav>
            </div>

            <div className="pt-6 border-t border-[#eaeaea] space-y-3">
              <Link
                href="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2 text-[13px] font-bold text-[#1f2937]"
              >
                <span>❤️ Wishlist</span>
                <span className="px-2 py-0.5 rounded-full bg-[#ffd100] text-[#1f2937]">
                  {wishlistCount}
                </span>
              </Link>
              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2 text-[13px] font-bold text-[#1f2937]"
              >
                <span>👤 My Account</span>
                <span className="text-[#ffd100]">→</span>
              </Link>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </>
  );
}
