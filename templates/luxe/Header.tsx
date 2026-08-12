'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/context/ThemeContext';

export default function LuxeHeader() {
  const { theme } = useTheme();
  const { isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {theme.headerAnnouncement && (
        <div
          className="w-full py-2.5 text-center text-xs tracking-[0.2em] uppercase font-light"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--sf-primary) 90%, black)',
            color: 'rgba(255,255,255,0.9)',
          }}
        >
          {theme.headerAnnouncement}
        </div>
      )}

      <header
        className="w-full"
        style={{
          backgroundColor: 'var(--sf-bg)',
          position: theme.headerSticky ? 'sticky' : 'relative',
          top: 0,
          zIndex: 50,
          borderBottom: '1px solid color-mix(in srgb, var(--sf-primary) 25%, color-mix(in srgb, var(--sf-text) 8%, transparent))',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            {/* Left: Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {['Shop', 'Collections', 'Lookbook'].map((label) => (
                <Link
                  key={label}
                  href={`/${label.toLowerCase()}`}
                  className="text-xs font-light tracking-[0.15em] uppercase transition-opacity hover:opacity-50"
                  style={{ color: 'var(--sf-text)' }}
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* Center: Logo */}
            <Link href="/" className="text-center mx-auto">
              {theme.logo ? (
                <img src={theme.logo} alt={theme.storeName} className="h-8 w-auto object-contain mx-auto" />
              ) : (
                <div>
                  <span
                    className="text-2xl font-bold tracking-[0.25em] uppercase block"
                    style={{ color: 'var(--sf-text)' }}
                  >
                    {theme.storeName}
                  </span>
                  <span
                    className="text-xs tracking-[0.4em] uppercase font-light block mt-0.5"
                    style={{ color: 'var(--sf-primary)' }}
                  >
                    Premium
                  </span>
                </div>
              )}
            </Link>

            {/* Right: Actions */}
            <div className="flex items-center gap-5">
              {theme.headerShowSearch !== false && (
                <button style={{ color: 'var(--sf-text)' }} className="hidden lg:block transition-opacity hover:opacity-50" aria-label="Search">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.25}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              )}

              {isAuthenticated ? (
                <button
                  onClick={logout}
                  className="hidden lg:block text-xs font-light tracking-[0.1em] uppercase transition-opacity hover:opacity-50"
                  style={{ color: 'var(--sf-text)' }}
                >
                  Sign Out
                </button>
              ) : (
                <Link href="/auth/login" className="hidden lg:block text-xs font-light tracking-[0.1em] uppercase transition-opacity hover:opacity-50" style={{ color: 'var(--sf-text)' }}>
                  Account
                </Link>
              )}

              <Link href="/cart" className="relative transition-opacity hover:opacity-50" style={{ color: 'var(--sf-text)' }} aria-label="Cart">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.25}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </Link>

              <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden" style={{ color: 'var(--sf-text)' }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.25}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {menuOpen && (
          <div className="lg:hidden px-6 pb-6" style={{ borderTop: '1px solid color-mix(in srgb, var(--sf-text) 8%, transparent)' }}>
            <nav className="flex flex-col gap-5 pt-5">
              {['Shop', 'Collections', 'Lookbook', 'About', 'Contact'].map((label) => (
                <Link key={label} href={`/${label.toLowerCase()}`} className="text-xs tracking-[0.15em] uppercase font-light" style={{ color: 'var(--sf-text)' }}>
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
