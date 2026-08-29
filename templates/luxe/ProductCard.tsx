'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import type { Product, ProductDetail } from '@/lib/api/types';
import { useWishlist } from '@/context/WishlistContext';
import { useCurrency } from '@/hooks/useCurrency';
import QuickVariantModal from '@/components/shared/QuickVariantModal';

type LuxeProduct = Product & Partial<Pick<ProductDetail, 'colorOptions'>>;

interface LuxeProductCardProps {
  product: LuxeProduct;
}

export default function LuxeProductCard({ product }: LuxeProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { formatPrice } = useCurrency();
  const isWishlisted = isInWishlist(product.id);

  const hasVariants = Boolean(product.variants && product.variants.length > 0);
  const variantPrices = hasVariants
    ? product.variants!.map((v) => Number(v.price)).filter((p) => !isNaN(p))
    : [];
  const minVariantPrice = variantPrices.length > 0 ? Math.min(...variantPrices) : Number(product.price);
  const maxVariantPrice = variantPrices.length > 0 ? Math.max(...variantPrices) : Number(product.price);
  const hasPriceRange = hasVariants && minVariantPrice !== maxVariantPrice;

  const imageUrl = product.image || product.images?.[0];
  const secondImage = product.images?.[1];
  const productHref = product.urlSlug ? `/products/${product.urlSlug}` : `/products/${product.id}`;
  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleWishlist(product.id);
  };

  const stock = hasVariants
    ? product.variants!.reduce((sum, v) => sum + Number(v.inventory ?? 0), 0)
    : (product.stockQuantity !== undefined ? Number(product.stockQuantity) : product.inventory !== undefined ? Number(product.inventory) : 1);
  const isOutOfStock = stock <= 0;

  return (
    <div
      className="group relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={productHref} className="block">
        {/* Image Container */}
        <div
          className="relative overflow-hidden mb-4"
          style={{
            aspectRatio: '3/4',
            backgroundColor: 'color-mix(in srgb, var(--sf-text) 4%, var(--sf-bg))',
          }}
        >
          {/* Main Image */}
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{
                background: `linear-gradient(160deg, color-mix(in srgb, var(--sf-primary) 6%, var(--sf-bg)), color-mix(in srgb, var(--sf-accent) 4%, var(--sf-bg)))`,
              }}
            >
              <svg className="w-10 h-10 opacity-20" style={{ color: 'var(--sf-text)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.75} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Hover: Second image */}
          {secondImage ? (
            <Image
              src={secondImage}
              alt={`${product.name} — alternate view`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-opacity duration-500"
              style={{ opacity: hovered ? 1 : 0 }}
            />
          ) : null}

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
            {hasVariants && (
              <span
                className="px-2.5 py-0.5 text-xs font-semibold tracking-wider uppercase bg-black/80 text-white backdrop-blur-sm"
              >
                {product.variants!.length} Editions
              </span>
            )}
            {discount > 0 && (
              <span
                className="px-2.5 py-0.5 text-xs font-light tracking-widest uppercase"
                style={{ backgroundColor: 'var(--sf-primary)', color: 'white' }}
              >
                −{discount}%
              </span>
            )}
            {isOutOfStock && (
              <span
                className="px-2.5 py-0.5 text-xs font-bold tracking-widest uppercase bg-rose-600 text-white shadow-sm"
              >
                Out of Stock
              </span>
            )}
          </div>

          {/* Quick Option Button on Hover */}
          {hasVariants && !isOutOfStock && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsVariantModalOpen(true);
              }}
              className="absolute inset-x-4 bottom-4 py-2.5 px-4 text-xs tracking-widest uppercase font-medium bg-white/95 text-black hover:bg-black hover:text-white transition-all shadow-md backdrop-blur opacity-0 group-hover:opacity-100 z-20 cursor-pointer text-center"
            >
              Select Edition ⚡
            </button>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              {product.brandName && (
                <p className="text-xs tracking-[0.15em] uppercase mb-1 font-light" style={{ color: 'var(--sf-primary)' }}>
                  {product.brandName}
                </p>
              )}
              <h3 className="text-sm font-light leading-snug transition-opacity group-hover:opacity-60" style={{ color: 'var(--sf-text)' }}>
                {product.name}
              </h3>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-sm font-medium" style={{ color: 'var(--sf-text)' }}>
                {hasPriceRange ? `From ${formatPrice(minVariantPrice)}` : formatPrice(minVariantPrice)}
              </p>
              {product.compareAtPrice && (
                <p className="text-xs font-light line-through" style={{ color: 'color-mix(in srgb, var(--sf-text) 30%, transparent)' }}>
                  {formatPrice(product.compareAtPrice)}
                </p>
              )}
              {isOutOfStock && (
                <p className="text-[11px] font-bold text-rose-600">
                  Out of Stock
                </p>
              )}
            </div>
          </div>

          {/* Color options */}
          {product.colorOptions && product.colorOptions.length > 0 && (
            <div className="flex gap-1.5 mt-2">
              {product.colorOptions.slice(0, 5).map((color) => (
                <span
                  key={color}
                  title={color}
                  className="w-3 h-3 rounded-full border"
                  style={{ backgroundColor: color.toLowerCase(), borderColor: 'color-mix(in srgb, var(--sf-text) 20%, transparent)' }}
                />
              ))}
            </div>
          )}
        </div>
      </Link>

      {/* Quick Wishlist */}
      <button
        onClick={handleWishlist}
        className={`absolute top-4 right-4 z-20 transition-all duration-300 p-1.5 rounded-full ${
          isWishlisted
            ? 'opacity-100 bg-rose-50 text-rose-500 shadow-md'
            : 'opacity-0 group-hover:opacity-100 bg-white/90 text-gray-600 hover:text-rose-500'
        }`}
        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <svg className="w-4 h-4" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

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
