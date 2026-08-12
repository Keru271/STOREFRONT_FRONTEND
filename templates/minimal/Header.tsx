'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/context/ThemeContext';

export default function MinimalHeader() {
  const { theme } = useTheme();
  const { isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

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
          <Link href="/" className="text-lg font-light tracking-[0.15em] uppercase" style={{ color: 'var(--sf-text)' }}>
            {theme.storeName}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {['Shop', 'Collections', 'About', 'Contact'].map((label) => (
              <Link
                key={label}
                href={`/${label.toLowerCase()}`}
                className="text-xs tracking-widest uppercase transition-opacity hover:opacity-50"
                style={{ color: 'var(--sf-text)' }}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-4">
            {theme.headerShowSearch !== false && (
              <button style={{ color: 'var(--sf-text)' }} aria-label="Search">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            )}
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
            <nav className="flex flex-col gap-5">
              {['Shop', 'Collections', 'About', 'Contact'].map((label) => (
                <Link key={label} href={`/${label.toLowerCase()}`} className="text-xs tracking-widest uppercase" style={{ color: 'var(--sf-text)' }}>
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
