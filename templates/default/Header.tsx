'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/context/ThemeContext';

export default function DefaultHeader() {
  const { theme } = useTheme();
  const { isAuthenticated, customer, logout } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Shop', href: '/products' },
    { label: 'Collections', href: '/collections' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <>
      {/* Announcement Bar */}
      {theme.headerAnnouncement && (
        <div
          className="w-full py-2 px-4 text-center text-sm font-medium text-white"
          style={{ backgroundColor: 'var(--sf-primary)' }}
        >
          {theme.headerAnnouncement}
        </div>
      )}

      {/* Main Header */}
      <header
        className="w-full border-b z-50"
        style={{
          backgroundColor: 'var(--sf-bg)',
          borderColor: 'color-mix(in srgb, var(--sf-text) 12%, transparent)',
          position: theme.headerSticky ? 'sticky' : 'relative',
          top: 0,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 rounded-lg transition-colors"
              style={{ color: 'var(--sf-text)' }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              {theme.logo ? (
                <img src={theme.logo} alt={theme.storeName} className="h-8 w-auto object-contain" />
              ) : (
                <span
                  className="text-xl font-bold tracking-tight"
                  style={{ color: 'var(--sf-primary)' }}
                >
                  {theme.storeName}
                </span>
              )}
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium transition-colors duration-200 relative group"
                  style={{ color: 'var(--sf-text)' }}
                >
                  {link.label}
                  <span
                    className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                    style={{ backgroundColor: 'var(--sf-primary)' }}
                  />
                </Link>
              ))}
            </nav>

            {/* Header Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              {theme.headerShowSearch !== false && (
                <button
                  className="p-2 rounded-lg transition-all duration-200"
                  style={{ color: 'var(--sf-text)' }}
                  onClick={() => setSearchOpen(!searchOpen)}
                  aria-label="Search"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              )}

              {/* Cart */}
              <button
                className="p-2 rounded-lg transition-all duration-200 relative"
                style={{ color: 'var(--sf-text)' }}
                aria-label="Cart"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-white text-xs flex items-center justify-center font-bold"
                  style={{ backgroundColor: 'var(--sf-accent)', fontSize: '10px' }}
                >
                  0
                </span>
              </button>

              {/* User */}
              <div className="relative">
                <button
                  className="p-2 rounded-lg transition-all duration-200"
                  style={{ color: 'var(--sf-text)' }}
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  aria-label="Account"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>

                {/* User Dropdown */}
                {userMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 rounded-xl shadow-xl overflow-hidden z-50 border"
                    style={{
                      backgroundColor: 'var(--sf-bg)',
                      borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)',
                    }}
                  >
                    {isAuthenticated ? (
                      <>
                        <div className="px-4 py-3 border-b" style={{ borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)' }}>
                          <p className="text-xs" style={{ color: 'color-mix(in srgb, var(--sf-text) 60%, transparent)' }}>Signed in as</p>
                          <p className="text-sm font-medium truncate" style={{ color: 'var(--sf-text)' }}>{customer?.email}</p>
                        </div>
                        <Link href="/account" className="block px-4 py-2 text-sm hover:opacity-70 transition-opacity" style={{ color: 'var(--sf-text)' }} onClick={() => setUserMenuOpen(false)}>My Account</Link>
                        <Link href="/account/orders" className="block px-4 py-2 text-sm hover:opacity-70 transition-opacity" style={{ color: 'var(--sf-text)' }} onClick={() => setUserMenuOpen(false)}>Orders</Link>
                        <button onClick={() => { logout(); setUserMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm hover:opacity-70 transition-opacity" style={{ color: 'var(--sf-text)' }}>Sign Out</button>
                      </>
                    ) : (
                      <>
                        <Link href="/auth/login" className="block px-4 py-2 text-sm font-medium hover:opacity-70 transition-opacity" style={{ color: 'var(--sf-text)' }} onClick={() => setUserMenuOpen(false)}>Sign In</Link>
                        <Link href="/auth/signup" className="block px-4 py-2 text-sm hover:opacity-70 transition-opacity" style={{ color: 'var(--sf-text)' }} onClick={() => setUserMenuOpen(false)}>Create Account</Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Search Bar Dropdown */}
          {searchOpen && (
            <div className="pb-4">
              <form className="relative" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="search"
                  placeholder="Search products..."
                  className="sf-input w-full pl-10 pr-4 py-2.5 text-sm"
                  autoFocus
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                  style={{ color: 'color-mix(in srgb, var(--sf-text) 40%, transparent)' }}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </form>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            className="lg:hidden border-t"
            style={{
              backgroundColor: 'var(--sf-bg)',
              borderColor: 'color-mix(in srgb, var(--sf-text) 12%, transparent)',
            }}
          >
            <nav className="px-4 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium py-1"
                  style={{ color: 'var(--sf-text)' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
