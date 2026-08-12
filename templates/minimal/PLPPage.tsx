'use client';

import { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import MinimalHeader from './Header';
import MinimalFooter from './Footer';
import MinimalProductCard from './ProductCard';
import type { PLPPageProps } from '@/templates';

export default function MinimalPLPPage({ products, categories, brands, searchParams }: PLPPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const currentParams = useSearchParams();

  const activeCategory = searchParams.category as string | undefined;
  const activeBrand = searchParams.brand as string | undefined;
  const activeSort = (searchParams.sort as string) || 'newest';

  const updateParams = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(currentParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--sf-bg)' }}>
      <MinimalHeader />
      <main className="flex-1 max-w-6xl mx-auto px-6 w-full py-12">

        {/* Title bar */}
        <div className="flex items-baseline justify-between mb-8 pb-6" style={{ borderBottom: '1px solid color-mix(in srgb, var(--sf-text) 10%, transparent)' }}>
          <div>
            <span className="text-xs tracking-widest uppercase block mb-2" style={{ color: 'color-mix(in srgb, var(--sf-text) 40%, transparent)' }}>
              {products.length} products
            </span>
            <h1 className="text-4xl font-extralight" style={{ color: 'var(--sf-text)' }}>
              {activeCategory ? <span className="capitalize">{activeCategory}</span> : 'Shop All'}
            </h1>
          </div>
          <select
            value={activeSort}
            onChange={(e) => updateParams({ sort: e.target.value })}
            className="text-xs tracking-widest uppercase bg-transparent border-none outline-none cursor-pointer"
            style={{ color: 'var(--sf-text)' }}
          >
            <option value="newest">Newest</option>
            <option value="popular">Popular</option>
            <option value="price_asc">Price ↑</option>
            <option value="price_desc">Price ↓</option>
          </select>
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-8">
            <button
              onClick={() => updateParams({ category: undefined })}
              className="text-xs tracking-widest uppercase transition-opacity"
              style={{
                color: !activeCategory ? 'var(--sf-primary)' : 'color-mix(in srgb, var(--sf-text) 50%, transparent)',
                textDecoration: !activeCategory ? 'underline' : 'none',
              }}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => updateParams({ category: cat.slug })}
                className="text-xs tracking-widest uppercase transition-opacity"
                style={{
                  color: activeCategory === cat.slug ? 'var(--sf-primary)' : 'color-mix(in srgb, var(--sf-text) 50%, transparent)',
                  textDecoration: activeCategory === cat.slug ? 'underline' : 'none',
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Brand Filter */}
        {brands.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            {brands.map((brand) => (
              <button
                key={brand.id}
                onClick={() => updateParams({ brand: activeBrand === brand.slug ? undefined : brand.slug })}
                className="text-xs px-3 py-1 border transition-all"
                style={{
                  color: activeBrand === brand.slug ? 'var(--sf-bg)' : 'var(--sf-text)',
                  backgroundColor: activeBrand === brand.slug ? 'var(--sf-text)' : 'transparent',
                  borderColor: 'color-mix(in srgb, var(--sf-text) 20%, transparent)',
                }}
              >
                {brand.name}
              </button>
            ))}
          </div>
        )}

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-lg font-extralight" style={{ color: 'color-mix(in srgb, var(--sf-text) 35%, transparent)' }}>
              No products found
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {products.map((p) => (
              <MinimalProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </main>
      <MinimalFooter />
    </div>
  );
}
