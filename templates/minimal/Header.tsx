'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/context/ThemeContext';
import { useMenu } from '@/hooks/useMenu';
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

  const { items: menuItems } = useMenu('header', { fallbackItems: defaultNavLinks });
  const navLinks = menuItems.length > 0 ? menuItems : defaultNavLinks;

  return (
    <>
      {theme.headerAnnouncement && (
        <div
          className="w-full py-2 text-center text-xs tracking-widest uppercase"
          style={{ backgroundColor: 'var(--sf-text)', color: 'var(--sf-bg)' }}
        >
          {theme.headerAnnouncement}
        </div>
      )}

      <header
        className="w-full"
        style={{
          backgroundColor: 'var(--sf-bg)',
          borderBottom: '1px solid color-mix(in srgb, var(--sf-text) 10%, transparent)',
          position: theme.headerSticky ? 'sticky' : 'relative',
          top: 0,
          zIndex: 50,
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-lg font-light tracking-[0.15em] uppercase flex items-center" style={{ color: 'var(--sf-text)' }}>
            {theme.logo ? (
              <Image
                src={theme.logo}
                alt={theme.storeName}
                width={100}
                height={28}
                priority
                className="h-7 w-auto object-contain"
              />
            ) : (
              theme.storeName
            )}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link, idx) => {
              const href = link.href || link.url || '/';
              const label = link.label || link.title || 'Link';
              const hasChildren = link.children && link.children.length > 0;

              if (hasChildren) {
                return (
                  <div key={link.id || href || idx} className="relative group">
                    <Link
                      href={href}
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
                          return (
                            <Link
                              key={sub.id || subHref || sIdx}
                              href={subHref}
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
                  className="text-xs tracking-widest uppercase transition-opacity hover:opacity-50"
                  style={{ color: 'var(--sf-text)' }}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-4">
            {theme.headerShowSearch !== false && (
              <Link href="/search" style={{ color: 'var(--sf-text)' }} aria-label="Search">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </Link>
            )}
            <Link href="/wishlist" style={{ color: 'var(--sf-text)' }} aria-label="Wishlist">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </Link>
            <Link href="/cart" style={{ color: 'var(--sf-text)' }} aria-label="Cart">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </Link>
            {isAuthenticated ? (
              <button onClick={logout} className="text-xs tracking-widest uppercase transition-opacity hover:opacity-50" style={{ color: 'var(--sf-text)' }}>
                Sign Out
              </button>
            ) : (
              <Link href="/auth/login" className="text-xs tracking-widest uppercase transition-opacity hover:opacity-50" style={{ color: 'var(--sf-text)' }}>
                Sign In
              </Link>
            )}
            <button
              className="md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ color: 'var(--sf-text)' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t px-6 py-6" style={{ borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)' }}>
            <nav className="flex flex-col gap-4">
              {navLinks.map((link, idx) => {
                const href = link.href || link.url || '/';
                const label = link.label || link.title || 'Link';
                const hasChildren = link.children && link.children.length > 0;

                if (hasChildren) {
                  return (
                    <div key={link.id || href || idx} className="space-y-2">
                      <Link
                        href={href}
                        onClick={() => setMenuOpen(false)}
                        className="text-xs tracking-widest uppercase font-semibold block"
                        style={{ color: 'var(--sf-text)' }}
                      >
                        {label}
                      </Link>
                      <div className="pl-4 space-y-2 border-l" style={{ borderColor: 'color-mix(in srgb, var(--sf-text) 15%, transparent)' }}>
                        {link.children!.map((sub, sIdx) => {
                          const subHref = sub.href || sub.url || '#';
                          const subLabel = sub.label || sub.title || 'Sublink';
                          return (
                            <Link
                              key={sub.id || subHref || sIdx}
                              href={subHref}
                              onClick={() => setMenuOpen(false)}
                              className="block text-[11px] tracking-widest uppercase opacity-75"
                              style={{ color: 'var(--sf-text)' }}
                            >
                              {subLabel}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.id || href || idx}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className="text-xs tracking-widest uppercase"
                    style={{ color: 'var(--sf-text)' }}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
