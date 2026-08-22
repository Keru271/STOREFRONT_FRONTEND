'use client';

import { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import MinimalHeader from './Header';
import MinimalFooter from './Footer';
import MinimalProductCard from './ProductCard';
import type { PLPPageProps } from '@/templates';

export default function MinimalPLPPage({ products, categories, brands, filterFacets, searchParams }: PLPPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const currentParams = useSearchParams();

  const activeCategory = (searchParams.category as string) || (searchParams.categories as string) || '';
  const activeBrand = (searchParams.brand as string) || (searchParams.brands as string) || '';
  const activeGender = (searchParams.gender as string) || '';
  const activeDiscount = searchParams.discount ? Number(searchParams.discount) : (searchParams.minDiscount ? Number(searchParams.minDiscount) : 0);
  const activeSort = (searchParams.sort as string) || 'newest';

  const updateParams = (updates: Record<string, string | number | undefined | null>) => {
    const params = new URLSearchParams(currentParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '' && value !== 0 && value !== 'all') {
        params.set(key, String(value));
      } else {
        params.delete(key);
      }
    });
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push(pathname);
  };

  const hasFilters = Boolean(activeCategory || activeBrand || activeGender || activeDiscount > 0 || searchParams.minPrice || searchParams.maxPrice);

  const availableCategories = filterFacets?.categories?.length
    ? filterFacets.categories
    : categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug, count: 0 }));

  const availableBrands = filterFacets?.brands?.length
    ? filterFacets.brands
    : brands.map((b) => ({ id: b.id, name: b.name, slug: b.slug, count: 0 }));

  const genderOptions = filterFacets?.genders || [
    { label: 'Men', value: 'men' },
    { label: 'Women', value: 'women' },
    { label: 'Unisex', value: 'unisex' },
    { label: 'Kids', value: 'kids' },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--sf-bg)' }}>
      <MinimalHeader />
      <main className="flex-1 max-w-6xl mx-auto px-6 w-full py-12">

        {/* Title bar */}
        <div className="flex items-baseline justify-between mb-8 pb-6" style={{ borderBottom: '1px solid color-mix(in srgb, var(--sf-text) 10%, transparent)' }}>
          <div>
            <span className="text-xs tracking-widest uppercase block mb-2" style={{ color: 'color-mix(in srgb, var(--sf-text) 40%, transparent)' }}>
              {products.length} {products.length === 1 ? 'product' : 'products'}
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

        {/* Gender / Target */}
        <div className="flex flex-wrap gap-4 mb-4 text-xs tracking-widest uppercase">
          <span style={{ color: 'color-mix(in srgb, var(--sf-text) 40%, transparent)' }}>Target:</span>
          <button
            onClick={() => updateParams({ gender: undefined })}
            style={{
              color: !activeGender ? 'var(--sf-primary)' : 'color-mix(in srgb, var(--sf-text) 50%, transparent)',
              textDecoration: !activeGender ? 'underline' : 'none',
            }}
          >
            All
          </button>
          {genderOptions.map((g) => (
            <button
              key={g.value}
              onClick={() => updateParams({ gender: activeGender.toLowerCase() === g.value.toLowerCase() ? undefined : g.value })}
              style={{
                color: activeGender.toLowerCase() === g.value.toLowerCase() ? 'var(--sf-primary)' : 'color-mix(in srgb, var(--sf-text) 50%, transparent)',
                textDecoration: activeGender.toLowerCase() === g.value.toLowerCase() ? 'underline' : 'none',
              }}
            >
              {g.label}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        {availableCategories.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={() => updateParams({ category: undefined, categories: undefined })}
              className="text-xs tracking-widest uppercase transition-opacity"
              style={{
                color: !activeCategory ? 'var(--sf-primary)' : 'color-mix(in srgb, var(--sf-text) 50%, transparent)',
                textDecoration: !activeCategory ? 'underline' : 'none',
              }}
            >
              All Categories
            </button>
            {availableCategories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => updateParams({ category: activeCategory.toLowerCase() === (cat.slug || cat.name).toLowerCase() ? undefined : (cat.slug || cat.name) })}
                className="text-xs tracking-widest uppercase transition-opacity"
                style={{
                  color: activeCategory.toLowerCase() === (cat.slug || cat.name).toLowerCase() ? 'var(--sf-primary)' : 'color-mix(in srgb, var(--sf-text) 50%, transparent)',
                  textDecoration: activeCategory.toLowerCase() === (cat.slug || cat.name).toLowerCase() ? 'underline' : 'none',
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Brand & Discount Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-6 border-b" style={{ borderColor: 'color-mix(in srgb, var(--sf-text) 8%, transparent)' }}>
          {availableBrands.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs tracking-widest uppercase" style={{ color: 'color-mix(in srgb, var(--sf-text) 40%, transparent)' }}>
                Brands:
              </span>
              {availableBrands.map((brand) => (
                <button
                  key={brand.name}
                  onClick={() => updateParams({ brand: activeBrand === (brand.slug || brand.name) ? undefined : (brand.slug || brand.name) })}
                  className="text-xs px-3 py-1 border transition-all"
                  style={{
                    color: activeBrand === (brand.slug || brand.name) ? 'var(--sf-bg)' : 'var(--sf-text)',
                    backgroundColor: activeBrand === (brand.slug || brand.name) ? 'var(--sf-text)' : 'transparent',
                    borderColor: 'color-mix(in srgb, var(--sf-text) 20%, transparent)',
                  }}
                >
                  {brand.name}
                </button>
              ))}
            </div>
          )}

          {hasFilters && (
            <button onClick={clearFilters} className="text-xs tracking-widest uppercase underline text-rose-500">
              Clear All
            </button>
          )}
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-lg font-extralight" style={{ color: 'color-mix(in srgb, var(--sf-text) 35%, transparent)' }}>
              No products found
            </p>
            <button onClick={clearFilters} className="mt-4 text-xs tracking-widest uppercase underline">
              Reset Filters
            </button>
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
