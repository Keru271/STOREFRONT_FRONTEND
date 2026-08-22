'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/context/ThemeContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useMenu } from '@/hooks/useMenu';
import { SearchAutocomplete } from '@/components/shared/SearchAutocomplete';
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

  const { items: menuItems } = useMenu('header', { fallbackItems: defaultNavLinks });
  const navLinks = menuItems.length > 0 ? menuItems : defaultNavLinks;

  return (
    <>
      {/* Top Utility & Announcement Bar */}
      {(theme.headerAnnouncement || theme.contactPhone || theme.contactEmail) && (
        <div
          className="w-full py-1.5 px-4 text-xs font-medium text-white flex items-center justify-between gap-4"
          style={{ backgroundColor: 'var(--sf-primary)' }}
        >
          <div className="flex items-center gap-4 text-[11px] max-w-7xl mx-auto w-full justify-between">
            <div className="flex items-center gap-4">
              {theme.contactPhone && (
                <span>📞 <a href={`tel:${theme.contactPhone}`} className="hover:underline">{theme.contactPhone}</a></span>
              )}
              {theme.contactEmail && (
                <span className="hidden sm:inline">✉️ <a href={`mailto:${theme.contactEmail}`} className="hover:underline">{theme.contactEmail}</a></span>
              )}
            </div>
            {theme.headerAnnouncement && (
              <div className="truncate font-semibold">{theme.headerAnnouncement}</div>
            )}
            <div className="hidden md:flex items-center gap-3">
              <Link href="/wishlist" className="hover:underline">Wishlist ({wishlistCount})</Link>
            </div>
          </div>
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

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link, idx) => {
                const href = link.href || link.url || '/';
                const label = link.label || link.title || 'Link';
                const hasChildren = link.children && link.children.length > 0;

                if (hasChildren) {
                  return (
                    <div key={link.id || href || idx} className="relative group">
                      <Link
                        href={href}
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
                            return (
                              <Link
                                key={sub.id || subHref || sIdx}
                                href={subHref}
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
                    className="text-sm font-medium transition-colors duration-200 relative group"
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

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="p-2 rounded-lg transition-all duration-200 relative"
                style={{ color: 'var(--sf-text)' }}
                aria-label="Wishlist"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {wishlistCount > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'var(--sf-primary)' }}
                  >
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="p-2 rounded-lg transition-all duration-200 relative"
                style={{ color: 'var(--sf-text)' }}
                aria-label="Cart"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {itemCount > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'var(--sf-primary)' }}
                  >
                    {itemCount}
                  </span>
                )}
              </Link>

              {/* User Dropdown */}
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
                        <Link href="/account" className="block px-4 py-2 text-sm hover:opacity-70 transition-opacity" style={{ color: 'var(--sf-text)' }} onClick={() => setUserMenuOpen(false)}>My Profile</Link>
                        <Link href="/wishlist" className="block px-4 py-2 text-sm hover:opacity-70 transition-opacity" style={{ color: 'var(--sf-text)' }} onClick={() => setUserMenuOpen(false)}>Wishlist ({wishlistCount})</Link>
                        <Link href="/cart" className="block px-4 py-2 text-sm hover:opacity-70 transition-opacity" style={{ color: 'var(--sf-text)' }} onClick={() => setUserMenuOpen(false)}>Cart ({itemCount})</Link>
                        <button onClick={() => { logout(); setUserMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm hover:opacity-70 transition-opacity border-t" style={{ color: 'var(--sf-text)', borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)' }}>Sign Out</button>
                      </>
                    ) : (
                      <>
                        <Link href="/auth/login" className="block px-4 py-2 text-sm font-medium hover:opacity-70 transition-opacity" style={{ color: 'var(--sf-text)' }} onClick={() => setUserMenuOpen(false)}>Sign In</Link>
                        <Link href="/auth/signup" className="block px-4 py-2 text-sm hover:opacity-70 transition-opacity" style={{ color: 'var(--sf-text)' }} onClick={() => setUserMenuOpen(false)}>Create Account</Link>
                        <Link href="/wishlist" className="block px-4 py-2 text-sm hover:opacity-70 transition-opacity border-t" style={{ color: 'var(--sf-text)', borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)' }} onClick={() => setUserMenuOpen(false)}>Wishlist ({wishlistCount})</Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                className="p-2 rounded-lg lg:hidden"
                style={{ color: 'var(--sf-text)' }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </div>

          {/* Search Bar Dropdown */}
          {searchOpen && (
            <div className="pb-4">
              <SearchAutocomplete
                placeholder="Search products, collections, brands..."
                showCategoryDropdown={true}
              />
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
            <nav className="px-4 py-4 flex flex-col gap-3">
              {navLinks.map((link, idx) => {
                const href = link.href || link.url || '/';
                const label = link.label || link.title || 'Link';
                const hasChildren = link.children && link.children.length > 0;

                if (hasChildren) {
                  return (
                    <div key={link.id || href || idx} className="space-y-1.5">
                      <Link
                        href={href}
                        className="text-sm font-semibold py-1 block"
                        style={{ color: 'var(--sf-text)' }}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {label}
                      </Link>
                      <div className="pl-4 space-y-1.5 border-l" style={{ borderColor: 'color-mix(in srgb, var(--sf-text) 15%, transparent)' }}>
                        {link.children!.map((sub, sIdx) => {
                          const subHref = sub.href || sub.url || '#';
                          const subLabel = sub.label || sub.title || 'Sublink';
                          return (
                            <Link
                              key={sub.id || subHref || sIdx}
                              href={subHref}
                              className="text-xs font-medium py-1 block opacity-80"
                              style={{ color: 'var(--sf-text)' }}
                              onClick={() => setMobileMenuOpen(false)}
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
                    className="text-sm font-medium py-1"
                    style={{ color: 'var(--sf-text)' }}
                    onClick={() => setMobileMenuOpen(false)}
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
