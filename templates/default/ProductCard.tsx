'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import type { Product } from '@/lib/api/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCurrency } from '@/hooks/useCurrency';
import QuickVariantModal from '@/components/shared/QuickVariantModal';

interface DefaultProductCardProps {
  product: Product;
}

export default function DefaultProductCard({ product }: DefaultProductCardProps) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { formatPrice } = useCurrency();
  const [isAdding, setIsAdding] = useState(false);
  const [addedToast, setAddedToast] = useState(false);
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);

  const hasVariants = Boolean(product.variants && product.variants.length > 0);
  const variantPrices = hasVariants
    ? product.variants!.map((v) => Number(v.price)).filter((p) => !isNaN(p))
    : [];
  const minVariantPrice = variantPrices.length > 0 ? Math.min(...variantPrices) : Number(product.price);
  const maxVariantPrice = variantPrices.length > 0 ? Math.max(...variantPrices) : Number(product.price);
  const hasPriceRange = hasVariants && minVariantPrice !== maxVariantPrice;

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const imageUrl = product.image || (product.images && product.images[0]);
  const productHref = product.urlSlug ? `/products/${product.urlSlug}` : `/products/${product.id}`;
  const isWishlisted = isInWishlist(product.id);

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
      await addToCart({
        productId: product.id,
        quantity: 1,
      });
      setAddedToast(true);
      setTimeout(() => setAddedToast(false), 2000);
    } catch (err) {
      console.error('Quick add failed:', err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleWishlist(product.id);
  };

  return (
    <div className="relative group block rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl bg-white border border-gray-100 dark:border-gray-800">
      {/* Toast popup */}
      {addedToast && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 bg-emerald-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg animate-bounce flex items-center gap-1.5 whitespace-nowrap">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          Added to cart!
        </div>
      )}

      {/* Wishlist Button */}
      <button
        onClick={handleWishlistToggle}
        className={`absolute top-3 right-3 z-20 p-2 rounded-full backdrop-blur-md transition-all duration-200 shadow-sm ${
          isWishlisted
            ? 'bg-rose-50 text-rose-500 hover:scale-110'
            : 'bg-white/80 text-gray-400 hover:text-rose-500 hover:bg-white'
        }`}
        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <svg
          className="w-4 h-4"
          fill={isWishlisted ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>

      {/* Card Click Link */}
      <Link href={productHref} className="block">
        {/* Image Container */}
        <div className="relative w-full aspect-square bg-gray-50 dark:bg-gray-800/50 overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, color-mix(in srgb, var(--sf-primary) 10%, transparent), color-mix(in srgb, var(--sf-accent) 10%, transparent))`,
              }}
            >
              <svg
                className="w-12 h-12 opacity-25"
                style={{ color: 'var(--sf-primary)' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {hasVariants && (
              <span className="px-2.5 py-1 rounded-full text-xs font-black tracking-wide text-white bg-indigo-600 shadow-sm">
                {product.variants!.length} Options
              </span>
            )}
            {discount > 0 && (
              <span
                className="px-2.5 py-1 rounded-full text-xs font-bold text-white shadow-sm"
                style={{ backgroundColor: 'var(--sf-accent, #EC4899)' }}
              >
                -{discount}%
              </span>
            )}
            {!isOutOfStock && stock <= 5 && stock > 0 && (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold text-white bg-amber-500 shadow-sm">
                Only {stock} Left
              </span>
            )}
            {isOutOfStock && (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold text-white bg-rose-600 shadow-sm uppercase tracking-wider">
                Out of Stock
              </span>
            )}
          </div>

          {/* Quick Add Overlay Button */}
          <button
            onClick={handleQuickAdd}
            disabled={isAdding || isOutOfStock}
            className="absolute inset-x-0 bottom-0 py-3 px-4 translate-y-full group-hover:translate-y-0 transition-all duration-300 font-semibold text-sm text-white flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
            style={{ backgroundColor: isOutOfStock ? '#64748b' : 'var(--sf-primary)' }}
          >
            {isAdding ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Adding...
              </span>
            ) : isOutOfStock ? (
              <span>Out of Stock</span>
            ) : hasVariants ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
                Select Options ⚡
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Quick Add
              </>
            )}
          </button>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {product.brandName && (
            <p
              className="text-xs font-medium mb-1 tracking-wider uppercase"
              style={{ color: 'color-mix(in srgb, var(--sf-text) 45%, transparent)' }}
            >
              {product.brandName}
            </p>
          )}

          <h3
            className="font-semibold text-sm leading-snug mb-2 line-clamp-2 transition-colors hover:opacity-80"
            style={{ color: 'var(--sf-text)' }}
          >
            {product.name}
          </h3>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="text-base font-bold"
                style={{ color: 'var(--sf-primary)' }}
              >
                {hasPriceRange ? `From ${formatPrice(minVariantPrice)}` : formatPrice(minVariantPrice)}
              </span>
              {product.compareAtPrice && (
                <span
                  className="text-sm line-through text-gray-400"
                >
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>

            {product.categoryName && (
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--sf-primary) 10%, transparent)',
                  color: 'var(--sf-primary)',
                }}
              >
                {product.categoryName}
              </span>
            )}
          </div>
        </div>
      </Link>

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
