'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/api/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCurrency } from '@/hooks/useCurrency';
import QuickVariantModal from '@/components/shared/QuickVariantModal';
import QuickViewModal from '@/components/shared/QuickViewModal';
import NotifyMeModal from '@/components/shared/NotifyMeModal';
import { getProductStockInfo } from '@/lib/stock';

export interface PawzyProductCardProps {
  product: Product;
}

export default function PawzyProductCard({ product }: PawzyProductCardProps) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { formatPrice } = useCurrency();
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isNotifyMeOpen, setIsNotifyMeOpen] = useState(false);

  const hasVariants = Boolean(product.variants && product.variants.length > 0);
  const variantPrices = hasVariants
    ? product.variants!.map((v) => Number(v.price)).filter((p) => !isNaN(p))
    : [];
  const minVariantPrice =
    variantPrices.length > 0 ? Math.min(...variantPrices) : Number(product.price);
  const maxVariantPrice =
    variantPrices.length > 0 ? Math.max(...variantPrices) : Number(product.price);
  const hasPriceRange = hasVariants && minVariantPrice !== maxVariantPrice;

  const isWishlisted = isInWishlist(product.id);
  const mainImage = product.image || (product.images && product.images[0]);
  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : 0;

  const stockInfo = getProductStockInfo(product);
  const stock = stockInfo.stock;
  const isOutOfStock = stockInfo.isOutOfStock;

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) {
      setIsNotifyMeOpen(true);
      return;
    }

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
    <div className="group relative flex flex-col space-y-3">
      {/* Product Image Card Box */}
      <div className="relative aspect-square w-full bg-[#f4f5f7] dark:bg-slate-900/60 rounded-3xl p-4 flex flex-col justify-between overflow-hidden border border-slate-100 dark:border-slate-800 hover:border-amber-400 transition-all duration-300">
        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 z-10 flex flex-col gap-1">
          {discount > 0 && (
            <span className="px-2.5 py-0.5 font-extrabold text-[11px] rounded-full shadow-xs text-white bg-[#e75338]">
              -{discount}%
            </span>
          )}
          {isOutOfStock && (
            <span className="px-2.5 py-0.5 font-bold text-[10px] rounded-full shadow-xs text-white bg-slate-900">
              Sold Out
            </span>
          )}
        </div>

        {/* Top Right Floating Action Buttons */}
        <div className="absolute top-3.5 right-3.5 z-10 flex flex-col gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsQuickViewOpen(true);
            }}
            className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-md flex items-center justify-center text-xs hover:scale-110 active:scale-95 transition cursor-pointer"
            title="Quick View"
          >
            👁️
          </button>

          <button
            type="button"
            onClick={handleWishlistClick}
            className={`w-8 h-8 rounded-full bg-white dark:bg-slate-800 shadow-md flex items-center justify-center text-xs hover:scale-110 active:scale-95 transition cursor-pointer ${
              isWishlisted ? 'text-amber-500 font-black' : 'text-slate-700 dark:text-slate-200'
            }`}
            title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            {isWishlisted ? '★' : '☆'}
          </button>
        </div>

        {/* Product Image Link */}
        <Link href={href} className="flex-1 flex items-center justify-center p-2 relative my-auto">
          {mainImage ? (
            <Image
              src={mainImage}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className={`object-contain p-3 group-hover:scale-108 transition-transform duration-500 ${isOutOfStock ? 'opacity-60 grayscale-[35%]' : ''}`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl">
              🐕
            </div>
          )}
          {/* Center Sold Out Badge */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/35 backdrop-blur-[1px] flex items-center justify-center z-15 pointer-events-none rounded-2xl">
              <span className="bg-rose-600 text-white text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-lg">
                Sold Out
              </span>
            </div>
          )}
        </Link>

        {/* Full Width Yellow Add To Cart Button at Bottom of Card Box */}
        <div className="relative z-10 pt-1.5 sm:pt-2">
          <button
            onClick={handleQuickAdd}
            disabled={isAdding}
            className={`w-full py-2 sm:py-2.5 px-2 rounded-full font-extrabold text-[10px] sm:text-xs uppercase tracking-wider shadow-sm transition flex items-center justify-center gap-1 active:scale-95 cursor-pointer ${
              isOutOfStock
                ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-[#ffd100] hover:bg-[#ffc400] text-slate-950'
            }`}
          >
            <span>
              {added
                ? 'Added! ✓'
                : isAdding
                  ? 'Adding...'
                  : isOutOfStock
                    ? 'Sold Out'
                    : hasVariants
                      ? 'Options'
                      : 'Add To Cart'}
            </span>
          </button>
        </div>
      </div>

      {/* Centered Product Info Below Card Box */}
      <div className="text-center space-y-1 px-1">
        <Link href={href} className="block">
          <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug hover:text-sky-600 transition">
            {product.name}
          </h3>
        </Link>

        {/* 5 Stars Rating */}
        <div className="flex items-center justify-center gap-0.5 text-xs text-slate-300 dark:text-slate-600">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-slate-400">★</span>
          ))}
        </div>

        {/* Price Centered */}
        <div className="flex items-baseline justify-center gap-2 pt-0.5">
          <span className="text-sm font-extrabold text-slate-900 dark:text-white">
            {hasPriceRange
              ? `From ${formatPrice(minVariantPrice)}`
              : formatPrice(minVariantPrice)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-xs text-rose-400 dark:text-rose-400/80 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
          {isOutOfStock && (
            <span className="text-[10px] font-black text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-full">
              Out of Stock
            </span>
          )}
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

      {/* Quick View Modal */}
      {isQuickViewOpen && (
        <QuickViewModal
          isOpen={isQuickViewOpen}
          onClose={() => setIsQuickViewOpen(false)}
          product={product}
          activeTemplate="pawzy"
        />
      )}

      {/* Notify Me Modal */}
      {isNotifyMeOpen && (
        <NotifyMeModal
          isOpen={isNotifyMeOpen}
          onClose={() => setIsNotifyMeOpen(false)}
          product={product}
          activeTemplate="pawzy"
        />
      )}
    </div>
  );
}
