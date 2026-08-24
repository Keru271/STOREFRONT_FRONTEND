'use client';

// ─── Shared Wishlist Logic Component ──────────────────────────────────────────
// Contains all wishlist commerce logic.
// Each template wraps this with its own Header/Footer.

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { ThemeConfig } from '@/lib/api/types';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/hooks/useCurrency';

export interface WishlistBodyProps {
  theme: ThemeConfig;
}

export function WishlistBody({ theme: _theme }: WishlistBodyProps) {
  const { items, productIds, wishlistCount, deleteFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const [movingId, setMovingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleMoveToCart = async (productId: string) => {
    setMovingId(productId);
    try {
      await addToCart({ productId, quantity: 1 });
      await deleteFromWishlist(productId);
      setToastMessage('Item moved to your cart!');
      setTimeout(() => setToastMessage(null), 2500);
    } catch {
      /* silent */
    } finally {
      setMovingId(null);
    }
  };

  return (
    <>
      {/* Toast */}
      {toastMessage && (
        <div
          className="fixed top-20 right-6 z-50 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-fadeIn"
          style={{ backgroundColor: '#059669' }}
        >
          <span>✓</span>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-grow">
        {/* Header */}
        <div
          className="flex items-center justify-between pb-6 border-b mb-8"
          style={{ borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)' }}
        >
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: 'var(--sf-text)' }}>
              My Wishlist
            </h1>
            <p className="text-sm mt-1" style={{ color: 'color-mix(in srgb, var(--sf-text) 45%, transparent)' }}>
              {wishlistCount} {wishlistCount === 1 ? 'item' : 'items'} saved for later
            </p>
          </div>
          {productIds.length > 0 && (
            <button
              onClick={() => clearWishlist()}
              className="text-xs font-semibold transition hover:underline"
              style={{ color: 'var(--sf-accent)' }}
            >
              Clear All
            </button>
          )}
        </div>

        {productIds.length === 0 ? (
          <div
            className="text-center py-20 rounded-3xl border p-8"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--sf-text) 3%, var(--sf-bg))',
              borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)',
            }}
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--sf-accent) 10%, var(--sf-bg))',
                color: 'var(--sf-accent)',
              }}
            >
              ❤️
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--sf-text)' }}>Your wishlist is empty</h2>
            <p className="text-sm mb-6 max-w-sm mx-auto" style={{ color: 'color-mix(in srgb, var(--sf-text) 45%, transparent)' }}>
              Save items you love by tapping the heart icon on any product.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-white shadow-lg transition hover:opacity-90"
              style={{ backgroundColor: 'var(--sf-primary)' }}
            >
              Discover Products →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item) => {
              const image = item.image || item.images?.[0];
              const href = `/products/${item.urlSlug || item.id}`;

              return (
                <div
                  key={item.id}
                  className="group relative rounded-2xl border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                  style={{
                    backgroundColor: 'var(--sf-bg)',
                    borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)',
                  }}
                >
                  {/* Remove button */}
                  <button
                    onClick={() => deleteFromWishlist(item.id)}
                    className="absolute top-3 right-3 z-10 p-2 rounded-full shadow-md transition hover:scale-110"
                    style={{
                      backgroundColor: 'color-mix(in srgb, var(--sf-bg) 90%, transparent)',
                      color: 'var(--sf-accent)',
                    }}
                    title="Remove from wishlist"
                    aria-label="Remove item"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  <Link href={href} className="block">
                    {/* Image */}
                    <div
                      className="aspect-square overflow-hidden relative"
                      style={{ backgroundColor: 'color-mix(in srgb, var(--sf-text) 5%, var(--sf-bg))' }}
                    >
                      {image ? (
                        <Image
                          src={image}
                          alt={item.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl opacity-20">🛍️</div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      {item.brandName && (
                        <p className="text-xs uppercase tracking-wider font-semibold mb-1" style={{ color: 'color-mix(in srgb, var(--sf-text) 40%, transparent)' }}>
                          {item.brandName}
                        </p>
                      )}
                      <h3
                        className="font-bold text-sm line-clamp-1 mb-2 group-hover:underline"
                        style={{ color: 'var(--sf-text)' }}
                      >
                        {item.name}
                      </h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-base font-extrabold" style={{ color: 'var(--sf-primary)' }}>
                          {formatPrice(item.price)}
                        </span>
                        {item.compareAtPrice && (
                          <span className="text-xs line-through" style={{ color: 'color-mix(in srgb, var(--sf-text) 35%, transparent)' }}>
                            {formatPrice(item.compareAtPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>

                  {/* Move to cart */}
                  <div className="p-4 pt-0">
                    {(() => {
                      const stock = item.stockQuantity !== undefined ? Number(item.stockQuantity) : (item as any).inventory !== undefined ? Number((item as any).inventory) : 1;
                      const isOutOfStock = stock <= 0;
                      return (
                        <button
                          onClick={() => handleMoveToCart(item.id)}
                          disabled={movingId === item.id || isOutOfStock}
                          className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white shadow transition flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ backgroundColor: isOutOfStock ? '#64748b' : 'var(--sf-primary)' }}
                        >
                          {movingId === item.id ? (
                            'Moving…'
                          ) : isOutOfStock ? (
                            'Out of Stock'
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                              </svg>
                              Move to Cart
                            </>
                          )}
                        </button>
                      );
                    })()}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
