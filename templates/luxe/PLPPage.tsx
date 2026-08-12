'use client';

import { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import LuxeHeader from './Header';
import LuxeFooter from './Footer';
import LuxeProductCard from './ProductCard';
import type { PLPPageProps } from '@/templates';

export default function LuxePLPPage({ products, categories, brands, searchParams }: PLPPageProps) {
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
      <LuxeHeader />
      <main className="flex-1">
        {/* Page Header */}
        <div
          className="py-16 px-6 text-center border-b"
          style={{ borderColor: 'color-mix(in srgb, var(--sf-text) 8%, transparent)' }}
        >
          <span className="text-xs tracking-[0.3em] uppercase block mb-3" style={{ color: 'var(--sf-primary)' }}>
            The Edit
          </span>
          <h1 className="text-5xl font-light" style={{ color: 'var(--sf-text)' }}>
            {activeCategory ? <span className="capitalize">{activeCategory}</span> : 'All Products'}
          </h1>
          <p className="mt-3 text-sm font-light" style={{ color: 'color-mix(in srgb, var(--sf-text) 40%, transparent)' }}>
            {products.length} curated pieces
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          {/* Filters bar */}
          <div
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-6 mb-8 border-b"
            style={{ borderColor: 'color-mix(in srgb, var(--sf-text) 8%, transparent)' }}
          >
            <div className="flex flex-wrap gap-4">
              {/* Category */}
              {categories.length > 0 && (
                <div className="flex gap-4">
                  <button
                    onClick={() => updateParams({ category: undefined })}
                    className="text-xs tracking-[0.15em] uppercase font-light transition-opacity"
                    style={{ color: !activeCategory ? 'var(--sf-primary)' : 'color-mix(in srgb, var(--sf-text) 45%, transparent)', textDecoration: !activeCategory ? 'underline' : 'none' }}
                  >
                    All
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => updateParams({ category: cat.slug })}
                      className="text-xs tracking-[0.15em] uppercase font-light transition-opacity"
                      style={{ color: activeCategory === cat.slug ? 'var(--sf-primary)' : 'color-mix(in srgb, var(--sf-text) 45%, transparent)', textDecoration: activeCategory === cat.slug ? 'underline' : 'none' }}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <select
              value={activeSort}
              onChange={(e) => updateParams({ sort: e.target.value })}
              className="text-xs tracking-[0.15em] uppercase bg-transparent border-none outline-none cursor-pointer font-light"
              style={{ color: 'var(--sf-text)' }}
            >
              <option value="newest">Newest</option>
              <option value="popular">Best Selling</option>
              <option value="price_asc">Price ↑</option>
              <option value="price_desc">Price ↓</option>
            </select>
          </div>

          {/* Brand filter pills */}
          {brands.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-10">
              {brands.map((brand) => (
                <button
                  key={brand.id}
                  onClick={() => updateParams({ brand: activeBrand === brand.slug ? undefined : brand.slug })}
                  className="px-4 py-1.5 text-xs tracking-[0.1em] uppercase font-light border transition-all"
                  style={{
                    color: activeBrand === brand.slug ? 'white' : 'color-mix(in srgb, var(--sf-text) 60%, transparent)',
                    backgroundColor: activeBrand === brand.slug ? 'var(--sf-primary)' : 'transparent',
                    borderColor: activeBrand === brand.slug ? 'var(--sf-primary)' : 'color-mix(in srgb, var(--sf-text) 15%, transparent)',
                  }}
                >
                  {brand.name}
                </button>
              ))}
            </div>
          )}

          {/* Product Grid */}
          {products.length === 0 ? (
            <div className="py-32 text-center">
              <p className="text-lg font-light" style={{ color: 'color-mix(in srgb, var(--sf-text) 30%, transparent)' }}>
                No pieces found for this selection
              </p>
              <button
                onClick={() => router.push(pathname)}
                className="mt-4 text-xs tracking-[0.2em] uppercase font-light transition-opacity hover:opacity-60"
                style={{ color: 'var(--sf-primary)' }}
              >
                Clear Filters →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-14 pb-20">
              {products.map((p) => (
                <LuxeProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </main>
      <LuxeFooter />
    </div>
  );
}
