'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/context/ThemeContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useMenu } from '@/hooks/useMenu';
import { SearchAutocomplete } from '@/components/shared/SearchAutocomplete';
import MegaMenuDropdown from '@/components/shared/MegaMenuDropdown';
import type { MenuItem } from '@/lib/api/types';

const defaultNavLinks: MenuItem[] = [
  { id: '1', label: 'Home', href: '/' },
  { id: '2', label: 'Living Room', href: '/products?category=living-room' },
  { id: '3', label: 'Bedroom', href: '/products?category=bedroom' },
  { id: '4', label: 'Dining & Kitchen', href: '/products?category=dining' },
  { id: '5', label: 'Office & Study', href: '/products?category=office' },
  { id: '6', label: 'Lighting & Decor', href: '/products?category=decor' },
  { id: '7', label: 'Collections', href: '/collections' },
  { id: '8', label: 'Special Deals', href: '/products?sort=discount' },
];

export default function MincomHeader() {
  const { theme } = useTheme();
  const { isAuthenticated, customer, logout } = useAuth();
  const { itemCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();
  const [searchCategory, setSearchCategory] = useState('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [expandedSubmenus, setExpandedSubmenus] = useState<Record<string, boolean>>({});

  const { items: menuItems } = useMenu('header', { fallbackItems: defaultNavLinks });
  const navLinks = menuItems.length > 0 ? menuItems : defaultNavLinks;

  // Prevent background scrolling when mobile drawer is open
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

  const toggleSubmenu = (id: string) => {
    setExpandedSubmenus((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const showSearch = theme.headerShowSearch ?? true;
  const showCurrency = theme.headerShowCurrency ?? true;
  const isSticky = theme.headerSticky ?? true;

  return (
    <>
      {/* Top Utility / Announcement Bar */}
      {(theme.headerAnnouncement || theme.contactPhone || theme.contactEmail) && (
        <div className="w-full bg-[#1e2022] text-[#9ca3af] text-xs py-1.5 sm:py-2 px-3 sm:px-4 border-b border-[#2d3135]">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-4 text-[11px] truncate">
              {theme.contactPhone && (
                <span className="hidden sm:inline">
                  📞 Call: <strong className="text-white font-medium">{theme.contactPhone}</strong>
                </span>
              )}
              {theme.contactEmail && (
                <span className="hidden md:inline">✉️ {theme.contactEmail}</span>
              )}
              {theme.headerAnnouncement && (
                <span className="text-amber-400 font-medium truncate">
                  ⚡ {theme.headerAnnouncement}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 sm:gap-4 text-[11px] flex-shrink-0">
              <Link href="/wishlist" className="hover:text-white transition flex items-center gap-1">
                <span>❤️</span>
                <span className="hidden sm:inline">Wishlist</span>
                {wishlistCount > 0 && <span className="text-amber-400 font-bold">({wishlistCount})</span>}
              </Link>
              <span className="text-[#4b5563] hidden sm:inline">|</span>
              <Link href="/account" className="hover:text-white transition hidden sm:inline">
                {isAuthenticated ? (customer?.name?.split(' ')[0] || 'My Account') : 'Sign In'}
              </Link>
              {showCurrency && (
                <>
                  <span className="text-[#4b5563] hidden sm:inline">|</span>
                  <span className="text-white font-semibold">{theme.currency || 'USD'}</span>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Brand & Navigation Header */}
      <header
        className={`w-full bg-[#23272a] text-white py-2.5 sm:py-3.5 px-3 sm:px-6 shadow-md ${
          isSticky ? 'sticky top-0' : ''
        } z-40 transition-all`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-6">
          {/* Left: Mobile Menu Toggle Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden min-w-[40px] min-h-[40px] flex items-center justify-center p-2 text-white hover:text-amber-400 hover:bg-slate-800/60 rounded-xl transition cursor-pointer"
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
              {theme.logo ? (
                <Image
                  src={theme.logo}
                  alt={theme.storeName}
                  width={120}
                  height={36}
                  priority
                  className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-white font-black text-lg sm:text-xl shadow-md transition-transform group-hover:scale-105"
                    style={{ backgroundColor: 'var(--sf-primary)' }}
                  >
                    {(theme.storeName || 'M').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col leading-none">
                    <span className="text-lg sm:text-xl font-black tracking-tight text-white uppercase font-sans">
                      {theme.storeName || 'MINCOM'}
                    </span>
                    <span
                      className="text-[8px] sm:text-[9px] tracking-[0.2em] font-bold uppercase mt-0.5"
                      style={{ color: 'var(--sf-primary)' }}
                    >
                      STOREFRONT
                    </span>
                  </div>
                </div>
              )}
            </Link>
          </div>

          {/* Desktop Center Search Bar */}
          {showSearch && (
            <div className="hidden lg:flex flex-1 max-w-xl mx-4">
              <SearchAutocomplete
                placeholder="Search products, categories, collections..."
                selectedCategory={searchCategory}
                onCategoryChange={setSearchCategory}
              />
            </div>
          )}

          {/* Right Action Icons (Search Toggle on Mobile, Account, Wishlist, Cart) */}
          <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
            {/* Mobile Search Toggle Button */}
            {showSearch && (
              <button
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                className={`lg:hidden min-w-[38px] min-h-[38px] flex items-center justify-center p-2 rounded-xl transition ${
                  mobileSearchOpen ? 'text-amber-400 bg-slate-800' : 'text-slate-200 hover:text-white hover:bg-slate-800/60'
                }`}
                aria-label="Toggle search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  {mobileSearchOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  )}
                </svg>
              </button>
            )}

            {/* Desktop Account Dropdown */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 text-left text-xs p-1.5 rounded-xl hover:bg-slate-800/60 transition cursor-pointer"
                aria-label="User Account"
              >
                <div
                  className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center"
                  style={{ color: 'var(--sf-primary)' }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="hidden xl:block">
                  <span className="block text-[10px] text-slate-400 uppercase leading-none">Account</span>
                  <span className="block font-bold text-white text-xs mt-0.5">
                    {isAuthenticated ? (customer?.name?.split(' ')[0] || 'Member') : 'Sign In'}
                  </span>
                </div>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 text-xs py-1 animate-in fade-in zoom-in-95 duration-150">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100">
                        <p className="text-[10px] text-slate-400 uppercase font-semibold">Signed in as</p>
                        <p className="font-bold text-slate-800 truncate text-xs">{customer?.email}</p>
                      </div>
                      <Link href="/account" className="block px-4 py-2 hover:bg-slate-50 font-medium" onClick={() => setUserMenuOpen(false)}>My Profile & Orders</Link>
                      <Link href="/wishlist" className="block px-4 py-2 hover:bg-slate-50 font-medium" onClick={() => setUserMenuOpen(false)}>Saved Wishlist ({wishlistCount})</Link>
                      <button onClick={() => { logout(); setUserMenuOpen(false); }} className="w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50 border-t border-slate-100 font-medium cursor-pointer">Sign Out</button>
                    </>
                  ) : (
                    <>
                      <Link href="/auth/login" className="block px-4 py-2.5 hover:bg-slate-50 font-bold text-slate-900" onClick={() => setUserMenuOpen(false)}>Sign In</Link>
                      <Link href="/auth/signup" className="block px-4 py-2 hover:bg-slate-50 font-medium text-slate-700" onClick={() => setUserMenuOpen(false)}>Create New Account</Link>
                      <Link href="/wishlist" className="block px-4 py-2 hover:bg-slate-50 font-medium text-slate-700 border-t border-slate-100" onClick={() => setUserMenuOpen(false)}>My Wishlist</Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist Icon */}
            <Link
              href="/wishlist"
              className="min-w-[38px] min-h-[38px] flex items-center justify-center p-2 text-slate-200 hover:text-white hover:bg-slate-800/60 rounded-xl relative transition"
              title="Wishlist"
              aria-label="Wishlist"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistCount > 0 && (
                <span
                  className="absolute top-1 right-1 text-white text-[9px] font-black min-w-[16px] h-[16px] px-1 rounded-full flex items-center justify-center shadow"
                  style={{ backgroundColor: 'var(--sf-primary)' }}
                >
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <button
              onClick={openCart}
              className="min-w-[38px] min-h-[38px] flex items-center gap-2 p-2 text-slate-200 hover:text-white hover:bg-slate-800/60 rounded-xl relative transition cursor-pointer"
              title="Shopping Cart"
              aria-label="Cart"
            >
              <div className="relative">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {itemCount > 0 && (
                  <span
                    className="absolute -top-1.5 -right-1.5 text-white text-[9px] font-black min-w-[16px] h-[16px] px-1 rounded-full flex items-center justify-center shadow animate-pulse"
                    style={{ backgroundColor: 'var(--sf-primary)' }}
                  >
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </div>
              <div className="hidden lg:block text-left">
                <span className="block text-[10px] text-slate-400 uppercase leading-none">Bag</span>
                <span className="block text-xs font-bold text-white mt-0.5">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Expandable Search Bar */}
        {showSearch && mobileSearchOpen && (
          <div className="lg:hidden mt-2.5 pt-2 border-t border-slate-700/80 animate-in slide-in-from-top duration-200">
            <SearchAutocomplete
              placeholder="Search products, collections, categories..."
              showCategoryDropdown={false}
              onSelect={() => setMobileSearchOpen(false)}
            />
          </div>
        )}
      </header>

      {/* Desktop Secondary Category Navigation Bar */}
      <nav className="w-full bg-[#2a2f34] text-white border-b border-[#373e45] hidden lg:block shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-1">
            {/* All Departments Link */}
            <Link
              href="/products"
              className="text-white font-bold text-xs uppercase tracking-wider px-5 py-3 flex items-center gap-2 transition shadow hover:brightness-110"
              style={{ backgroundColor: 'var(--sf-primary)' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span>All Departments</span>
            </Link>

            {/* Nav links */}
            <div className="flex items-center pl-2">
              {navLinks.map((link, idx) => {
                const href = link.href || link.url || '/';
                const label = link.label || link.title || 'Link';
                const target = link.target || '_self';
                const rel = target === '_blank' ? 'noopener noreferrer' : undefined;
                const hasChildren = link.children && link.children.length > 0;
                const isMegaMenu = Boolean(link.isMegaMenu);

                if (isMegaMenu) {
                  return (
                    <div key={link.id || href || idx} className="relative group">
                      <Link
                        href={href}
                        target={target}
                        rel={rel}
                        className="text-xs font-semibold px-4 py-3 hover:text-amber-400 transition-colors uppercase tracking-wider text-slate-200 inline-flex items-center gap-1.5"
                      >
                        <span>{label}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                        <svg className="w-3.5 h-3.5 transition-transform group-hover:rotate-180 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </Link>

                      <div className="hidden group-hover:block">
                        <MegaMenuDropdown item={link} isOpen={true} variant="dark" />
                      </div>
                    </div>
                  );
                }

                if (hasChildren) {
                  return (
                    <div key={link.id || href || idx} className="relative group">
                      <Link
                        href={href}
                        target={target}
                        rel={rel}
                        className="text-xs font-semibold px-4 py-3 hover:text-amber-400 transition-colors uppercase tracking-wider text-slate-200 inline-flex items-center gap-1.5"
                      >
                        <span>{label}</span>
                        <svg className="w-3.5 h-3.5 transition-transform group-hover:rotate-180 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </Link>

                      <div className="absolute left-0 top-full hidden group-hover:block pt-1 z-50 min-w-[220px] shadow-2xl">
                        <div className="bg-[#23272a] border border-[#373e45] rounded-xl py-2 shadow-2xl overflow-hidden backdrop-blur-md">
                          {link.children!.map((sub, sIdx) => {
                            const subHref = sub.href || sub.url || '#';
                            const subLabel = sub.label || sub.title || 'Sublink';
                            const subTarget = sub.target || '_self';
                            const subRel = subTarget === '_blank' ? 'noopener noreferrer' : undefined;
                            return (
                              <Link
                                key={sub.id || subHref || sIdx}
                                href={subHref}
                                target={subTarget}
                                rel={subRel}
                                className="block px-4 py-2.5 text-xs font-medium text-slate-200 hover:bg-[#2f353b] hover:text-amber-400 transition-colors"
                              >
                                {subLabel}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.id || href || idx}
                    href={href}
                    target={target}
                    rel={rel}
                    className="text-xs font-semibold px-4 py-3 hover:text-amber-400 transition-colors uppercase tracking-wider text-slate-200"
                  >
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>

          {theme.headerAnnouncement && (
            <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <span>{theme.headerAnnouncement}</span>
            </div>
          )}
        </div>
      </nav>

      {/* ─── Modern Off-Canvas Mobile Drawer ───────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Dark Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/65 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-in Drawer Container */}
          <div
            className="relative w-full max-w-[340px] bg-[#1e2022] text-white h-full flex flex-col shadow-2xl z-10 overflow-hidden animate-in slide-in-from-left duration-300 ease-out border-r border-[#2d3135]"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Menu"
          >
            {/* Drawer Header */}
            <div className="p-4 border-b border-[#2d3135] flex items-center justify-between bg-[#23272a]">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2"
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-base shadow"
                  style={{ backgroundColor: 'var(--sf-primary)' }}
                >
                  {(theme.storeName || 'M').charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="font-extrabold text-sm tracking-tight text-white uppercase">
                    {theme.storeName || 'MINCOM'}
                  </span>
                  <span className="text-[9px] text-amber-400 tracking-widest font-semibold uppercase">
                    Menu
                  </span>
                </div>
              </Link>

              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition cursor-pointer"
                aria-label="Close menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Quick Search inside Drawer */}
            {showSearch && (
              <div className="p-3.5 border-b border-[#2d3135] bg-[#18191b]">
                <SearchAutocomplete
                  placeholder="Search store..."
                  showCategoryDropdown={false}
                  onSelect={() => setMobileMenuOpen(false)}
                />
              </div>
            )}

            {/* Scrollable Navigation Area */}
            <div className="flex-1 overflow-y-auto py-3 px-4 space-y-4">
              {/* Main Navigation Links */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">
                  Navigation
                </p>
                <nav className="space-y-1">
                  {navLinks.map((link, idx) => {
                    const href = link.href || link.url || '/';
                    const label = link.label || link.title || 'Link';
                    const linkId = link.id || href || String(idx);
                    const hasChildren = link.children && link.children.length > 0;
                    const isExpanded = !!expandedSubmenus[linkId];

                    if (hasChildren) {
                      return (
                        <div key={linkId} className="rounded-xl overflow-hidden bg-slate-800/30">
                          <div className="flex items-center justify-between">
                            <Link
                              href={href}
                              onClick={() => setMobileMenuOpen(false)}
                              className="flex-1 px-3.5 py-2.5 text-sm font-semibold text-white hover:text-amber-400 transition"
                            >
                              {label}
                            </Link>
                            <button
                              onClick={() => toggleSubmenu(linkId)}
                              className="p-2.5 text-slate-400 hover:text-white transition cursor-pointer"
                              aria-label={`Toggle ${label} sublinks`}
                              aria-expanded={isExpanded}
                            >
                              <svg
                                className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-amber-400' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                          </div>

                          {/* Accordion Sub-items */}
                          {isExpanded && (
                            <div className="pl-4 pr-2 pb-2 space-y-1 border-t border-slate-800/60 bg-slate-900/40 animate-in slide-in-from-top-1 duration-150">
                              {link.children!.map((sub, sIdx) => {
                                const subHref = sub.href || sub.url || '#';
                                const subLabel = sub.label || sub.title || 'Sublink';
                                return (
                                  <Link
                                    key={sub.id || subHref || sIdx}
                                    href={subHref}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-3 py-2 text-xs font-medium text-slate-300 hover:text-amber-400 hover:bg-slate-800/40 rounded-lg transition"
                                  >
                                    {subLabel}
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={linkId}
                        href={href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-3.5 py-2.5 rounded-xl text-sm font-semibold text-white hover:text-amber-400 hover:bg-slate-800/40 transition"
                      >
                        {label}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Departments Quick Grid */}
              <div className="pt-2 border-t border-[#2d3135]">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">
                  Popular Categories
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <Link
                    href="/products?category=living-room"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800 text-slate-200 hover:text-amber-400 font-medium transition flex items-center gap-1.5"
                  >
                    <span>🛋️</span>
                    <span className="truncate">Living Room</span>
                  </Link>
                  <Link
                    href="/products?category=bedroom"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800 text-slate-200 hover:text-amber-400 font-medium transition flex items-center gap-1.5"
                  >
                    <span>🛏️</span>
                    <span className="truncate">Bedroom</span>
                  </Link>
                  <Link
                    href="/products?category=dining"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800 text-slate-200 hover:text-amber-400 font-medium transition flex items-center gap-1.5"
                  >
                    <span>🍽️</span>
                    <span className="truncate">Dining</span>
                  </Link>
                  <Link
                    href="/products?category=lighting"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800 text-slate-200 hover:text-amber-400 font-medium transition flex items-center gap-1.5"
                  >
                    <span>💡</span>
                    <span className="truncate">Lighting</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Customer Auth & Account Card in Drawer */}
            <div className="p-4 border-t border-[#2d3135] bg-[#18191b] space-y-3">
              {isAuthenticated ? (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shadow"
                      style={{ backgroundColor: 'var(--sf-primary)' }}
                    >
                      {(customer?.name || customer?.email || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white truncate">{customer?.name || 'Customer'}</p>
                      <p className="text-[11px] text-slate-400 truncate">{customer?.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Link
                      href="/account"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-center py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition"
                    >
                      My Account
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="text-center py-2 px-3 rounded-xl bg-rose-900/30 hover:bg-rose-900/50 text-xs font-semibold text-rose-400 transition cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2.5 px-3 rounded-xl font-bold text-xs text-white transition shadow"
                    style={{ backgroundColor: 'var(--sf-primary)' }}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2.5 px-3 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                  >
                    Register
                  </Link>
                </div>
              )}

              {/* Quick Contact info */}
              {(theme.contactPhone || theme.contactEmail) && (
                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                  {theme.contactPhone && (
                    <a href={`tel:${theme.contactPhone}`} className="hover:text-amber-400 transition">
                      📞 {theme.contactPhone}
                    </a>
                  )}
                  {theme.currency && (
                    <span className="text-slate-500 font-semibold uppercase">
                      Curr: <span className="text-slate-300">{theme.currency}</span>
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
