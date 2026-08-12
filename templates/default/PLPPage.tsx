'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import DefaultHeader from './Header';
import DefaultFooter from './Footer';
import DefaultProductCard from './ProductCard';
import type { PLPPageProps } from '@/templates';

export default function DefaultPLPPage({ theme, products, categories, brands, searchParams }: PLPPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const currentParams = useSearchParams();

  const [priceMin, setPriceMin] = useState(searchParams.minPrice?.toString() || '');
  const [priceMax, setPriceMax] = useState(searchParams.maxPrice?.toString() || '');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeCategory = searchParams.category as string | undefined;
  const activeBrand = searchParams.brand as string | undefined;
  const activeSort = (searchParams.sort as string) || 'newest';
  const searchQuery = searchParams.search as string | undefined;

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'popular', label: 'Best Selling' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
  ];

  const updateParams = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(currentParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push(pathname);
    setPriceMin('');
    setPriceMax('');
  };

  const hasFilters = activeCategory || activeBrand || priceMin || priceMax || searchQuery;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--sf-bg)' }}>
      <DefaultHeader />

      <main className="flex-1">
        {/* Page Header */}
        <div
          className="py-10 px-4 sm:px-6 lg:px-8 border-b"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--sf-text) 3%, var(--sf-bg))',
            borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)',
          }}
        >
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm mb-4" style={{ color: 'color-mix(in srgb, var(--sf-text) 50%, transparent)' }}>
              <a href="/" style={{ color: 'color-mix(in srgb, var(--sf-text) 50%, transparent)' }}>Home</a>
              <span>/</span>
              <span style={{ color: 'var(--sf-text)' }}>Products</span>
              {activeCategory && (
                <>
                  <span>/</span>
                  <span style={{ color: 'var(--sf-text)' }} className="capitalize">{activeCategory}</span>
                </>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold" style={{ color: 'var(--sf-text)' }}>
                  {activeCategory ? <span className="capitalize">{activeCategory}</span> : 'All Products'}
                </h1>
                <p
                  className="mt-1 text-sm"
                  style={{ color: 'color-mix(in srgb, var(--sf-text) 50%, transparent)' }}
                >
                  {products.length} {products.length === 1 ? 'product' : 'products'}
                </p>
              </div>

              {/* Sort */}
              <select
                value={activeSort}
                onChange={(e) => updateParams({ sort: e.target.value })}
                className="sf-input px-4 py-2.5 text-sm pr-10 appearance-none cursor-pointer"
                style={{ color: 'var(--sf-text)', minWidth: '180px' }}
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            {/* ── Filter Sidebar ─────────────────────────────────────────── */}
            <aside
              className={`
                fixed inset-0 z-40 lg:static lg:block lg:w-64 lg:flex-shrink-0
                ${sidebarOpen ? 'block' : 'hidden'}
              `}
            >
              {/* Mobile overlay */}
              <div
                className="fixed inset-0 lg:hidden"
                style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                onClick={() => setSidebarOpen(false)}
              />

              <div
                className="relative h-full lg:h-auto overflow-y-auto lg:overflow-visible p-6 lg:p-0 w-72 lg:w-auto"
                style={{
                  backgroundColor: 'var(--sf-bg)',
                  maxHeight: 'calc(100vh - 2rem)',
                }}
              >
                {/* Close button (mobile) */}
                <div className="flex items-center justify-between mb-6 lg:hidden">
                  <h2 className="text-lg font-bold" style={{ color: 'var(--sf-text)' }}>Filters</h2>
                  <button onClick={() => setSidebarOpen(false)} style={{ color: 'var(--sf-text)' }}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Filter Header */}
                  <div className="hidden lg:flex items-center justify-between">
                    <h2 className="text-base font-bold" style={{ color: 'var(--sf-text)' }}>Filters</h2>
                    {hasFilters && (
                      <button
                        onClick={clearFilters}
                        className="text-xs font-medium transition-colors"
                        style={{ color: 'var(--sf-primary)' }}
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  {/* Categories */}
                  {categories.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--sf-text)' }}>Category</h3>
                      <div className="space-y-2">
                        <button
                          onClick={() => updateParams({ category: undefined })}
                          className="w-full text-left text-sm px-3 py-2 rounded-lg transition-all duration-150"
                          style={{
                            backgroundColor: !activeCategory ? 'color-mix(in srgb, var(--sf-primary) 10%, transparent)' : 'transparent',
                            color: !activeCategory ? 'var(--sf-primary)' : 'var(--sf-text)',
                            fontWeight: !activeCategory ? '600' : '400',
                          }}
                        >
                          All Products
                        </button>
                        {categories.map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => updateParams({ category: cat.slug })}
                            className="w-full text-left text-sm px-3 py-2 rounded-lg transition-all duration-150"
                            style={{
                              backgroundColor: activeCategory === cat.slug ? 'color-mix(in srgb, var(--sf-primary) 10%, transparent)' : 'transparent',
                              color: activeCategory === cat.slug ? 'var(--sf-primary)' : 'var(--sf-text)',
                              fontWeight: activeCategory === cat.slug ? '600' : '400',
                            }}
                          >
                            {cat.icon && <span className="mr-2">{cat.icon}</span>}
                            {cat.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Brands */}
                  {brands.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--sf-text)' }}>Brand</h3>
                      <div className="space-y-2">
                        {brands.map((brand) => (
                          <label
                            key={brand.id}
                            className="flex items-center gap-3 cursor-pointer group"
                          >
                            <div
                              className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all"
                              style={{
                                border: activeBrand === brand.slug ? 'none' : '1.5px solid color-mix(in srgb, var(--sf-text) 30%, transparent)',
                                backgroundColor: activeBrand === brand.slug ? 'var(--sf-primary)' : 'transparent',
                              }}
                              onClick={() => updateParams({ brand: activeBrand === brand.slug ? undefined : brand.slug })}
                            >
                              {activeBrand === brand.slug && (
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <span
                              className="text-sm"
                              style={{ color: activeBrand === brand.slug ? 'var(--sf-primary)' : 'var(--sf-text)' }}
                            >
                              {brand.name}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Price Range */}
                  <div>
                    <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--sf-text)' }}>Price Range</h3>
                    <div className="flex gap-3 items-center">
                      <input
                        type="number"
                        placeholder="Min"
                        value={priceMin}
                        onChange={(e) => setPriceMin(e.target.value)}
                        className="sf-input w-full px-3 py-2 text-sm"
                        style={{ color: 'var(--sf-text)' }}
                        min="0"
                      />
                      <span style={{ color: 'color-mix(in srgb, var(--sf-text) 40%, transparent)' }}>–</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={priceMax}
                        onChange={(e) => setPriceMax(e.target.value)}
                        className="sf-input w-full px-3 py-2 text-sm"
                        style={{ color: 'var(--sf-text)' }}
                        min="0"
                      />
                    </div>
                    <button
                      onClick={() => updateParams({ minPrice: priceMin || undefined, maxPrice: priceMax || undefined })}
                      className="w-full mt-3 py-2 rounded-lg text-sm font-medium text-white transition-all"
                      style={{ backgroundColor: 'var(--sf-primary)' }}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </aside>

            {/* ── Product Grid ──────────────────────────────────────────────── */}
            <div className="flex-1 min-w-0">
              {/* Mobile Filter Button */}
              <div className="lg:hidden mb-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all"
                  style={{
                    color: 'var(--sf-text)',
                    borderColor: 'color-mix(in srgb, var(--sf-text) 20%, transparent)',
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filters {hasFilters && <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs text-white" style={{ backgroundColor: 'var(--sf-primary)' }}>•</span>}
                </button>
              </div>

              {/* Active Filters Tags */}
              {hasFilters && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {activeCategory && (
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: 'color-mix(in srgb, var(--sf-primary) 10%, transparent)', color: 'var(--sf-primary)' }}
                    >
                      {activeCategory}
                      <button onClick={() => updateParams({ category: undefined })}>×</button>
                    </span>
                  )}
                  {activeBrand && (
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: 'color-mix(in srgb, var(--sf-primary) 10%, transparent)', color: 'var(--sf-primary)' }}
                    >
                      {activeBrand}
                      <button onClick={() => updateParams({ brand: undefined })}>×</button>
                    </span>
                  )}
                </div>
              )}

              {products.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center py-24 rounded-2xl"
                  style={{ backgroundColor: 'color-mix(in srgb, var(--sf-text) 3%, var(--sf-bg))' }}
                >
                  <svg className="w-16 h-16 mb-4 opacity-20" style={{ color: 'var(--sf-text)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--sf-text)' }}>No products found</h3>
                  <p className="text-sm mb-6" style={{ color: 'color-mix(in srgb, var(--sf-text) 50%, transparent)' }}>
                    Try adjusting your filters or search terms.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="btn-primary px-6 py-2.5 text-sm font-medium"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {products.map((product) => (
                    <DefaultProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <DefaultFooter />
    </div>
  );
}
