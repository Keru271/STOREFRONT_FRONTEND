'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Product, ProductDetail } from '@/lib/api/types';

type LuxeProduct = Product & Partial<Pick<ProductDetail, 'colorOptions'>>;

interface LuxeProductCardProps {
  product: LuxeProduct;
}

export default function LuxeProductCard({ product }: LuxeProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const imageUrl = product.image || product.images?.[0];
  const secondImage = product.images?.[1];
  const productHref = product.urlSlug ? `/products/${product.urlSlug}` : `/products/${product.id}`;
  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <Link
      href={productHref}
      className="group block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image with crossfade */}
      <div
        className="relative overflow-hidden mb-5"
        style={{
          aspectRatio: '3/4',
          backgroundColor: 'color-mix(in srgb, var(--sf-text) 6%, var(--sf-bg))',
        }}
      >
        {/* Primary image */}
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
            style={{ opacity: hovered && secondImage ? 0 : 1 }}
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(160deg,
                color-mix(in srgb, var(--sf-primary) 18%, var(--sf-bg)),
                color-mix(in srgb, var(--sf-secondary) 12%, var(--sf-bg)))`,
            }}
          />
        )}

        {/* Hover: Second image or zoom */}
        {secondImage ? (
          <img
            src={secondImage}
            alt={`${product.name} — alternate view`}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
            style={{ opacity: hovered ? 1 : 0 }}
          />
        ) : (
          imageUrl && (
            <img
              src={imageUrl}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 scale-100 group-hover:scale-110"
            />
          )
        )}

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5">
          {discount > 0 && (
            <span
              className="px-2.5 py-0.5 text-xs font-light tracking-widest uppercase"
              style={{ backgroundColor: 'var(--sf-primary)', color: 'white' }}
            >
              −{discount}%
            </span>
          )}
          {product.stockQuantity === 0 && (
            <span
              className="px-2.5 py-0.5 text-xs font-light tracking-widest uppercase"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--sf-text) 80%, transparent)',
                color: 'var(--sf-bg)',
              }}
            >
              Sold Out
            </span>
          )}
        </div>

        {/* Quick Wishlist */}
        <button
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-1.5"
          style={{ backgroundColor: 'var(--sf-bg)', color: 'var(--sf-text)' }}
          aria-label="Add to wishlist"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.25}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
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
              ${product.price.toFixed(2)}
            </p>
            {product.compareAtPrice && (
              <p className="text-xs font-light line-through" style={{ color: 'color-mix(in srgb, var(--sf-text) 30%, transparent)' }}>
                ${product.compareAtPrice.toFixed(2)}
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
  );
}
