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
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const { items: menuItems } = useMenu('header', { fallbackItems: defaultNavLinks });
  const navLinks = menuItems.length > 0 ? menuItems : defaultNavLinks;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const categoryParam = searchCategory !== 'all' ? `&category=${encodeURIComponent(searchCategory)}` : '';
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}${categoryParam}`;
    }
  };

  const showSearch = theme.headerShowSearch ?? true;
  const showCurrency = theme.headerShowCurrency ?? true;
  const isSticky = theme.headerSticky ?? true;

  return (
    <>
      {/* Top utility bar */}
      <div className="w-full bg-[#1e2022] text-[#9ca3af] text-xs py-2 px-4 border-b border-[#2d3135]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6 text-[11px]">
            {theme.contactPhone && (
              <span>📞 Call Us: <strong className="text-white font-medium">{theme.contactPhone}</strong></span>
            )}
            {theme.contactEmail && (
              <span className="hidden sm:inline">✉️ {theme.contactEmail}</span>
            )}
            {theme.headerAnnouncement && (
              <span className="hidden md:inline text-amber-400 font-medium">⚡ {theme.headerAnnouncement}</span>
            )}
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <Link href="/wishlist" className="hover:text-white transition flex items-center gap-1">
              <span>❤️ Wishlist</span>
              {wishlistCount > 0 && <span className="text-amber-400 font-bold">({wishlistCount})</span>}
            </Link>
            <span className="text-[#4b5563]">|</span>
            <Link href="/account" className="hover:text-white transition">
              {isAuthenticated ? (customer?.name || 'My Account') : 'Sign In / Register'}
            </Link>
            {showCurrency && (
              <>
                <span className="text-[#4b5563]">|</span>
                <span className="text-white font-semibold">{theme.currency || 'USD'}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Brand & Search Header */}
      <header className={`w-full bg-[#23272a] text-white py-4 px-4 shadow-md ${isSticky ? 'sticky top-0' : ''} z-50`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 sm:gap-8">
          
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-white hover:text-amber-400 transition"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            {theme.logo ? (
              <Image
                src={theme.logo}
                alt={theme.storeName}
                width={120}
                height={36}
                priority
                className="h-9 w-auto object-contain"
              />
            ) : (
              <div className="flex items-center gap-2">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md"
                  style={{ backgroundColor: 'var(--sf-primary)' }}
                >
                  {(theme.storeName || 'M').charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-2xl font-black tracking-tight text-white uppercase font-sans">
                    {theme.storeName || 'MINCOM'}
                  </span>
                  <span
                    className="text-[9px] tracking-[0.25em] font-bold uppercase mt-0.5"
                    style={{ color: 'var(--sf-primary)' }}
                  >
                    FURNITURE & LIVING
                  </span>
                </div>
              </div>
            )}
          </Link>

          {/* Center Search Bar with Auto-Complete Suggestions */}
          {showSearch && (
            <div className="hidden md:flex flex-1 max-w-2xl">
              <SearchAutocomplete
                placeholder="Search furniture, sofas, dining tables, lamps..."
                selectedCategory={searchCategory}
                onCategoryChange={setSearchCategory}
              />
            </div>
          )}

          {/* Right Action Icons (Account, Wishlist, Cart) */}
          <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
            {/* Account */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 text-left text-xs hover:opacity-80 transition"
              >
                <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center" style={{ color: 'var(--sf-primary)' }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="hidden xl:block">
                  <span className="block text-[10px] text-slate-400 uppercase">Account</span>
                  <span className="block font-bold text-white leading-tight">
                    {isAuthenticated ? (customer?.name?.split(' ')[0] || 'Member') : 'Sign In'}
                  </span>
                </div>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-3 w-52 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 text-xs py-2">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 border-b border-slate-100 font-semibold text-slate-500">
                        {customer?.email}
                      </div>
                      <Link href="/account" className="block px-4 py-2 hover:bg-slate-50 font-medium" onClick={() => setUserMenuOpen(false)}>My Profile & Orders</Link>
                      <Link href="/wishlist" className="block px-4 py-2 hover:bg-slate-50 font-medium" onClick={() => setUserMenuOpen(false)}>Saved Wishlist ({wishlistCount})</Link>
                      <button onClick={() => { logout(); setUserMenuOpen(false); }} className="w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50 border-t border-slate-100 font-medium">Sign Out</button>
                    </>
                  ) : (
                    <>
                      <Link href="/auth/login" className="block px-4 py-2.5 hover:bg-slate-50 font-bold" onClick={() => setUserMenuOpen(false)}>Sign In</Link>
                      <Link href="/auth/signup" className="block px-4 py-2 hover:bg-slate-50 font-medium" onClick={() => setUserMenuOpen(false)}>Create New Account</Link>
                      <Link href="/wishlist" className="block px-4 py-2 hover:bg-slate-50 font-medium border-t border-slate-100" onClick={() => setUserMenuOpen(false)}>My Wishlist</Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist Icon */}
            <Link href="/wishlist" className="relative p-1 text-white hover:opacity-80 transition" title="Wishlist">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow"
                  style={{ backgroundColor: 'var(--sf-primary)' }}
                >
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Icon & Total Preview */}
            <Link href="/cart" className="flex items-center gap-2.5 group" title="Shopping Cart">
              <div className="relative p-1 text-white group-hover:opacity-80 transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span
                  className="absolute -top-1 -right-1 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow"
                  style={{ backgroundColor: 'var(--sf-primary)' }}
                >
                  {itemCount}
                </span>
              </div>
              <div className="hidden lg:block text-left">
                <span className="block text-[10px] text-slate-400 uppercase">My Bag</span>
                <span className="block text-xs font-bold text-white transition">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'}
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* Mobile Search Bar with Auto-Complete */}
        {showSearch && (
          <div className="md:hidden mt-3 px-1">
            <SearchAutocomplete
              placeholder="Search products..."
              showCategoryDropdown={false}
            />
          </div>
        )}
      </header>

      {/* Secondary Category Navigation Bar */}
      <nav className="w-full bg-[#2a2f34] text-white border-b border-[#373e45] hidden lg:block shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-1">
            {/* Browse Categories Dropdown button */}
            <Link
              href="/products"
              className="text-white font-bold text-xs uppercase tracking-wider px-5 py-3.5 flex items-center gap-2 cursor-pointer transition shadow"
              style={{ backgroundColor: 'var(--sf-primary)' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span>All Departments</span>
            </Link>

            {/* Nav links */}
            <div className="flex items-center pl-4">
              {navLinks.map((link, idx) => {
                const href = link.href || link.url || '/';
                const label = link.label || link.title || 'Link';
                const hasChildren = link.children && link.children.length > 0;

                if (hasChildren) {
                  return (
                    <div key={link.id || href || idx} className="relative group">
                      <Link
                        href={href}
                        className="text-xs font-semibold px-4 py-3.5 hover:text-amber-400 transition-colors uppercase tracking-wider text-slate-200 inline-flex items-center gap-1.5"
                      >
                        <span>{label}</span>
                        <svg className="w-3.5 h-3.5 transition-transform group-hover:rotate-180 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </Link>

                      {/* Dropdown Menu */}
                      <div className="absolute left-0 top-full hidden group-hover:block pt-1 z-50 min-w-[200px] shadow-2xl">
                        <div className="bg-[#23272a] border border-[#373e45] rounded-xl py-2 shadow-2xl overflow-hidden backdrop-blur-md">
                          {link.children!.map((sub, sIdx) => {
                            const subHref = sub.href || sub.url || '#';
                            const subLabel = sub.label || sub.title || 'Sublink';
                            return (
                              <Link
                                key={sub.id || subHref || sIdx}
                                href={subHref}
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
                    className="text-xs font-semibold px-4 py-3.5 hover:text-amber-400 transition-colors uppercase tracking-wider text-slate-200"
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

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#1e2022] border-b border-[#2d3135] px-6 py-4 space-y-3">
          {navLinks.map((link, idx) => {
            const href = link.href || link.url || '/';
            const label = link.label || link.title || 'Link';
            const hasChildren = link.children && link.children.length > 0;

            if (hasChildren) {
              return (
                <div key={link.id || href || idx} className="space-y-1">
                  <Link
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm font-semibold text-white hover:text-amber-400 py-1"
                  >
                    {label}
                  </Link>
                  <div className="pl-4 border-l border-slate-700 space-y-1.5 py-1">
                    {link.children!.map((sub, sIdx) => {
                      const subHref = sub.href || sub.url || '#';
                      const subLabel = sub.label || sub.title || 'Sublink';
                      return (
                        <Link
                          key={sub.id || subHref || sIdx}
                          href={subHref}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block text-xs font-medium text-slate-300 hover:text-amber-400 py-1"
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
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold text-white hover:text-amber-400 py-1"
              >
                {label}
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
