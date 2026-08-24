'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/api/types';
import { useCurrency } from '@/hooks/useCurrency';

interface MinimalProductCardProps {
  product: Product;
}

export default function MinimalProductCard({ product }: MinimalProductCardProps) {
  const { formatPrice } = useCurrency();
  const imageUrl = product.image || product.images?.[0];
  const productHref = product.urlSlug ? `/products/${product.urlSlug}` : `/products/${product.id}`;
  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const stock = product.stockQuantity !== undefined ? Number(product.stockQuantity) : product.inventory !== undefined ? Number(product.inventory) : 1;
  const isOutOfStock = stock <= 0;

  return (
    <Link href={productHref} className="group block">
      {/* Image */}
      <div
        className="relative overflow-hidden mb-4"
        style={{
          aspectRatio: '3/4',
          backgroundColor: 'color-mix(in srgb, var(--sf-text) 4%, var(--sf-bg))',
        }}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background: `linear-gradient(160deg, color-mix(in srgb, var(--sf-primary) 8%, var(--sf-bg)), color-mix(in srgb, var(--sf-accent) 5%, var(--sf-bg)))`,
            }}
          >
            <svg className="w-10 h-10 opacity-20" style={{ color: 'var(--sf-text)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.75} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Hover CTA */}
        <div
          className="absolute inset-0 flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)' }}
        >
          <span
            className="text-xs tracking-widest uppercase font-medium px-5 py-2.5"
            style={{ backgroundColor: 'var(--sf-bg)', color: 'var(--sf-text)' }}
          >
            {isOutOfStock ? 'Out of Stock' : 'View Product'}
          </span>
        </div>

        <div className="absolute top-3 right-3 flex flex-col gap-1 z-10">
          {discount > 0 && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white/80 dark:bg-black/80" style={{ color: 'var(--sf-primary)' }}>
              −{discount}%
            </span>
          )}
          {isOutOfStock && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-600 text-white">
              Out of Stock
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div>
        {product.brandName && (
          <p className="text-xs tracking-widest uppercase mb-1" style={{ color: 'color-mix(in srgb, var(--sf-text) 40%, transparent)' }}>
            {product.brandName}
          </p>
        )}
        <p className="text-sm font-light mb-2 transition-opacity group-hover:opacity-60" style={{ color: 'var(--sf-text)' }}>
          {product.name}
        </p>
        <div className="flex items-center gap-3">
          <span className="text-sm" style={{ color: 'var(--sf-text)' }}>
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && (
            <span className="text-xs line-through" style={{ color: 'color-mix(in srgb, var(--sf-text) 35%, transparent)' }}>
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
          {isOutOfStock && (
            <span className="text-xs font-bold text-rose-600 ml-auto">
              Out of Stock
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
