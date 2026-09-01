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
      {/* Announcement Bar */}
      {theme.headerAnnouncement && (
        <div className="w-full py-1.5 px-3 text-center text-xs font-medium tracking-tight bg-[#1d1d1f] text-[#f5f5f7]">
          <span>{theme.headerAnnouncement}</span>
          <Link href="/products" className="ml-2 text-[#2997ff] hover:underline inline-flex items-center gap-0.5">
            Shop now &gt;
          </Link>
        </div>
      )}

      {/* Global Apple-Style Nav Header */}
      <header
        className="w-full sticky top-0 z-40 transition-all duration-200 backdrop-blur-md bg-[#f5f5f7]/90 border-b border-[#e2e2e5]"
        style={{ height: '48px' }}
      >
        <div className="max-w-[1024px] mx-auto px-3 sm:px-6 h-full flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden min-w-[36px] min-h-[36px] flex items-center justify-center p-1.5 text-[#1d1d1f] hover:text-[#0071e3] transition-colors cursor-pointer"
            aria-label="Open Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
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
                      className="text-[12px] font-normal text-[#1d1d1f]/80 hover:text-[#0071e3] transition-colors duration-150 tracking-[-0.01em] inline-flex items-center gap-1 py-1"
                    >
                      <span>{label}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block" />
                      <svg className="w-3 h-3 opacity-60 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      className="text-[12px] font-normal text-[#1d1d1f]/80 hover:text-[#0071e3] transition-colors duration-150 tracking-[-0.01em] inline-flex items-center gap-1 py-1"
                    >
                      <span>{label}</span>
                      <svg className="w-3 h-3 opacity-60 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </Link>

                    <div className="absolute left-0 top-full hidden group-hover:block pt-1 z-50 min-w-[180px] shadow-xl">
                      <div className="bg-white/95 backdrop-blur-md rounded-2xl py-2 shadow-2xl border border-[#e2e2e5] overflow-hidden">
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
                              className="block px-4 py-2 text-[12px] text-[#1d1d1f] hover:bg-[#f5f5f7] hover:text-[#0071e3] transition"
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
                  className="text-[12px] font-normal text-[#1d1d1f]/80 hover:text-[#0071e3] transition-colors duration-150 tracking-[-0.01em]"
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1 sm:gap-4 text-[#1d1d1f]">
            {/* Search Icon */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="min-w-[34px] min-h-[34px] flex items-center justify-center p-1.5 hover:text-[#0071e3] transition-colors cursor-pointer"
              aria-label="Search"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="min-w-[34px] min-h-[34px] flex items-center justify-center p-1.5 hover:text-[#0071e3] transition-colors relative"
              aria-label="Wishlist"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute 0 top-0.5 right-0.5 bg-[#0071e3] text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Bag Cart Icon */}
            <button
              onClick={openCart}
              className="min-w-[34px] min-h-[34px] flex items-center justify-center p-1.5 hover:text-[#0071e3] transition-colors relative cursor-pointer"
              aria-label="Cart Bag"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-[#0071e3] text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {/* User Account Dropdown (Desktop) */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="p-1.5 hover:text-[#0071e3] transition-colors cursor-pointer"
                aria-label="Account"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-[#e2e2e5] rounded-xl shadow-lg py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
                  {isAuthenticated ? (
                    <>
                      <div className="px-3.5 py-2 border-b border-[#e2e2e5]">
                        <p className="text-[10px] text-[#86868b]">Signed in as</p>
                        <p className="font-semibold text-[#1d1d1f] truncate">{customer?.email}</p>
                      </div>
                      <Link href="/account" onClick={() => setUserMenuOpen(false)} className="block px-3.5 py-1.5 text-[#1d1d1f] hover:bg-[#f5f5f7]">Account Settings</Link>
                      <Link href="/account/orders" onClick={() => setUserMenuOpen(false)} className="block px-3.5 py-1.5 text-[#1d1d1f] hover:bg-[#f5f5f7]">Orders</Link>
                      <button onClick={() => { logout(); setUserMenuOpen(false); }} className="w-full text-left px-3.5 py-1.5 text-[#e11d48] hover:bg-[#f5f5f7] cursor-pointer">Sign out</button>
                    </>
                  ) : (
                    <>
                      <Link href="/auth/login" onClick={() => setUserMenuOpen(false)} className="block px-3.5 py-2 text-[#0071e3] font-medium hover:bg-[#f5f5f7]">Sign in</Link>
                      <Link href="/auth/signup" onClick={() => setUserMenuOpen(false)} className="block px-3.5 py-1.5 text-[#1d1d1f] hover:bg-[#f5f5f7]">Create Apple ID</Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Expandable Search Input Bar */}
        {searchOpen && (
          <div className="w-full bg-[#f5f5f7] border-b border-[#e2e2e5] py-2 px-4 shadow-sm animate-in slide-in-from-top duration-200">
            <div className="max-w-[640px] mx-auto flex items-center gap-2">
              <SearchAutocomplete
                placeholder="Search products, models, or categories..."
                showCategoryDropdown={false}
                buttonClassName="!bg-[#0071e3] !hover:bg-[#0077ed] !text-white"
                onSelect={() => setSearchOpen(false)}
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-[#858585] hover:text-[#1d1d1f] text-xs font-semibold p-1.5 cursor-pointer"
                title="Close search"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ─── Apple-Style Slide-in Mobile Drawer ───────────────────────────── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Dimmed Backdrop */}
          <div
            className="fixed inset-0 bg-[#1d1d1f]/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Container */}
          <div
            className="relative w-full max-w-[320px] bg-white h-full flex flex-col shadow-2xl z-10 overflow-hidden animate-in slide-in-from-left duration-300 ease-out border-r border-[#e2e2e5]"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Drawer"
          >
            {/* Drawer Top Bar */}
            <div className="p-4 border-b border-[#e2e2e5] flex items-center justify-between bg-[#f5f5f7]">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-1.5">
                <span className="text-sm font-semibold tracking-tight text-[#1d1d1f]">
                  {theme.storeName || 'NOVA'}
                </span>
              </Link>

              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-[#1d1d1f] transition cursor-pointer"
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            {/* In-Drawer Search */}
            <div className="p-3 border-b border-[#e2e2e5]">
              <SearchAutocomplete
                placeholder="Search products..."
                showCategoryDropdown={false}
                onSelect={() => setMobileMenuOpen(false)}
              />
            </div>

            {/* Links */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              <nav className="space-y-1">
                {navLinks.map((link, idx) => {
                  const href = link.href || link.url || '/';
                  const label = link.label || link.title || 'Link';
                  const linkId = link.id || href || String(idx);
                  const hasChildren = link.children && link.children.length > 0;
                  const isMegaMenu = Boolean(link.isMegaMenu);
                  const target = link.target || '_self';
                  const rel = target === '_blank' ? 'noopener noreferrer' : undefined;
                  const isExpanded = !!expandedSubmenus[linkId];

                  if (hasChildren || isMegaMenu) {
                    return (
                      <div key={linkId} className="rounded-xl overflow-hidden bg-[#f5f5f7]">
                        <div className="flex items-center justify-between">
                          <Link
                            href={href}
                            target={target}
                            rel={rel}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex-1 px-3.5 py-2.5 text-sm font-medium text-[#1d1d1f] hover:text-[#0071e3] flex items-center gap-1.5"
                          >
                            <span>{label}</span>
                            {isMegaMenu && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />}
                          </Link>
                          <button
                            onClick={() => toggleSubmenu(linkId)}
                            className="p-2.5 text-[#86868b] hover:text-[#1d1d1f] cursor-pointer"
                            aria-label={`Toggle ${label} sublinks`}
                          >
                            <svg className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180 text-[#0071e3]' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>

                        {isExpanded && (
                          <div className="pl-3 pr-3 pb-3 space-y-2 border-t border-[#e2e2e5]">
                            {/* Mega Menu Promo Card for Mobile */}
                            {isMegaMenu && link.megaMenuConfig?.bannerImage && (
                              <div className="relative rounded-xl overflow-hidden aspect-[16/8] mt-2 mb-2 shadow-xs">
                                <img
                                  src={link.megaMenuConfig.bannerImage}
                                  alt="Promo"
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-3">
                                  <span className="text-[11px] font-bold text-white leading-tight">
                                    {link.megaMenuConfig.headline}
                                  </span>
                                  <Link
                                    href={link.megaMenuConfig.buttonUrl || href}
                                    target={target}
                                    rel={rel}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-[10px] font-extrabold text-[#2997ff] mt-1 hover:underline"
                                  >
                                    {link.megaMenuConfig.buttonLabel || 'Shop Now'} &rarr;
                                  </Link>
                                </div>
                              </div>
                            )}

                            {link.children && link.children.length > 0 ? (
                              link.children.map((sub, sIdx) => {
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
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-3 py-1.5 text-xs text-[#555] hover:text-[#0071e3]"
                                  >
                                    {subLabel}
                                  </Link>
                                );
                              })
                            ) : isMegaMenu ? (
                              <div className="py-1">
                                <Link
                                  href={href}
                                  target={target}
                                  rel={rel}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="block text-xs font-semibold text-[#0071e3] hover:underline"
                                >
                                  View all in {label} &rarr;
                                </Link>
                              </div>
                            ) : null}
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={linkId}
                      href={href}
                      target={target}
                      rel={rel}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3.5 py-2.5 text-sm font-medium text-[#1d1d1f] hover:text-[#0071e3] rounded-xl hover:bg-[#f5f5f7] transition"
                    >
                      {label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Auth status footer */}
            <div className="p-4 border-t border-[#e2e2e5] bg-[#f5f5f7] space-y-2.5">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-[#1d1d1f] truncate">{customer?.name || customer?.email}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/account"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-center py-2 px-3 rounded-lg text-xs font-medium bg-white border border-[#e2e2e5] text-[#1d1d1f]"
                    >
                      Account
                    </Link>
                    <button
                      onClick={() => { logout(); setMobileMenuOpen(false); }}
                      className="text-center py-2 px-3 rounded-lg text-xs font-medium text-[#e11d48] bg-white border border-[#e2e2e5] cursor-pointer"
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
                    className="text-center py-2 px-3 rounded-lg text-xs font-medium bg-[#0071e3] text-white"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2 px-3 rounded-lg text-xs font-medium bg-white border border-[#e2e2e5] text-[#1d1d1f]"
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
