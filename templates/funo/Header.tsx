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

// Custom SVG Lamp Logo for Funo / Funie matching the user image
export function FunoLogo({ className = 'h-8' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 select-none group cursor-pointer ${className}`}>
      {/* Stylized "Funie" wordmark with lamp over F */}
      <svg
        viewBox="0 0 160 48"
        fill="currentColor"
        className="h-full w-auto text-black"
        aria-label="Funie"
      >
        {/* Lamp shade above F */}
        <path d="M12 4 L22 4 L20 10 L14 10 Z" fill="currentColor" />
        <line x1="17" y1="10" x2="17" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        
        {/* Letter F */}
        <path d="M10 14 H28 V19 H16 V25 H25 V30 H16 V44 H10 Z" />
        <line x1="16" y1="21" x2="25" y2="21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        
        {/* Letter u */}
        <path d="M36 22 V35 C36 41 40 45 47 45 C54 45 58 41 58 35 V22 H52 V34 C52 38 50 40 47 40 C44 40 42 38 42 34 V22 Z" />
        
        {/* Letter n */}
        <path d="M66 22 V44 H72 V32 C72 27 75 25 79 25 C83 25 85 27 85 32 V44 H91 V31 C91 24 87 21 81 21 C76 21 73 23 72 26 V22 Z" />
        
        {/* Letter i */}
        <circle cx="99" cy="15" r="3.5" />
        <rect x="96" y="22" width="6" height="22" rx="1" />
        
        {/* Letter e */}
        <path d="M121 31 C121 24 116 21 110 21 C103 21 98 26 98 33 C98 40 103 45 111 45 C116 45 120 42 121 38 H115 C114 39.5 113 40.5 110.5 40.5 C106.5 40.5 104 38 104 34 H121 V31 Z M104 30 C104.5 26.5 107 25 110 25 C113 25 115 26.5 115.5 30 Z" />
      </svg>
    </div>
  );
}

export default function FunoHeader() {
  const { theme } = useTheme();
  const { isAuthenticated, customer, logout } = useAuth();
  const { itemCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();

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
      {/* Top Notification Announcement Bar */}
      {theme.headerAnnouncement && (
        <div className="w-full bg-[#121212] text-[#e0e0e0] text-xs py-2 px-4 border-b border-[#222]">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4 text-[11px] font-medium tracking-wide">
              <span>✨ {theme.headerAnnouncement}</span>
            </div>
            <div className="flex items-center gap-5 text-[11px] text-[#999]">
              {theme.contactPhone && (
                <span className="hidden sm:inline">📞 {theme.contactPhone}</span>
              )}
              {theme.contactEmail && (
                <span className="hidden md:inline">✉️ {theme.contactEmail}</span>
              )}
              <span className="text-[#444]">|</span>
              <span className="text-white font-semibold">{theme.currency || 'USD'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Sticky Header */}
      <header
        className={`w-full bg-white text-black transition-all duration-300 z-50 ${
          theme.headerSticky ?? true ? 'sticky top-0' : ''
        } ${scrolled ? 'shadow-md py-3' : 'py-5'} border-b border-[#f0f0f0]`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* 1. Left: Mobile Hamburger & Brand Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-black hover:text-orange-500 transition-colors"
              aria-label="Toggle navigation menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            <Link href="/" className="flex items-center">
              {theme.logo ? (
                <Image
                  src={theme.logo}
                  alt={theme.storeName || 'Funie'}
                  width={140}
                  height={38}
                  priority
                  className="h-8 w-auto object-contain"
                />
              ) : (
                <FunoLogo className="h-8" />
              )}
            </Link>
          </div>

          {/* 2. Center: Desktop Main Navigation Bar */}
          <nav className="hidden lg:flex items-center gap-8 text-[13px] font-bold tracking-widest text-black">
            
            {/* HOME Dropdown */}
            <div
              className="relative py-2"
              onMouseEnter={() => handleMouseEnter('home')}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href="/"
                className="hover:text-orange-500 transition-colors uppercase flex items-center gap-1"
              >
                <span>HOME</span>
                <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>

              {activeDropdown === 'home' && (
                <div className="absolute top-full left-0 w-64 bg-white border border-[#eaeaea] shadow-xl rounded-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Homepage Layouts</div>
                  <div className="space-y-1">
                    {[
                      { label: 'Modern Living & Lounge', href: '/?layout=modern', badge: 'Popular' },
                      { label: 'Nordic Studio & Wood', href: '/?layout=nordic' },
                      { label: 'Minimalist Architecture', href: '/?layout=minimal', badge: 'New' },
                      { label: 'Artisan Decor & Lighting', href: '/?layout=artisan' },
                    ].map((item, idx) => (
                      <Link
                        key={idx}
                        href={item.href}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-xs font-semibold text-slate-800 hover:text-orange-600 transition"
                      >
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-orange-100 text-orange-600">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* SHOPS Mega Menu */}
            <div
              className="relative py-2"
              onMouseEnter={() => handleMouseEnter('shops')}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href="/products"
                className="hover:text-orange-500 transition-colors uppercase flex items-center gap-1"
              >
                <span>SHOPS</span>
                <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>

              {activeDropdown === 'shops' && (
                <div className="absolute top-full -left-24 w-[760px] bg-white border border-[#eaeaea] shadow-2xl rounded-3xl p-6 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  <div className="grid grid-cols-3 gap-6">
                    {/* Col 1: Categories */}
                    <div>
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-3 pb-1 border-b border-slate-100">
                        Shop By Room
                      </h4>
                      <ul className="space-y-2 text-xs font-medium text-slate-600">
                        {[
                          { name: 'Living Room Furniture', href: '/products?category=living-room' },
                          { name: 'Bedroom Sets & Beds', href: '/products?category=bedroom' },
                          { name: 'Dining Tables & Chairs', href: '/products?category=dining' },
                          { name: 'Home Office & Desks', href: '/products?category=office' },
                          { name: 'Designer Lighting', href: '/products?category=lighting' },
                          { name: 'Ceramics & Vases', href: '/products?category=decor' },
                        ].map((cat, idx) => (
                          <li key={idx}>
                            <Link
                              href={cat.href}
                              className="hover:text-orange-500 hover:translate-x-1 inline-block transition-transform"
                            >
                              {cat.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Col 2: Shop By Style */}
                    <div>
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-3 pb-1 border-b border-slate-100">
                        Collections & Drops
                      </h4>
                      <ul className="space-y-2 text-xs font-medium text-slate-600">
                        {[
                          { name: 'New 2026 Arrivals', href: '/products?sort=newest', isHot: true },
                          { name: 'Best Selling Classics', href: '/products?sort=popular' },
                          { name: 'Limited Studio Pieces', href: '/collections/studio-drop' },
                          { name: 'Sustainable Oak & Teak', href: '/collections/sustainable' },
                          { name: 'Special Sale Deals', href: '/products?sort=discount', isSale: true },
                        ].map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <Link
                              href={item.href}
                              className="hover:text-orange-500 hover:translate-x-1 inline-block transition-transform"
                            >
                              {item.name}
                            </Link>
                            {item.isHot && <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">HOT</span>}
                            {item.isSale && <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-rose-100 text-rose-600">SALE</span>}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Col 3: Promotional Spotlight Banner */}
                    <div className="relative rounded-2xl overflow-hidden bg-slate-900 text-white p-5 flex flex-col justify-between shadow-inner">
                      <img
                        src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80"
                        alt="Promo collection"
                        className="absolute inset-0 w-full h-full object-cover opacity-40 hover:scale-105 transition-transform duration-500"
                      />
                      <div className="relative z-10 space-y-1">
                        <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-orange-500 text-white inline-block">
                          Spring Drop
                        </span>
                        <h5 className="font-black text-sm font-heading leading-snug">
                          The Modern Lounge Suite
                        </h5>
                      </div>
                      <div className="relative z-10 pt-4">
                        <Link
                          href="/products?category=living-room"
                          className="inline-block px-4 py-2 rounded-xl bg-white text-slate-900 text-xs font-bold hover:bg-orange-500 hover:text-white transition shadow"
                        >
                          Explore Drop →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* PRODUCTS Dropdown */}
            <div
              className="relative py-2"
              onMouseEnter={() => handleMouseEnter('products')}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href="/products"
                className="hover:text-orange-500 transition-colors uppercase flex items-center gap-1"
              >
                <span>PRODUCTS</span>
                <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>

              {activeDropdown === 'products' && (
                <div className="absolute top-full -left-12 w-64 bg-white border border-[#eaeaea] shadow-xl rounded-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  <div className="space-y-1">
                    {[
                      { name: 'All Furniture Items', href: '/products', icon: '🛋️' },
                      { name: 'Lighting & Lamps', href: '/products?category=lighting', icon: '💡' },
                      { name: 'Chairs & Armchairs', href: '/products?category=chairs', icon: '🪑' },
                      { name: 'Tables & Consoles', href: '/products?category=tables', icon: '🪵' },
                      { name: 'Decor & Storage', href: '/products?category=decor', icon: '🏺' },
                    ].map((item, idx) => (
                      <Link
                        key={idx}
                        href={item.href}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 text-xs font-semibold text-slate-800 hover:text-orange-600 transition"
                      >
                        <span className="text-base">{item.icon}</span>
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* BLOG Link */}
            <div
              className="relative py-2"
              onMouseEnter={() => handleMouseEnter('blog')}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href="/pages/about"
                className="hover:text-orange-500 transition-colors uppercase flex items-center gap-1"
              >
                <span>BLOG</span>
                <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>

              {activeDropdown === 'blog' && (
                <div className="absolute top-full -left-12 w-64 bg-white border border-[#eaeaea] shadow-xl rounded-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Stories & Insights</div>
                  <div className="space-y-2">
                    {[
                      { title: 'The Nordic Interior Guide 2026', desc: '5 design rules for serene spaces', href: '/pages/about' },
                      { title: 'Sustainable Teak & Craft', desc: 'How our master carpenters work', href: '/pages/about' },
                    ].map((story, idx) => (
                      <Link
                        key={idx}
                        href={story.href}
                        className="block p-2 rounded-xl hover:bg-slate-50 transition"
                      >
                        <div className="text-xs font-bold text-slate-900 hover:text-orange-500 leading-snug">{story.title}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{story.desc}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* PAGES Dropdown */}
            <div
              className="relative py-2"
              onMouseEnter={() => handleMouseEnter('pages')}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href="/pages/about"
                className="hover:text-orange-500 transition-colors uppercase flex items-center gap-1"
              >
                <span>PAGES</span>
                <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>

              {activeDropdown === 'pages' && (
                <div className="absolute top-full right-0 w-56 bg-white border border-[#eaeaea] shadow-xl rounded-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  <div className="space-y-1">
                    {[
                      { label: 'About Funo Studio', href: '/pages/about' },
                      { label: 'Contact & Support', href: '/pages/contact' },
                      { label: 'FAQs & Help Center', href: '/pages/faq' },
                      { label: 'Privacy & Terms', href: '/pages/privacy' },
                    ].map((item, idx) => (
                      <Link
                        key={idx}
                        href={item.href}
                        className="block p-2 rounded-xl hover:bg-slate-50 text-xs font-semibold text-slate-700 hover:text-orange-500 transition"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </nav>

          {/* 3. Right: Action Icons (Search, User, Wishlist, Cart Badge) */}
          <div className="flex items-center gap-4 sm:gap-6">
            
            {/* Search Icon Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-1.5 text-black hover:text-orange-500 transition-colors"
              title="Search products"
              aria-label="Search"
            >
              <svg className="w-5 h-5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
              </svg>
            </button>

            {/* User Profile / Auth Icon */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="p-1.5 text-black hover:text-orange-500 transition-colors"
                title="Account"
                aria-label="User Account"
              >
                <svg className="w-5 h-5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-[#eaeaea] shadow-2xl rounded-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {isAuthenticated ? (
                    <div className="space-y-1">
                      <div className="px-3 py-2 border-b border-slate-100">
                        <div className="text-xs font-black text-slate-900 truncate">{customer?.name || 'Customer'}</div>
                        <div className="text-[10px] text-slate-500 truncate">{customer?.email}</div>
                      </div>
                      <Link
                        href="/account"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-3 py-2 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-700 hover:text-orange-500 transition"
                      >
                        👤 My Account & Orders
                      </Link>
                      <Link
                        href="/wishlist"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-3 py-2 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-700 hover:text-orange-500 transition"
                      >
                        ❤️ My Wishlist ({wishlistCount})
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-rose-50 text-xs font-bold text-rose-600 transition"
                      >
                        🚪 Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2 p-1">
                      <Link
                        href="/auth/login"
                        onClick={() => setUserMenuOpen(false)}
                        className="block w-full py-2 text-center rounded-xl bg-black text-white text-xs font-bold hover:bg-orange-500 transition shadow"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/auth/signup"
                        onClick={() => setUserMenuOpen(false)}
                        className="block w-full py-2 text-center rounded-xl border border-slate-200 text-slate-800 text-xs font-bold hover:bg-slate-50 transition"
                      >
                        Create Account
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist Heart Icon */}
            <Link
              href="/wishlist"
              className="relative p-1.5 text-black hover:text-orange-500 transition-colors"
              title="Wishlist"
              aria-label="Wishlist"
            >
              <svg className="w-5 h-5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-slate-900 text-white rounded-full text-[9px] font-black flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Cart Bag with Orange Badge (Matching user image) */}
            <button
              onClick={openCart}
              className="relative p-1.5 text-black hover:text-orange-500 transition-colors group cursor-pointer"
              title="Shopping Cart"
              aria-label="Cart"
            >
              {/* Bag icon */}
              <svg className="w-6 h-6 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {/* Distinct orange badge with item count */}
              <span className="absolute -top-1 -right-1.5 min-w-[18px] h-[18px] px-1 bg-[#f97316] text-white rounded-full text-[10px] font-black flex items-center justify-center shadow-sm">
                {itemCount}
              </span>
            </button>

          </div>

        </div>
      </header>

      {/* Full-Screen Search Modal Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex flex-col items-center pt-24 px-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative border border-slate-100">
            <button
              onClick={() => setSearchOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-800 transition"
              aria-label="Close search"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900 font-heading">Search Funie Collection</h3>
              <p className="text-xs text-slate-500">Find furniture, lighting, chairs, tables, and home accents.</p>
            </div>

            <SearchAutocomplete
              placeholder="Search by keyword, product name, or SKU..."
            />

            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Popular Searches:</span>
              {['Lounge Chair', 'Pendant Light', 'Oak Table', 'Ceramic Vase', 'Sofa'].map((term) => (
                <Link
                  key={term}
                  href={`/products?search=${encodeURIComponent(term)}`}
                  onClick={() => setSearchOpen(false)}
                  className="px-3 py-1 rounded-full bg-slate-100 hover:bg-orange-50 hover:text-orange-600 text-xs font-semibold text-slate-700 transition"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[90] lg:hidden bg-black/60 backdrop-blur-xs flex">
          <div className="w-4/5 max-w-sm bg-white h-full p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-200">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <FunoLogo className="h-7" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-800"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-3 font-bold text-sm text-slate-900 uppercase">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 hover:text-orange-500 transition"
                >
                  HOME
                </Link>
                <Link
                  href="/products"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 hover:text-orange-500 transition"
                >
                  SHOPS & CATALOG
                </Link>
                <Link
                  href="/products?category=living-room"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 pl-4 text-xs text-slate-600 hover:text-orange-500"
                >
                  — Living Room
                </Link>
                <Link
                  href="/products?category=bedroom"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 pl-4 text-xs text-slate-600 hover:text-orange-500"
                >
                  — Bedroom
                </Link>
                <Link
                  href="/products?category=dining"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 pl-4 text-xs text-slate-600 hover:text-orange-500"
                >
                  — Dining & Kitchen
                </Link>
                <Link
                  href="/products?category=lighting"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 pl-4 text-xs text-slate-600 hover:text-orange-500"
                >
                  — Lighting
                </Link>
                <Link
                  href="/pages/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 hover:text-orange-500 transition"
                >
                  BLOG & STORIES
                </Link>
                <Link
                  href="/pages/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 hover:text-orange-500 transition"
                >
                  PAGES & CONTACT
                </Link>
              </nav>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-slate-100 space-y-3">
              <Link
                href="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2 text-xs font-bold text-slate-700"
              >
                <span>❤️ Wishlist</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-900">{wishlistCount}</span>
              </Link>
              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2 text-xs font-bold text-slate-700"
              >
                <span>👤 My Account</span>
                <span className="text-orange-500">→</span>
              </Link>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </>
  );
}
