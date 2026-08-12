'use client';

import Link from 'next/link';
import type { Product } from '@/lib/api/types';

interface DefaultProductCardProps {
  product: Product;
}

export default function DefaultProductCard({ product }: DefaultProductCardProps) {
  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const imageUrl = product.image || (product.images && product.images[0]);
  const productHref = product.urlSlug ? `/products/${product.urlSlug}` : `/products/${product.id}`;

  return (
    <Link
      href={productHref}
      className="group block rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      style={{
        backgroundColor: 'var(--sf-bg)',
        boxShadow: '0 2px 12px color-mix(in srgb, var(--sf-text) 8%, transparent)',
        border: '1px solid color-mix(in srgb, var(--sf-text) 8%, transparent)',
      }}
    >
      {/* Product Image */}
      <div
        className="relative overflow-hidden aspect-square"
        style={{ backgroundColor: 'color-mix(in srgb, var(--sf-text) 5%, transparent)' }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, color-mix(in srgb, var(--sf-primary) 15%, white), color-mix(in srgb, var(--sf-secondary) 10%, white))',
            }}
          >
            <svg
              className="w-16 h-16 opacity-30"
              style={{ color: 'var(--sf-primary)' }}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span
              className="px-2.5 py-1 rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: 'var(--sf-accent)' }}
            >
              -{discount}%
            </span>
          )}
          {product.stockQuantity <= 5 && product.stockQuantity > 0 && (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold text-white bg-orange-500">
              Low Stock
            </span>
          )}
          {product.stockQuantity === 0 && (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold text-white bg-gray-500">
              Sold Out
            </span>
          )}
        </div>

        {/* Quick Add Overlay */}
        <div
          className="absolute inset-x-0 bottom-0 py-3 px-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
          style={{ backgroundColor: 'var(--sf-primary)' }}
        >
          <span className="block text-center text-sm font-semibold text-white">
            Quick Add
          </span>
        </div>
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
          className="font-semibold text-sm leading-snug mb-2 line-clamp-2 group-hover:text-[var(--sf-primary)] transition-colors"
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
              ${product.price.toFixed(2)}
            </span>
            {product.compareAtPrice && (
              <span
                className="text-sm line-through"
                style={{ color: 'color-mix(in srgb, var(--sf-text) 40%, transparent)' }}
              >
                ${product.compareAtPrice.toFixed(2)}
              </span>
            )}
          </div>

          {product.categoryName && (
            <span
              className="text-xs px-2 py-0.5 rounded-full"
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
  );
}
