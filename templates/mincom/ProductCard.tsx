'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import type { Product } from '@/lib/api/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCurrency } from '@/hooks/useCurrency';

export interface MincomProductCardProps {
  product: Product;
}

export default function MincomProductCard({ product }: MincomProductCardProps) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { formatPrice } = useCurrency();
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const isWishlisted = isInWishlist(product.id);
  const mainImage = product.image || (product.images && product.images[0]);
  const discount = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;
  const isOOS = product.stockQuantity === 0;
  const isLowStock = product.stockQuantity != null && product.stockQuantity > 0 && product.stockQuantity <= 5;

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAdding || isOOS) return;
    setIsAdding(true);
    try {
      await addToCart({ productId: product.id, quantity: 1 });
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const href = `/products/${product.urlSlug || product.id}`;

  return (
    <div
      className="group relative rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
      style={{
        backgroundColor: 'var(--sf-bg)',
        borderRadius: 'var(--sf-radius)',
        color: 'var(--sf-text)',
      }}
    >
      
      {/* Top Image Container */}
      <div className="relative aspect-square overflow-hidden" style={{ backgroundColor: 'color-mix(in srgb, var(--sf-primary) 5%, var(--sf-bg))' }}>
        {/* Discount Badge */}
        {discount > 0 && (
          <span
            className="absolute top-3 left-3 z-10 px-2.5 py-1 font-black text-[10px] uppercase tracking-wider rounded-full shadow text-white"
            style={{ backgroundColor: 'var(--sf-accent, var(--sf-primary))' }}
          >
            -{discount}% OFF
          </span>
        )}
        {isOOS && (
          <span className="absolute top-3 left-3 z-10 px-2.5 py-1 font-black text-[10px] uppercase tracking-wider rounded-full shadow text-white bg-rose-600">
            Sold Out
          </span>
        )}
        {isLowStock && (
          <span className="absolute top-3 left-3 z-10 px-2.5 py-1 font-black text-[10px] uppercase tracking-wider rounded-full shadow text-white bg-amber-500">
            Only {product.stockQuantity} left!
          </span>
        )}

        {/* Wishlist Floating Button */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-3 right-3 z-10 w-9 h-9 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-sm shadow-md transition-transform hover:scale-110"
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          {isWishlisted ? '❤️' : '🤍'}
        </button>

        {/* Product Image */}
        <Link href={href} className="block w-full h-full p-4 relative">
          {mainImage ? (
            <Image
              src={mainImage}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-contain p-4 group-hover:scale-108 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl opacity-20">
              🛋️
            </div>
          )}
        </Link>

        {/* Hover Quick Action Buttons */}
        <div className="absolute inset-x-3 bottom-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 flex gap-2">
          <button
            onClick={handleQuickAdd}
            disabled={isAdding || isOOS}
            className={`flex-1 py-2.5 px-3 font-bold text-xs shadow-lg transition flex items-center justify-center gap-1.5 active:scale-95 text-white disabled:opacity-60 disabled:cursor-not-allowed ${
              isOOS ? 'bg-gray-400' : ''
            }`}
            style={{
              backgroundColor: isOOS ? undefined : 'var(--sf-primary)',
              borderRadius: 'calc(var(--sf-radius) * 0.75)',
            }}
          >
            <span>{isOOS ? 'Out of Stock' : added ? 'Added! ✓' : isAdding ? 'Adding...' : 'Add to Bag'}</span>
            {!isOOS && <span>🛍️</span>}
          </button>
          <Link
            href={href}
            className="w-10 h-10 text-white flex items-center justify-center text-xs shadow-lg transition"
            style={{
              backgroundColor: 'var(--sf-secondary)',
              borderRadius: 'calc(var(--sf-radius) * 0.75)',
            }}
            title="View Details"
          >
            👁️
          </Link>
        </div>
      </div>

      {/* Info Body */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Category Tag */}
          <span
            className="text-[11px] font-bold uppercase tracking-wider block mb-1"
            style={{ color: 'var(--sf-primary)' }}
          >
            {product.categoryName || 'FURNITURE'}
          </span>

          {/* Title */}
          <Link href={href} className="block">
            <h3
              className="font-bold text-sm transition line-clamp-2 leading-snug font-heading"
              style={{ color: 'var(--sf-text)' }}
            >
              {product.name}
            </h3>
          </Link>

          {/* Star Rating */}
          <div className="flex items-center gap-1 mt-1.5 text-xs" style={{ color: 'var(--sf-accent, var(--sf-primary))' }}>
            {'★★★★★'}
            <span className="text-[10px] opacity-60 ml-1 font-medium">(4.9)</span>
          </div>
        </div>

        {/* Price Row */}
        <div className="mt-4 pt-3 border-t border-slate-100/20 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-black" style={{ color: 'var(--sf-text)' }}>
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-xs opacity-50 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              isOOS ? 'bg-rose-100 text-rose-600' : isLowStock ? 'bg-amber-100 text-amber-700' : ''
            }`}
            style={isOOS || isLowStock ? undefined : {
              backgroundColor: 'color-mix(in srgb, var(--sf-primary) 15%, transparent)',
              color: 'var(--sf-primary)',
            }}
          >
            {isOOS ? 'Out of Stock' : isLowStock ? `Only ${product.stockQuantity} left` : 'In Stock'}
          </span>
        </div>
      </div>
    </div>
  );
}
