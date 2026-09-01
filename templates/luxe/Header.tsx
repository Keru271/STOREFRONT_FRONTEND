'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/context/ThemeContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { useMenu } from '@/hooks/useMenu';
import MegaMenuDropdown from '@/components/shared/MegaMenuDropdown';
import type { MenuItem } from '@/lib/api/types';

const defaultNavLinks: MenuItem[] = [
  { id: '1', label: 'Shop', href: '/products' },
  { id: '2', label: 'Collections', href: '/collections' },
  { id: '3', label: 'Wishlist', href: '/wishlist' },
  { id: '4', label: 'Lookbook', href: '/products' },
];

export default function LuxeHeader() {
  const { theme } = useTheme();
  const { isAuthenticated, customer, logout } = useAuth();
  const { wishlistCount } = useWishlist();
  const { itemCount, openCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedSubmenus, setExpandedSubmenus] = useState<Record<string, boolean>>({});

  const { items: menuItems } = useMenu('header', { fallbackItems: defaultNavLinks });
  const navLinks = menuItems.length > 0 ? menuItems : defaultNavLinks;

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const toggleSubmenu = (id: string) => {
    setExpandedSubmenus((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      {theme.headerAnnouncement && (
        <div
          className="w-full py-2 text-center text-[10px] sm:text-xs tracking-[0.2em] uppercase font-light truncate px-3"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--sf-primary) 90%, black)',
            color: 'rgba(255,255,255,0.9)',
          }}
        >
          {theme.headerAnnouncement}
        </div>
      )}

      <header
        className="w-full transition-all"
        style={{
          backgroundColor: 'var(--sf-bg)',
          position: theme.headerSticky ? 'sticky' : 'relative',
          top: 0,
          zIndex: 40,
          borderBottom: '1px solid color-mix(in srgb, var(--sf-primary) 25%, color-mix(in srgb, var(--sf-text) 8%, transparent))',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 sm:py-5">
          <div className="flex items-center justify-between gap-3">
            {/* Left: Mobile Menu Toggle & Desktop Nav */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMenuOpen(true)}
                className="lg:hidden min-w-[36px] min-h-[36px] flex items-center justify-center p-1.5 transition-opacity hover:opacity-60 cursor-pointer"
                style={{ color: 'var(--sf-text)' }}
                aria-label="Open navigation menu"
                aria-expanded={menuOpen}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

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
                          className="text-xs font-light tracking-[0.15em] uppercase transition-opacity hover:opacity-50 inline-flex items-center gap-1.5"
                          style={{ color: 'var(--sf-text)' }}
                        >
                          <span>{label}</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-600/70 inline-block" />
                          <svg className="w-3 h-3 opacity-60 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
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
                          className="text-xs font-light tracking-[0.15em] uppercase transition-opacity hover:opacity-50 inline-flex items-center gap-1"
                          style={{ color: 'var(--sf-text)' }}
                        >
                          <span>{label}</span>
                          <svg className="w-3 h-3 opacity-60 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                          </svg>
                        </Link>

                        <div className="absolute left-0 top-full hidden group-hover:block pt-2 z-50 min-w-[200px]">
                          <div
                            className="py-2 border shadow-xl backdrop-blur-md"
                            style={{
                              backgroundColor: 'var(--sf-bg)',
                              borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)',
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
                                  className="block px-4 py-2 text-xs tracking-[0.1em] uppercase font-light hover:opacity-50 transition-opacity"
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
                      className="text-xs font-light tracking-[0.15em] uppercase transition-opacity hover:opacity-50"
                      style={{ color: 'var(--sf-text)' }}
                    >
                      {label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Center: Brand Logo */}
            <Link href="/" className="text-center group flex-shrink-0">
              {theme.logo ? (
                <Image
                  src={theme.logo}
                  alt={theme.storeName}
                  width={140}
                  height={40}
                  priority
                  className="h-8 sm:h-10 w-auto object-contain mx-auto transition-transform group-hover:scale-105"
                />
              ) : (
                <div>
                  <span
                    className="text-xl sm:text-2xl font-bold tracking-[0.25em] uppercase block"
                    style={{ color: 'var(--sf-text)' }}
                  >
                    {theme.storeName}
                  </span>
                  <span
                    className="text-[9px] sm:text-xs tracking-[0.4em] uppercase font-light block mt-0.5"
                    style={{ color: 'var(--sf-primary)' }}
                  >
                    Luxe Collection
                  </span>
                </div>
              )}
            </Link>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 sm:gap-5">
              {theme.headerShowSearch !== false && (
                <Link
                  href="/search"
                  style={{ color: 'var(--sf-text)' }}
                  className="p-1.5 transition-opacity hover:opacity-50"
                  aria-label="Search"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </Link>
              )}

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="p-1.5 relative transition-opacity hover:opacity-50"
                style={{ color: 'var(--sf-text)' }}
                aria-label="Wishlist"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {wishlistCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 text-white text-[9px] font-bold min-w-[14px] h-[14px] px-0.5 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'var(--sf-primary)' }}
                  >
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Bag */}
              <button
                onClick={openCart}
                className="p-1.5 relative transition-opacity hover:opacity-50 cursor-pointer"
                style={{ color: 'var(--sf-text)' }}
                aria-label="Shopping Cart"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {itemCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 text-white text-[9px] font-bold min-w-[14px] h-[14px] px-0.5 rounded-full flex items-center justify-center animate-pulse"
                    style={{ backgroundColor: 'var(--sf-primary)' }}
                  >
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Desktop Auth */}
              {isAuthenticated ? (
                <button
                  onClick={logout}
                  className="hidden lg:block text-xs font-light tracking-[0.1em] uppercase transition-opacity hover:opacity-50 cursor-pointer"
                  style={{ color: 'var(--sf-text)' }}
                >
                  Sign Out
                </button>
              ) : (
                <Link
                  href="/auth/login"
                  className="hidden lg:block text-xs font-light tracking-[0.1em] uppercase transition-opacity hover:opacity-50"
                  style={{ color: 'var(--sf-text)' }}
                >
                  Account
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ─── Luxe Off-Canvas Slide-in Drawer ──────────────────────────────── */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Container */}
          <div
            className="relative w-full max-w-[320px] h-full flex flex-col shadow-2xl z-10 overflow-hidden animate-in slide-in-from-left duration-300 ease-out border-r"
            style={{
              backgroundColor: 'var(--sf-bg)',
              borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)',
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Drawer"
          >
            {/* Header */}
            <div
              className="p-5 border-b flex items-center justify-between"
              style={{ borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)' }}
            >
              <span className="text-xs tracking-[0.25em] uppercase font-semibold" style={{ color: 'var(--sf-text)' }}>
                {theme.storeName}
              </span>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-1 hover:opacity-50 transition cursor-pointer"
                style={{ color: 'var(--sf-text)' }}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            {/* Links */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <nav className="flex flex-col gap-3">
                {navLinks.map((link, idx) => {
                  const href = link.href || link.url || '/';
                  const label = link.label || link.title || 'Link';
                  const linkId = link.id || href || String(idx);
                  const hasChildren = link.children && link.children.length > 0;
                  const isExpanded = !!expandedSubmenus[linkId];

                  if (hasChildren) {
                    return (
                      <div key={linkId} className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <Link
                            href={href}
                            onClick={() => setMenuOpen(false)}
                            className="text-xs tracking-[0.15em] uppercase font-medium block py-1"
                            style={{ color: 'var(--sf-text)' }}
                          >
                            {label}
                          </Link>
                          <button
                            onClick={() => toggleSubmenu(linkId)}
                            className="p-1 opacity-60 hover:opacity-100 cursor-pointer"
                            aria-label={`Toggle ${label}`}
                          >
                            <svg className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>

                        {isExpanded && (
                          <div
                            className="pl-4 space-y-1.5 border-l animate-in slide-in-from-top-1 duration-150"
                            style={{ borderColor: 'color-mix(in srgb, var(--sf-text) 15%, transparent)' }}
                          >
                            {link.children!.map((sub, sIdx) => {
                              const subHref = sub.href || sub.url || '#';
                              const subLabel = sub.label || sub.title || 'Sublink';
                              return (
                                <Link
                                  key={sub.id || subHref || sIdx}
                                  href={subHref}
                                  onClick={() => setMenuOpen(false)}
                                  className="block text-[11px] tracking-[0.1em] uppercase font-light opacity-80 py-1"
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
                      onClick={() => setMenuOpen(false)}
                      className="text-xs tracking-[0.15em] uppercase font-light py-1 hover:opacity-60 transition"
                      style={{ color: 'var(--sf-text)' }}
                    >
                      {label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Auth */}
            <div
              className="p-5 border-t space-y-2.5"
              style={{ borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)' }}
            >
              {isAuthenticated ? (
                <div className="space-y-2">
                  <p className="text-[11px] tracking-wider uppercase opacity-60 truncate" style={{ color: 'var(--sf-text)' }}>
                    {customer?.name || customer?.email}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/account"
                      onClick={() => setMenuOpen(false)}
                      className="text-center py-2 text-xs tracking-[0.1em] uppercase border transition hover:opacity-75"
                      style={{ borderColor: 'color-mix(in srgb, var(--sf-text) 20%, transparent)', color: 'var(--sf-text)' }}
                    >
                      Account
                    </Link>
                    <button
                      onClick={() => { logout(); setMenuOpen(false); }}
                      className="text-center py-2 text-xs tracking-[0.1em] uppercase text-rose-500 transition cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/auth/login"
                    onClick={() => setMenuOpen(false)}
                    className="text-center py-2.5 text-xs tracking-[0.15em] uppercase text-white transition shadow"
                    style={{ backgroundColor: 'var(--sf-primary)' }}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setMenuOpen(false)}
                    className="text-center py-2.5 text-xs tracking-[0.15em] uppercase border transition hover:opacity-75"
                    style={{ borderColor: 'color-mix(in srgb, var(--sf-text) 20%, transparent)', color: 'var(--sf-text)' }}
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
