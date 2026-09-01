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
  { id: '1', label: 'Shop', href: '/products' },
  { id: '2', label: 'Collections', href: '/collections' },
  { id: '3', label: 'Wishlist', href: '/wishlist' },
  { id: '4', label: 'Cart', href: '/cart' },
  { id: '5', label: 'My Account', href: '/account' },
];

export default function DefaultHeader() {
  const { theme } = useTheme();
  const { isAuthenticated, customer, logout } = useAuth();
  const { itemCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [expandedSubmenus, setExpandedSubmenus] = useState<Record<string, boolean>>({});

  const { items: menuItems } = useMenu('header', { fallbackItems: defaultNavLinks });
  const navLinks = menuItems.length > 0 ? menuItems : defaultNavLinks;

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

  const toggleSubmenu = (id: string) => {
    setExpandedSubmenus((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      {/* Top Utility & Announcement Bar */}
      {(theme.headerAnnouncement || theme.contactPhone || theme.contactEmail) && (
        <div
          className="w-full py-1.5 px-3 sm:px-4 text-xs font-medium text-white flex items-center justify-between gap-4"
          style={{ backgroundColor: 'var(--sf-primary)' }}
        >
          <div className="flex items-center gap-3 sm:gap-4 text-[11px] max-w-7xl mx-auto w-full justify-between">
            <div className="flex items-center gap-4 truncate">
              {theme.contactPhone && (
                <span className="hidden sm:inline">
                  📞 <a href={`tel:${theme.contactPhone}`} className="hover:underline">{theme.contactPhone}</a>
                </span>
              )}
              {theme.contactEmail && (
                <span className="hidden md:inline">
                  ✉️ <a href={`mailto:${theme.contactEmail}`} className="hover:underline">{theme.contactEmail}</a>
                </span>
              )}
              {theme.headerAnnouncement && (
                <div className="truncate font-semibold">{theme.headerAnnouncement}</div>
              )}
            </div>
            <div className="hidden md:flex items-center gap-3 flex-shrink-0">
              <Link href="/wishlist" className="hover:underline">Wishlist ({wishlistCount})</Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Header */}
      <header
        className="w-full border-b z-40"
        style={{
          backgroundColor: 'var(--sf-bg)',
          borderColor: 'color-mix(in srgb, var(--sf-text) 12%, transparent)',
          position: theme.headerSticky ? 'sticky' : 'relative',
          top: 0,
        }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-2">
            {/* Left: Mobile Menu Toggle & Brand Logo */}
            <div className="flex items-center gap-2">
              <button
                className="lg:hidden min-w-[40px] min-h-[40px] flex items-center justify-center p-2 rounded-xl transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                style={{ color: 'var(--sf-text)' }}
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open navigation menu"
                aria-expanded={mobileMenuOpen}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <Link href="/" className="flex items-center gap-2 flex-shrink-0">
                {theme.logo ? (
                  <Image
                    src={theme.logo}
                    alt={theme.storeName}
                    width={110}
                    height={32}
                    priority
                    className="h-8 w-auto object-contain"
                  />
                ) : (
                  <span
                    className="text-xl font-bold tracking-tight"
                    style={{ color: 'var(--sf-primary)' }}
                  >
                    {theme.storeName}
                  </span>
                )}
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
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
                        className="text-sm font-medium transition-colors duration-200 inline-flex items-center gap-1.5 py-2"
                        style={{ color: 'var(--sf-text)' }}
                      >
                        <span>{label}</span>
                        <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: 'var(--sf-primary)' }} />
                        <svg className="w-3.5 h-3.5 opacity-60 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </Link>

                      <div className="hidden group-hover:block">
                        <MegaMenuDropdown item={link} isOpen={true} variant="light" />
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
                        className="text-sm font-medium transition-colors duration-200 inline-flex items-center gap-1.5 py-2"
                        style={{ color: 'var(--sf-text)' }}
                      >
                        <span>{label}</span>
                        <svg className="w-3.5 h-3.5 opacity-60 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </Link>

                      {/* Dropdown Menu */}
                      <div className="absolute left-0 top-full hidden group-hover:block pt-1 z-50 min-w-[200px] shadow-xl">
                        <div
                          className="py-2 border shadow-xl backdrop-blur-md"
                          style={{
                            backgroundColor: 'var(--sf-bg)',
                            borderColor: 'color-mix(in srgb, var(--sf-text) 12%, transparent)',
                            borderRadius: 'var(--sf-radius)',
                          }}
                        >
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
                                className="block px-4 py-2 text-xs font-medium transition-colors hover:opacity-75"
                                style={{ color: 'var(--sf-text)' }}
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
                    className="text-sm font-medium transition-colors duration-200 relative group py-2"
                    style={{ color: 'var(--sf-text)' }}
                  >
                    {label}
                    <span
                      className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                      style={{ backgroundColor: 'var(--sf-primary)' }}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* Header Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Search Toggle */}
              {theme.headerShowSearch !== false && (
                <button
                  className="min-w-[38px] min-h-[38px] flex items-center justify-center p-2 rounded-xl transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  style={{ color: 'var(--sf-text)' }}
                  onClick={() => setSearchOpen(!searchOpen)}
                  aria-label="Search"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              )}

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="min-w-[38px] min-h-[38px] flex items-center justify-center p-2 rounded-xl transition-all duration-200 relative hover:bg-slate-100 dark:hover:bg-slate-800"
                style={{ color: 'var(--sf-text)' }}
                aria-label="Wishlist"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {wishlistCount > 0 && (
                  <span
                    className="absolute top-1 right-1 text-white text-[9px] font-bold min-w-[15px] h-[15px] px-1 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'var(--sf-primary)' }}
                  >
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Bag */}
              <button
                onClick={openCart}
                className="min-w-[38px] min-h-[38px] flex items-center justify-center p-2 rounded-xl transition-all duration-200 relative hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                style={{ color: 'var(--sf-text)' }}
                aria-label="Shopping Cart"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {itemCount > 0 && (
                  <span
                    className="absolute top-1 right-1 text-white text-[9px] font-bold min-w-[15px] h-[15px] px-1 rounded-full flex items-center justify-center animate-pulse"
                    style={{ backgroundColor: 'var(--sf-primary)' }}
                  >
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Desktop User Dropdown */}
              <div className="relative hidden sm:block">
                <button
                  className="min-w-[38px] min-h-[38px] flex items-center justify-center p-2 rounded-xl transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  style={{ color: 'var(--sf-text)' }}
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  aria-label="Account"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>

                {userMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-52 rounded-2xl shadow-xl overflow-hidden z-50 border p-1 animate-in fade-in zoom-in-95 duration-150"
                    style={{
                      backgroundColor: 'var(--sf-bg)',
                      borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)',
                    }}
                  >
                    {isAuthenticated ? (
                      <>
                        <div className="px-4 py-2.5 border-b" style={{ borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)' }}>
                          <p className="text-[10px]" style={{ color: 'color-mix(in srgb, var(--sf-text) 60%, transparent)' }}>Signed in as</p>
                          <p className="text-xs font-bold truncate" style={{ color: 'var(--sf-text)' }}>{customer?.email}</p>
                        </div>
                        <Link href="/account" className="block px-3 py-2 rounded-lg text-xs hover:opacity-75 font-medium transition-opacity" style={{ color: 'var(--sf-text)' }} onClick={() => setUserMenuOpen(false)}>My Profile</Link>
                        <Link href="/account/orders" className="block px-3 py-2 rounded-lg text-xs hover:opacity-75 font-medium transition-opacity" style={{ color: 'var(--sf-text)' }} onClick={() => setUserMenuOpen(false)}>My Orders</Link>
                        <Link href="/wishlist" className="block px-3 py-2 rounded-lg text-xs hover:opacity-75 font-medium transition-opacity" style={{ color: 'var(--sf-text)' }} onClick={() => setUserMenuOpen(false)}>Wishlist ({wishlistCount})</Link>
                        <button onClick={() => { logout(); setUserMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded-lg text-xs hover:opacity-75 font-medium transition-opacity border-t text-rose-500 cursor-pointer" style={{ borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)' }}>Sign Out</button>
                      </>
                    ) : (
                      <>
                        <Link href="/auth/login" className="block px-3 py-2 rounded-lg text-xs font-bold hover:opacity-75 transition-opacity" style={{ color: 'var(--sf-text)' }} onClick={() => setUserMenuOpen(false)}>Sign In</Link>
                        <Link href="/auth/signup" className="block px-3 py-2 rounded-lg text-xs hover:opacity-75 transition-opacity" style={{ color: 'var(--sf-text)' }} onClick={() => setUserMenuOpen(false)}>Create Account</Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Search Bar Dropdown */}
          {searchOpen && (
            <div className="pb-3 animate-in slide-in-from-top duration-200">
              <SearchAutocomplete
                placeholder="Search products, collections, brands..."
                showCategoryDropdown={true}
                onSelect={() => setSearchOpen(false)}
              />
            </div>
          )}
        </div>
      </header>

      {/* ─── Slide-In Off-Canvas Mobile Drawer ─────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Dimmed Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-out Drawer */}
          <div
            className="relative w-full max-w-[320px] h-full flex flex-col shadow-2xl z-10 overflow-hidden animate-in slide-in-from-left duration-300 ease-out border-r"
            style={{
              backgroundColor: 'var(--sf-bg)',
              borderColor: 'color-mix(in srgb, var(--sf-text) 12%, transparent)',
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Menu"
          >
            {/* Drawer Header */}
            <div
              className="p-4 border-b flex items-center justify-between"
              style={{ borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)' }}
            >
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                {theme.logo ? (
                  <Image
                    src={theme.logo}
                    alt={theme.storeName}
                    width={100}
                    height={28}
                    className="h-7 w-auto object-contain"
                  />
                ) : (
                  <span className="font-bold text-lg" style={{ color: 'var(--sf-primary)' }}>
                    {theme.storeName}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-9 h-9 flex items-center justify-center rounded-xl p-1.5 hover:opacity-75 transition cursor-pointer"
                style={{ color: 'var(--sf-text)' }}
                aria-label="Close navigation menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* In-Drawer Search */}
            {theme.headerShowSearch !== false && (
              <div
                className="p-3 border-b"
                style={{ borderColor: 'color-mix(in srgb, var(--sf-text) 8%, transparent)' }}
              >
                <SearchAutocomplete
                  placeholder="Search products..."
                  showCategoryDropdown={false}
                  onSelect={() => setMobileMenuOpen(false)}
                />
              </div>
            )}

            {/* Scrollable Navigation Links */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <nav className="space-y-1">
                {navLinks.map((link, idx) => {
                  const href = link.href || link.url || '/';
                  const label = link.label || link.title || 'Link';
                  const linkId = link.id || href || String(idx);
                  const hasChildren = link.children && link.children.length > 0;
                  const isExpanded = !!expandedSubmenus[linkId];

                  if (hasChildren) {
                    return (
                      <div key={linkId} className="rounded-xl overflow-hidden" style={{ backgroundColor: 'color-mix(in srgb, var(--sf-text) 4%, transparent)' }}>
                        <div className="flex items-center justify-between">
                          <Link
                            href={href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex-1 px-3.5 py-2.5 text-sm font-semibold transition"
                            style={{ color: 'var(--sf-text)' }}
                          >
                            {label}
                          </Link>
                          <button
                            onClick={() => toggleSubmenu(linkId)}
                            className="p-2.5 opacity-60 hover:opacity-100 transition cursor-pointer"
                            aria-label={`Toggle ${label} links`}
                          >
                            <svg
                              className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>

                        {isExpanded && (
                          <div
                            className="pl-4 pr-2 pb-2 space-y-1 border-t animate-in slide-in-from-top-1 duration-150"
                            style={{ borderColor: 'color-mix(in srgb, var(--sf-text) 8%, transparent)' }}
                          >
                            {link.children!.map((sub, sIdx) => {
                              const subHref = sub.href || sub.url || '#';
                              const subLabel = sub.label || sub.title || 'Sublink';
                              return (
                                <Link
                                  key={sub.id || subHref || sIdx}
                                  href={subHref}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="block px-3 py-2 text-xs font-medium opacity-80 hover:opacity-100 rounded-lg transition"
                                  style={{ color: 'var(--sf-text)' }}
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
                      className="block px-3.5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-75 transition"
                      style={{ color: 'var(--sf-text)' }}
                    >
                      {label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Auth / Account Footer inside Drawer */}
            <div
              className="p-4 border-t space-y-3"
              style={{
                borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)',
                backgroundColor: 'color-mix(in srgb, var(--sf-text) 3%, transparent)',
              }}
            >
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shadow"
                      style={{ backgroundColor: 'var(--sf-primary)' }}
                    >
                      {(customer?.name || customer?.email || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate" style={{ color: 'var(--sf-text)' }}>{customer?.name || 'Customer'}</p>
                      <p className="text-[11px] opacity-60 truncate" style={{ color: 'var(--sf-text)' }}>{customer?.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Link
                      href="/account"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-center py-2 px-3 rounded-xl text-xs font-semibold border transition hover:opacity-80"
                      style={{
                        borderColor: 'color-mix(in srgb, var(--sf-text) 15%, transparent)',
                        color: 'var(--sf-text)',
                      }}
                    >
                      Account
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="text-center py-2 px-3 rounded-xl text-xs font-semibold text-rose-500 bg-rose-50 dark:bg-rose-950/40 hover:opacity-80 transition cursor-pointer"
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
                    className="text-center py-2.5 px-3 rounded-xl font-bold text-xs text-white transition shadow hover:opacity-90"
                    style={{ backgroundColor: 'var(--sf-primary)' }}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2.5 px-3 rounded-xl font-bold text-xs border transition hover:opacity-80"
                    style={{
                      borderColor: 'color-mix(in srgb, var(--sf-text) 15%, transparent)',
                      color: 'var(--sf-text)',
                    }}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
