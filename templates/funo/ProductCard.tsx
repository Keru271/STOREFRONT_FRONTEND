'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/api/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCurrency } from '@/hooks/useCurrency';
import QuickVariantModal from '@/components/shared/QuickVariantModal';

export interface FunoProductCardProps {
  product: Product;
}

export default function FunoProductCard({ product }: FunoProductCardProps) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { formatPrice } = useCurrency();
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);

  const hasVariants = Boolean(product.variants && product.variants.length > 0);
  const variantPrices = hasVariants
    ? product.variants!.map((v) => Number(v.price)).filter((p) => !isNaN(p))
    : [];
  const minVariantPrice = variantPrices.length > 0 ? Math.min(...variantPrices) : Number(product.price);
  const maxVariantPrice = variantPrices.length > 0 ? Math.max(...variantPrices) : Number(product.price);
  const hasPriceRange = hasVariants && minVariantPrice !== maxVariantPrice;

  const isWishlisted = isInWishlist(product.id);
  const mainImage = product.image || (product.images && product.images[0]);
  const discount = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const stock = hasVariants
    ? product.variants!.reduce((sum, v) => sum + Number(v.inventory ?? 0), 0)
    : (product.stockQuantity !== undefined ? Number(product.stockQuantity) : product.inventory !== undefined ? Number(product.inventory) : 1);
  const isOutOfStock = stock <= 0;

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    if (hasVariants) {
      setIsVariantModalOpen(true);
      return;
    }

    if (isAdding) return;
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
    <div className="group relative flex flex-col justify-between bg-white rounded-2xl border border-[#ededed] hover:border-[#d0d0d0] hover:shadow-xl transition-all duration-300 overflow-hidden">
      
      {/* Product Image Area */}
      <div className="relative aspect-square w-full bg-[#f7f7f7] overflow-hidden">
        
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
          {hasVariants && (
            <span className="px-2.5 py-1 font-black text-[10px] uppercase tracking-wider rounded-full shadow-sm text-white bg-indigo-600">
              {product.variants!.length} Options
            </span>
          )}
          {discount > 0 && (
            <span className="px-2.5 py-1 font-black text-[10px] uppercase tracking-wider rounded-full shadow-sm text-white bg-orange-500">
              -{discount}%
            </span>
          )}
          {isOutOfStock && (
            <span className="px-2.5 py-1 font-black text-[10px] uppercase tracking-wider rounded-full shadow-sm text-white bg-slate-900">
              Sold Out
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white shadow-sm flex items-center justify-center text-slate-800 transition-transform hover:scale-110"
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          {isWishlisted ? (
            <span className="text-rose-500 text-sm">❤️</span>
          ) : (
            <svg className="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          )}
        </button>

        {/* Main Image */}
        <Link href={href} className="block w-full h-full p-6 relative">
          {mainImage ? (
            <Image
              src={mainImage}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-contain p-2 group-hover:scale-106 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl text-slate-300">
              🛋️
            </div>
          )}
        </Link>

        {/* Quick Action Overlay on Hover */}
        <div className="absolute inset-x-3 bottom-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 flex gap-2">
          <button
            onClick={handleQuickAdd}
            disabled={isAdding || isOutOfStock}
            className="flex-1 py-2.5 px-3 rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 active:scale-95 bg-black hover:bg-orange-500 text-white disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
          >
            <span>{added ? 'Added! ✓' : isAdding ? 'Adding...' : isOutOfStock ? 'Sold Out' : hasVariants ? 'Select Options' : 'Quick Add'}</span>
            <span>{hasVariants ? '⚡' : '🛍️'}</span>
          </button>
          <Link
            href={href}
            className="w-10 h-10 rounded-xl bg-white hover:bg-slate-100 text-slate-800 flex items-center justify-center text-xs shadow-md border border-slate-200 transition"
            title="View Details"
          >
            👁️
          </Link>
        </div>
      </div>

      {/* Info Body */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between space-y-3">
        <div>
          {/* Category */}
          <span className="text-[10px] font-black uppercase tracking-widest text-orange-500 block mb-1">
            {product.categoryName || 'FURNITURE'}
          </span>

          {/* Title */}
          <Link href={href} className="block">
            <h3 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-2 leading-snug hover:text-orange-500 transition">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1 text-xs text-amber-400">
            {'★★★★★'}
            <span className="text-[10px] text-slate-400 font-medium ml-1">(4.9)</span>
          </div>
        </div>

        {/* Price Row */}
        <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-black text-slate-900 font-heading">
              {hasPriceRange ? `From ${formatPrice(minVariantPrice)}` : formatPrice(minVariantPrice)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-xs text-slate-400 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              isOutOfStock
                ? 'bg-rose-50 text-rose-600'
                : stock <= 5
                ? 'bg-amber-50 text-amber-700'
                : 'bg-emerald-50 text-emerald-700'
            }`}
          >
            {isOutOfStock ? 'Sold Out' : stock <= 5 ? `${stock} left` : 'In Stock'}
          </span>
        </div>
      </div>

      {/* Quick Variant Modal */}
      {hasVariants && (
        <QuickVariantModal
          isOpen={isVariantModalOpen}
          onClose={() => setIsVariantModalOpen(false)}
          product={product}
        />
      )}
    </div>
  );
}
