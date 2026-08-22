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

  const isOOS = product.stockQuantity === 0;
  const isLowStock = product.stockQuantity != null && product.stockQuantity > 0 && product.stockQuantity <= 5;

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
            View Product
          </span>
        </div>

        {discount > 0 && (
          <div className="absolute top-3 right-3 text-xs" style={{ color: 'var(--sf-primary)' }}>
            −{discount}%
          </div>
        )}
        {isOOS && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <span className="text-white text-xs font-semibold tracking-widest uppercase px-3 py-1" style={{ backgroundColor: 'var(--sf-text)' }}>Sold Out</span>
          </div>
        )}
        {isLowStock && (
          <div className="absolute top-3 left-3">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-white px-2 py-0.5">
              Only {product.stockQuantity} left
            </span>
          </div>
        )}
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
          <span className="text-sm" style={{ color: isOOS ? 'rgb(156 163 175)' : 'var(--sf-text)' }}>
            {isOOS ? <span className="text-xs font-medium text-rose-500">Out of Stock</span> : formatPrice(product.price)}
          </span>
          {!isOOS && product.compareAtPrice && (
            <span className="text-xs line-through" style={{ color: 'color-mix(in srgb, var(--sf-text) 35%, transparent)' }}>
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
