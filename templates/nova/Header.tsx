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
  { id: '1', label: 'Store', href: '/' },
  { id: '2', label: 'Mac & Tech', href: '/products?category=electronics' },
  { id: '3', label: 'Apparel', href: '/products?category=apparel' },
  { id: '4', label: 'Lifestyle', href: '/products?category=lifestyle' },
  { id: '5', label: 'All Products', href: '/products' },
];

export default function NovaHeader() {
  const { theme } = useTheme();
  const { isAuthenticated, customer, logout } = useAuth();
  const { itemCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const { items: menuItems } = useMenu('header', { fallbackItems: defaultNavLinks });
  const navLinks = menuItems.length > 0 ? menuItems : defaultNavLinks;

  return (
    <>
      {/* Announcement Bar */}
      {theme.headerAnnouncement && (
        <div className="w-full py-2 px-4 text-center text-xs font-medium tracking-tight bg-[#1d1d1f] text-[#f5f5f7]">
          <span>{theme.headerAnnouncement}</span>
          <Link href="/products" className="ml-2 text-[#2997ff] hover:underline inline-flex items-center gap-0.5">
            Shop now &gt;
          </Link>
        </div>
      )}

      {/* Global Apple-Style Nav Header */}
      <header
        className="w-full sticky top-0 z-50 transition-all duration-200 backdrop-blur-md bg-[#f5f5f7]/85 border-b border-[#e2e2e5]"
        style={{
          height: '48px',
        }}
      >
        <div className="max-w-[1024px] mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-[#1d1d1f] hover:text-[#0071e3] transition-colors"
            aria-label="Toggle Navigation"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-1.5 flex-shrink-0 text-[#1d1d1f] hover:opacity-80 transition-opacity">
            {theme.logo ? (
              <Image
                src={theme.logo}
                alt={theme.storeName}
                width={80}
                height={20}
                priority
                className="h-4 w-auto object-contain"
              />
            ) : (
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-[#1d1d1f]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                <span className="text-xs font-semibold tracking-tight text-[#1d1d1f]">
                  {theme.storeName || 'NOVA'}
                </span>
              </div>
            )}
          </Link>

          {/* Centered Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link, idx) => {
              const href = link.href || link.url || '/';
              const label = link.label || link.title || 'Link';
              const hasChildren = link.children && link.children.length > 0;

              if (hasChildren) {
                return (
                  <div key={link.id || href || idx} className="relative group">
                    <Link
                      href={href}
                      className="text-[12px] font-normal text-[#1d1d1f]/80 hover:text-[#0071e3] transition-colors duration-150 tracking-[-0.01em] inline-flex items-center gap-1 py-1"
                    >
                      <span>{label}</span>
                      <svg className="w-3 h-3 opacity-60 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </Link>

                    {/* Dropdown Menu */}
                    <div className="absolute left-0 top-full hidden group-hover:block pt-1.5 z-50 min-w-[180px]">
                      <div className="bg-white/95 backdrop-blur-md border border-[#e2e2e5] rounded-xl py-1.5 shadow-xl">
                        {link.children!.map((sub, sIdx) => {
                          const subHref = sub.href || sub.url || '#';
                          const subLabel = sub.label || sub.title || 'Sublink';
                          return (
                            <Link
                              key={sub.id || subHref || sIdx}
                              href={subHref}
                              className="block px-3.5 py-1.5 text-xs text-[#1d1d1f] hover:bg-[#f5f5f7] hover:text-[#0071e3] transition-colors"
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
                  className="text-[12px] font-normal text-[#1d1d1f]/80 hover:text-[#0071e3] transition-colors duration-150 tracking-[-0.01em]"
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-1 text-[#1d1d1f]/80 hover:text-[#0071e3] transition-colors"
              title="Search"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7" />
                <path strokeLinecap="round" d="m21 21-4.35-4.35" />
              </svg>
            </button>

            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              className="p-1 text-[#1d1d1f]/80 hover:text-[#0071e3] transition-colors relative"
              title="Wishlist"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 bg-[#0071e3] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Bag / Cart Trigger */}
            <button
              onClick={openCart}
              className="p-1 text-[#1d1d1f]/80 hover:text-[#0071e3] transition-colors relative"
              title="Shopping Bag"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 bg-[#0071e3] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Account / User Menu */}
            <div className="relative">
              {isAuthenticated ? (
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="w-6 h-6 rounded-full bg-[#e2e2e5] text-[#1d1d1f] text-[11px] font-semibold flex items-center justify-center hover:ring-2 hover:ring-[#0071e3] transition-all"
                >
                  {customer?.name?.[0] || 'U'}
                </button>
              ) : (
                <Link
                  href="/auth/login"
                  className="text-[12px] font-normal text-[#1d1d1f]/80 hover:text-[#0071e3] transition-colors"
                >
                  Sign in
                </Link>
              )}

              {/* User Dropdown */}
              {userMenuOpen && isAuthenticated && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-[#e2e2e5] rounded-lg shadow-lg py-1.5 z-50 text-[13px]">
                  <div className="px-3.5 py-2 border-b border-[#f5f5f7]">
                    <div className="font-semibold text-[#1d1d1f] truncate">
                      {customer?.name}
                    </div>
                    <div className="text-[11px] text-[#707070] truncate">{customer?.email}</div>
                  </div>
                  <Link
                    href="/account"
                    onClick={() => setUserMenuOpen(false)}
                    className="block px-3.5 py-1.5 text-[#1d1d1f] hover:bg-[#f5f5f7]"
                  >
                    Account Settings
                  </Link>
                  <Link
                    href="/account/orders"
                    onClick={() => setUserMenuOpen(false)}
                    className="block px-3.5 py-1.5 text-[#1d1d1f] hover:bg-[#f5f5f7]"
                  >
                    Orders
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-1.5 text-[#e11d48] hover:bg-[#f5f5f7]"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Expandable Search Input Bar with Auto-Complete Suggestions */}
        {searchOpen && (
          <div className="w-full bg-[#f5f5f7] border-b border-[#e2e2e5] py-2 px-4 shadow-sm animate-fadeIn">
            <div className="max-w-[640px] mx-auto flex items-center gap-2">
              <SearchAutocomplete
                placeholder="Search products, models, or categories..."
                showCategoryDropdown={false}
                buttonClassName="!bg-[#0071e3] !hover:bg-[#0077ed] !text-white"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-[#858585] hover:text-[#1d1d1f] text-xs font-semibold p-1.5"
                title="Close search"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-[#e2e2e5] px-6 py-4 space-y-3">
            {navLinks.map((link, idx) => {
              const href = link.href || link.url || '/';
              const label = link.label || link.title || 'Link';
              const hasChildren = link.children && link.children.length > 0;

              if (hasChildren) {
                return (
                  <div key={link.id || href || idx} className="space-y-1.5">
                    <Link
                      href={href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-sm font-semibold text-[#1d1d1f] hover:text-[#0071e3]"
                    >
                      {label}
                    </Link>
                    <div className="pl-3 space-y-1 border-l border-[#e2e2e5]">
                      {link.children!.map((sub, sIdx) => {
                        const subHref = sub.href || sub.url || '#';
                        const subLabel = sub.label || sub.title || 'Sublink';
                        return (
                          <Link
                            key={sub.id || subHref || sIdx}
                            href={subHref}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block text-xs font-normal text-[#555] hover:text-[#0071e3] py-0.5"
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
                  className="block text-sm font-medium text-[#1d1d1f] hover:text-[#0071e3]"
                >
                  {label}
                </Link>
              );
            })}
            <div className="pt-2 border-t border-[#f5f5f7] flex items-center justify-between text-xs text-[#707070]">
              <Link href="/wishlist" onClick={() => setMobileMenuOpen(false)}>Wishlist ({wishlistCount})</Link>
              <Link href="/cart" onClick={() => setMobileMenuOpen(false)}>Bag ({itemCount})</Link>
              <Link href="/account" onClick={() => setMobileMenuOpen(false)}>Account</Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
