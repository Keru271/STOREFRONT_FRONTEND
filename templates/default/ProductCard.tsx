'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import type { Product } from '@/lib/api/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCurrency } from '@/hooks/useCurrency';
import QuickVariantModal from '@/components/shared/QuickVariantModal';
import QuickViewModal from '@/components/shared/QuickViewModal';
import NotifyMeModal from '@/components/shared/NotifyMeModal';

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

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const imageUrl = product.image || (product.images && product.images[0]);
  const productHref = product.urlSlug ? `/products/${product.urlSlug}` : `/products/${product.id}`;
  const isWishlisted = isInWishlist(product.id);

  const stock = hasVariants
    ? product.variants!.reduce((sum, v) => sum + Number(v.inventory ?? 0), 0)
    : product.stockQuantity !== undefined
      ? Number(product.stockQuantity)
      : product.inventory !== undefined
        ? Number(product.inventory)
        : 1;
  const isOutOfStock = stock <= 0;

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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
          Added to cart!
        </div>
      )}

      {/* Top Actions: Quick View & Wishlist */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsQuickViewOpen(true);
          }}
          className="p-2 rounded-full backdrop-blur-md bg-white/85 text-gray-600 hover:text-black hover:bg-white shadow-sm transition-all duration-200 hover:scale-110 cursor-pointer"
          title="Quick View"
          aria-label="Quick View"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        </button>

        <button
          type="button"
          onClick={handleWishlistToggle}
          className={`p-2 rounded-full backdrop-blur-md transition-all duration-200 shadow-sm cursor-pointer ${
            isWishlisted
              ? 'bg-rose-50 text-rose-500 hover:scale-110'
              : 'bg-white/85 text-gray-400 hover:text-rose-500 hover:bg-white'
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
      </div>

      {/* Card Click Link */}
      <Link href={productHref} className="block">
        {/* Image Container */}
        <div className="relative aspect-square w-full bg-gray-50 dark:bg-gray-900 overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              No Image
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {discount > 0 && (
              <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                -{discount}%
              </span>
            )}
            {(product as any).isFeatured && (
              <span className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                Featured
              </span>
            )}
            {(product as any).isNew && (
              <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                New
              </span>
            )}
            {isOutOfStock && (
              <span className="bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                Sold Out
              </span>
            )}
          </div>

          {/* Quick Add / Notify Me Overlay Button */}
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={isAdding}
            className={`absolute inset-x-0 bottom-0 py-3 px-4 translate-y-full group-hover:translate-y-0 transition-all duration-300 font-semibold text-sm text-white flex items-center justify-center gap-2 cursor-pointer ${
              isOutOfStock
                ? 'bg-amber-600 hover:bg-amber-700'
                : ''
            }`}
            style={isOutOfStock ? undefined : { backgroundColor: 'var(--sf-primary)' }}
          >
            {isAdding ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Adding...
              </span>
            ) : isOutOfStock ? (
              <>
                <span>🔔</span>
                <span>Notify Me</span>
              </>
            ) : hasVariants ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
                Select Options ⚡
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
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
              <span className="text-base font-bold" style={{ color: 'var(--sf-primary)' }}>
                {hasPriceRange
                  ? `From ${formatPrice(minVariantPrice)}`
                  : formatPrice(minVariantPrice)}
              </span>
              {product.compareAtPrice && (
                <span className="text-sm line-through text-gray-400">
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

      {/* Quick View Modal */}
      {isQuickViewOpen && (
        <QuickViewModal
          isOpen={isQuickViewOpen}
          onClose={() => setIsQuickViewOpen(false)}
          product={product}
          activeTemplate="default"
        />
      )}

      {/* Notify Me Modal */}
      {isNotifyMeOpen && (
        <NotifyMeModal
          isOpen={isNotifyMeOpen}
          onClose={() => setIsNotifyMeOpen(false)}
          product={product}
          activeTemplate="default"
        />
      )}
    </div>
  );
}
