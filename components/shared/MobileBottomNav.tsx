'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

export function MobileBottomNav() {
  const pathname = usePathname();
  const { itemCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();

  // Hide on checkout pages to avoid distraction during checkout flow
  if (pathname?.startsWith('/checkout')) {
    return null;
  }

  const isHomeActive = pathname === '/';
  const isShopActive =
    pathname.startsWith('/products') ||
    pathname.startsWith('/categories') ||
    pathname.startsWith('/category') ||
    pathname.startsWith('/collections') ||
    pathname.startsWith('/brand') ||
    pathname.startsWith('/brands');
  const isSearchActive = pathname === '/search';
  const isWishlistActive = pathname === '/wishlist';
  const isCartActive = pathname === '/cart';

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t shadow-[0_-4px_16px_rgba(0,0,0,0.06)] backdrop-blur-lg"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--sf-bg) 95%, transparent)',
        borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)',
      }}
    >
      <div className="max-w-md mx-auto grid grid-cols-5 items-center px-1 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]">
        {/* Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-200 ${
            isHomeActive ? 'scale-105 font-bold' : 'opacity-70 hover:opacity-100 font-medium'
          }`}
          style={{
            color: isHomeActive ? 'var(--sf-primary)' : 'var(--sf-text)',
          }}
        >
          <div className="relative">
            <svg className="w-5 h-5" fill={isHomeActive ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={isHomeActive ? 1.5 : 2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {isHomeActive && (
              <span
                className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                style={{ backgroundColor: 'var(--sf-primary)' }}
              />
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1">Home</span>
        </Link>

        {/* Catalog / Shop */}
        <Link
          href="/products"
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-200 ${
            isShopActive ? 'scale-105 font-bold' : 'opacity-70 hover:opacity-100 font-medium'
          }`}
          style={{
            color: isShopActive ? 'var(--sf-primary)' : 'var(--sf-text)',
          }}
        >
          <div className="relative">
            <svg className="w-5 h-5" fill={isShopActive ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={isShopActive ? 1.5 : 2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            {isShopActive && (
              <span
                className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                style={{ backgroundColor: 'var(--sf-primary)' }}
              />
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1">Shop</span>
        </Link>

        {/* Search */}
        <Link
          href="/search"
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-200 ${
            isSearchActive ? 'scale-105 font-bold' : 'opacity-70 hover:opacity-100 font-medium'
          }`}
          style={{
            color: isSearchActive ? 'var(--sf-primary)' : 'var(--sf-text)',
          }}
        >
          <div className="relative">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={isSearchActive ? 2.5 : 2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {isSearchActive && (
              <span
                className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                style={{ backgroundColor: 'var(--sf-primary)' }}
              />
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1">Search</span>
        </Link>

        {/* Wishlist */}
        <Link
          href="/wishlist"
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-200 relative ${
            isWishlistActive ? 'scale-105 font-bold' : 'opacity-70 hover:opacity-100 font-medium'
          }`}
          style={{
            color: isWishlistActive ? 'var(--sf-primary)' : 'var(--sf-text)',
          }}
        >
          <div className="relative">
            <svg className="w-5 h-5" fill={isWishlistActive ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={isWishlistActive ? 1.5 : 2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {wishlistCount > 0 && (
              <span
                className="absolute -top-1.5 -right-2 text-white text-[9px] font-black min-w-[15px] h-[15px] px-1 rounded-full flex items-center justify-center shadow-sm"
                style={{ backgroundColor: 'var(--sf-primary)' }}
              >
                {wishlistCount > 99 ? '99+' : wishlistCount}
              </span>
            )}
            {isWishlistActive && (
              <span
                className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                style={{ backgroundColor: 'var(--sf-primary)' }}
              />
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1">Saved</span>
        </Link>

        {/* Cart Bag */}
        <button
          onClick={openCart}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-200 relative cursor-pointer ${
            isCartActive ? 'scale-105 font-bold' : 'opacity-70 hover:opacity-100 font-medium'
          }`}
          style={{
            color: isCartActive ? 'var(--sf-primary)' : 'var(--sf-text)',
          }}
          aria-label="Shopping Cart"
        >
          <div className="relative">
            <svg className="w-5 h-5" fill={isCartActive ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={isCartActive ? 1.5 : 2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {itemCount > 0 && (
              <span
                className="absolute -top-1.5 -right-2 text-white text-[9px] font-black min-w-[15px] h-[15px] px-1 rounded-full flex items-center justify-center shadow-sm animate-pulse"
                style={{ backgroundColor: 'var(--sf-primary)' }}
              >
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
            {isCartActive && (
              <span
                className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                style={{ backgroundColor: 'var(--sf-primary)' }}
              />
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1">Bag</span>
        </button>
      </div>
    </nav>
  );
}
