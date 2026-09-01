'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/context/ThemeContext';
import { useMenu } from '@/hooks/useMenu';
import MegaMenuDropdown from '@/components/shared/MegaMenuDropdown';
import type { MenuItem } from '@/lib/api/types';

const defaultNavLinks: MenuItem[] = [
  { id: '1', label: 'Shop', href: '/products' },
  { id: '2', label: 'Collections', href: '/collections' },
  { id: '3', label: 'Wishlist', href: '/wishlist' },
  { id: '4', label: 'About', href: '/products' },
];

export default function MinimalHeader() {
  const { theme } = useTheme();
  const { isAuthenticated, logout } = useAuth();
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
          className="w-full py-1.5 sm:py-2 text-center text-[10px] sm:text-xs tracking-widest uppercase truncate px-3"
          style={{ backgroundColor: 'var(--sf-text)', color: 'var(--sf-bg)' }}
        >
          {theme.headerAnnouncement}
        </div>
      )}

      <header
        className="w-full transition-all"
        style={{
          backgroundColor: 'var(--sf-bg)',
          borderBottom: '1px solid color-mix(in srgb, var(--sf-text) 10%, transparent)',
          position: theme.headerSticky ? 'sticky' : 'relative',
          top: 0,
          zIndex: 40,
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between gap-3">
          {/* Mobile Menu Button + Logo */}
          <div className="flex items-center gap-2">
            <button
              className="md:hidden min-w-[36px] min-h-[36px] flex items-center justify-center p-1.5 -ml-1.5 transition-opacity hover:opacity-60 cursor-pointer"
              onClick={() => setMenuOpen(true)}
              style={{ color: 'var(--sf-text)' }}
              aria-label="Open Navigation Menu"
              aria-expanded={menuOpen}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Logo */}
            <Link
              href="/"
              className="text-base sm:text-lg font-light tracking-[0.15em] uppercase flex items-center"
              style={{ color: 'var(--sf-text)' }}
            >
              {theme.logo ? (
                <Image
                  src={theme.logo}
                  alt={theme.storeName}
                  width={100}
                  height={28}
                  priority
                  className="h-6 sm:h-7 w-auto object-contain"
                />
              ) : (
                theme.storeName
              )}
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
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
                      className="text-xs tracking-widest uppercase transition-opacity hover:opacity-50 inline-flex items-center gap-1.5 py-1"
                      style={{ color: 'var(--sf-text)' }}
                    >
                      <span>{label}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 inline-block" />
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
                      className="text-xs tracking-widest uppercase transition-opacity hover:opacity-50 inline-flex items-center gap-1 py-1"
                      style={{ color: 'var(--sf-text)' }}
                    >
                      <span>{label}</span>
                      <svg className="w-3 h-3 opacity-60 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </Link>

                    {/* Dropdown Menu */}
                    <div className="absolute left-0 top-full hidden group-hover:block pt-2 z-50 min-w-[180px]">
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
                              className="block px-4 py-2 text-xs tracking-widest uppercase hover:opacity-50 transition-opacity"
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
                  className="text-xs tracking-widest uppercase transition-opacity hover:opacity-50"
                  style={{ color: 'var(--sf-text)' }}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Icons & Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {theme.headerShowSearch !== false && (
              <Link
                href="/search"
                className="p-1.5 hover:opacity-60 transition-opacity"
                style={{ color: 'var(--sf-text)' }}
                aria-label="Search"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </Link>
            )}
            <Link
              href="/wishlist"
              className="p-1.5 hover:opacity-60 transition-opacity"
              style={{ color: 'var(--sf-text)' }}
              aria-label="Wishlist"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </Link>
            <Link
              href="/cart"
              className="p-1.5 hover:opacity-60 transition-opacity"
              style={{ color: 'var(--sf-text)' }}
              aria-label="Cart"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </Link>

            {/* Desktop Auth */}
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="hidden sm:inline-block text-xs tracking-widest uppercase transition-opacity hover:opacity-50 cursor-pointer"
                style={{ color: 'var(--sf-text)' }}
              >
                Sign Out
              </button>
            ) : (
              <Link
                href="/auth/login"
                className="hidden sm:inline-block text-xs tracking-widest uppercase transition-opacity hover:opacity-50"
                style={{ color: 'var(--sf-text)' }}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ─── Minimal Off-Canvas Slide-In Drawer ───────────────────────────── */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Dim Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Container */}
          <div
            className="relative w-full max-w-[300px] h-full flex flex-col shadow-2xl z-10 overflow-hidden animate-in slide-in-from-left duration-300 ease-out border-r"
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
              style={{ borderColor: 'color-mix(in srgb, var(--sf-text) 8%, transparent)' }}
            >
              <span className="text-sm tracking-[0.2em] uppercase font-light" style={{ color: 'var(--sf-text)' }}>
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
                            className="text-xs tracking-widest uppercase font-semibold block py-1"
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
                                  className="block text-[11px] tracking-widest uppercase opacity-75 py-1"
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
                      className="text-xs tracking-widest uppercase py-1 hover:opacity-60 transition"
                      style={{ color: 'var(--sf-text)' }}
                    >
                      {label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Drawer Bottom Auth */}
            <div
              className="p-5 border-t space-y-2.5"
              style={{
                borderColor: 'color-mix(in srgb, var(--sf-text) 8%, transparent)',
              }}
            >
              {isAuthenticated ? (
                <div className="space-y-2">
                  <Link
                    href="/account"
                    onClick={() => setMenuOpen(false)}
                    className="block text-center py-2 text-xs tracking-widest uppercase border transition hover:opacity-75"
                    style={{ borderColor: 'color-mix(in srgb, var(--sf-text) 20%, transparent)', color: 'var(--sf-text)' }}
                  >
                    My Account
                  </Link>
                  <button
                    onClick={() => { logout(); setMenuOpen(false); }}
                    className="w-full text-center py-2 text-xs tracking-widest uppercase opacity-60 hover:opacity-100 transition cursor-pointer"
                    style={{ color: 'var(--sf-text)' }}
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/auth/login"
                    onClick={() => setMenuOpen(false)}
                    className="text-center py-2 text-xs tracking-widest uppercase text-white transition"
                    style={{ backgroundColor: 'var(--sf-text)', color: 'var(--sf-bg)' }}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setMenuOpen(false)}
                    className="text-center py-2 text-xs tracking-widest uppercase border transition hover:opacity-75"
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
