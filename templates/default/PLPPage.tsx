'use client';

import { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import DefaultHeader from './Header';
import DefaultFooter from './Footer';
import DefaultProductCard from './ProductCard';
import type { PLPPageProps } from '@/templates';
import { useCurrency } from '@/hooks/useCurrency';

export default function DefaultPLPPage({ theme, products, categories, brands, filterFacets, searchParams }: PLPPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const currentParams = useSearchParams();
  const { symbol: currencySymbol } = useCurrency();

  const [priceMin, setPriceMin] = useState(searchParams.minPrice?.toString() || '');
  const [priceMax, setPriceMax] = useState(searchParams.maxPrice?.toString() || '');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeCategory = (searchParams.category as string) || (searchParams.categories as string) || '';
  const activeBrand = (searchParams.brand as string) || (searchParams.brands as string) || '';
  const activeGender = (searchParams.gender as string) || '';
  const activeDiscount = searchParams.discount ? Number(searchParams.discount) : (searchParams.minDiscount ? Number(searchParams.minDiscount) : 0);
  const activeSort = (searchParams.sort as string) || 'newest';
  const searchQuery = (searchParams.search as string) || (searchParams.q as string) || '';

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'popular', label: 'Best Selling' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'name', label: 'Alphabetical (A-Z)' },
  ];

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
    setPriceMin('');
    setPriceMax('');
  };

  const hasFilters = Boolean(
    activeCategory ||
    activeBrand ||
    activeGender ||
    activeDiscount > 0 ||
    priceMin ||
    priceMax ||
    searchQuery
  );

  const availableCategories = filterFacets?.categories?.length
    ? filterFacets.categories
    : categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug, count: 0 }));

  const availableBrands = filterFacets?.brands?.length
    ? filterFacets.brands
    : brands.map((b) => ({ id: b.id, name: b.name, slug: b.slug, count: 0 }));

  const genderOptions = filterFacets?.genders || [
    { label: 'Men', value: 'men', count: 0 },
    { label: 'Women', value: 'women', count: 0 },
    { label: 'Unisex', value: 'unisex', count: 0 },
    { label: 'Kids', value: 'kids', count: 0 },
  ];

  const discountOptions = filterFacets?.discounts || [
    { label: '10% and above', value: 10, count: 0 },
    { label: '20% and above', value: 20, count: 0 },
    { label: '30% and above', value: 30, count: 0 },
    { label: '50% and above', value: 50, count: 0 },
  ];

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
              <a href="/products" style={{ color: 'color-mix(in srgb, var(--sf-text) 50%, transparent)' }}>Products</a>
              {activeBrand ? (
                <>
                  <span>/</span>
                  <a href="/brands" style={{ color: 'color-mix(in srgb, var(--sf-text) 50%, transparent)' }}>Brands</a>
                  <span>/</span>
                  <span style={{ color: 'var(--sf-text)' }} className="capitalize font-bold">
                    {(searchParams._brandName as string) || activeBrand}
                  </span>
                </>
              ) : activeCategory ? (
                <>
                  <span>/</span>
                  <a href="/categories" style={{ color: 'color-mix(in srgb, var(--sf-text) 50%, transparent)' }}>Categories</a>
                  <span>/</span>
                  <span style={{ color: 'var(--sf-text)' }} className="capitalize font-bold">
                    {(searchParams._categoryName as string) || activeCategory}
                  </span>
                </>
              ) : null}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold" style={{ color: 'var(--sf-text)' }}>
                  {activeBrand ? (
                    <span className="capitalize">{(searchParams._brandName as string) || activeBrand}</span>
                  ) : activeCategory ? (
                    <span className="capitalize">{(searchParams._categoryName as string) || activeCategory}</span>
                  ) : searchQuery ? (
                    `Search: "${searchQuery}"`
                  ) : (
                    'All Products'
                  )}
                </h1>
                <p
                  className="mt-1 text-sm"
                  style={{ color: 'color-mix(in srgb, var(--sf-text) 50%, transparent)' }}
                >
                  {(searchParams._brandDescription as string) ||
                   (searchParams._categoryDescription as string) ||
                   `${products.length} ${products.length === 1 ? 'product' : 'products'}`}
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

        {/* ── Content Area ──────────────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8 items-start">
            
            {/* ── Sidebar Filters ────────────────────────────────────────────── */}
            <aside className={`
              fixed inset-0 z-50 p-6 lg:p-0 lg:static lg:block lg:w-64 lg:flex-shrink-0 lg:z-auto
              ${sidebarOpen ? 'block bg-black/60 backdrop-blur-sm' : 'hidden'}
            `}>
              <div
                className="h-full overflow-y-auto lg:h-auto lg:overflow-visible p-6 rounded-2xl border"
                style={{
                  backgroundColor: 'var(--sf-bg)',
                  borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)',
                }}
              >
                {/* Mobile Close Button */}
                <div className="flex items-center justify-between lg:hidden mb-6 pb-4 border-b">
                  <h2 className="font-bold text-lg" style={{ color: 'var(--sf-text)' }}>Filters</h2>
                  <button onClick={() => setSidebarOpen(false)} className="p-1 rounded-lg">✕</button>
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

                  {/* 1. Gender */}
                  <div>
                    <h3 className="text-sm font-semibold mb-2.5" style={{ color: 'var(--sf-text)' }}>Gender</h3>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => updateParams({ gender: undefined })}
                        className="py-1.5 px-2 text-xs font-medium rounded-lg border transition text-center"
                        style={{
                          backgroundColor: !activeGender ? 'var(--sf-primary)' : 'transparent',
                          color: !activeGender ? 'white' : 'var(--sf-text)',
                          borderColor: !activeGender ? 'var(--sf-primary)' : 'color-mix(in srgb, var(--sf-text) 15%, transparent)',
                        }}
                      >
                        All
                      </button>
                      {genderOptions.map((g) => (
                        <button
                          key={g.value}
                          onClick={() => updateParams({ gender: activeGender.toLowerCase() === g.value.toLowerCase() ? undefined : g.value })}
                          className="py-1.5 px-2 text-xs font-medium rounded-lg border transition text-center"
                          style={{
                            backgroundColor: activeGender.toLowerCase() === g.value.toLowerCase() ? 'var(--sf-primary)' : 'transparent',
                            color: activeGender.toLowerCase() === g.value.toLowerCase() ? 'white' : 'var(--sf-text)',
                            borderColor: activeGender.toLowerCase() === g.value.toLowerCase() ? 'var(--sf-primary)' : 'color-mix(in srgb, var(--sf-text) 15%, transparent)',
                          }}
                        >
                          {g.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. Categories */}
                  {availableCategories.length > 0 && (
                    <div className="pt-4 border-t" style={{ borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)' }}>
                      <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--sf-text)' }}>Category</h3>
                      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                        <button
                          onClick={() => updateParams({ category: undefined, categories: undefined })}
                          className="w-full text-left text-xs px-3 py-1.5 rounded-lg transition-all"
                          style={{
                            backgroundColor: !activeCategory ? 'color-mix(in srgb, var(--sf-primary) 12%, transparent)' : 'transparent',
                            color: !activeCategory ? 'var(--sf-primary)' : 'var(--sf-text)',
                            fontWeight: !activeCategory ? '600' : '400',
                          }}
                        >
                          All Products
                        </button>
                        {availableCategories.map((cat) => {
                          const isSelected = activeCategory.toLowerCase() === (cat.slug || cat.name).toLowerCase();
                          return (
                            <button
                              key={cat.id || cat.slug || cat.name}
                              onClick={() => updateParams({ category: isSelected ? undefined : (cat.slug || cat.name) })}
                              className="w-full text-left text-xs px-3 py-1.5 rounded-lg transition-all flex items-center justify-between"
                              style={{
                                backgroundColor: isSelected ? 'color-mix(in srgb, var(--sf-primary) 12%, transparent)' : 'transparent',
                                color: isSelected ? 'var(--sf-primary)' : 'var(--sf-text)',
                                fontWeight: isSelected ? '600' : '400',
                              }}
                            >
                              <span className="truncate">{cat.name}</span>
                              {cat.count > 0 && <span className="text-[10px] opacity-60">({cat.count})</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 3. Brands */}
                  {availableBrands.length > 0 && (
                    <div className="pt-4 border-t" style={{ borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)' }}>
                      <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--sf-text)' }}>Brand</h3>
                      <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                        {availableBrands.map((brand) => {
                          const isSelected = activeBrand.toLowerCase() === (brand.slug || brand.name).toLowerCase();
                          return (
                            <label
                              key={brand.id || brand.slug || brand.name}
                              className="flex items-center gap-2.5 py-1 px-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer text-xs"
                              onClick={() => updateParams({ brand: isSelected ? undefined : (brand.slug || brand.name) })}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => {}}
                                className="w-3.5 h-3.5 rounded text-blue-600"
                              />
                              <span className="flex-1 truncate" style={{ color: isSelected ? 'var(--sf-primary)' : 'var(--sf-text)' }}>
                                {brand.name}
                              </span>
                              {brand.count > 0 && <span className="text-[10px] opacity-60">({brand.count})</span>}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 4. Price Range */}
                  <div className="pt-4 border-t" style={{ borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)' }}>
                    <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--sf-text)' }}>Price Range</h3>
                    <div className="flex gap-2 items-center">
                      <div className="relative flex-1">
                        <span className="absolute left-2.5 top-2 text-xs opacity-50">{currencySymbol}</span>
                        <input
                          type="number"
                          placeholder="Min"
                          value={priceMin}
                          onChange={(e) => setPriceMin(e.target.value)}
                          className="sf-input w-full pl-6 pr-2 py-1.5 text-xs"
                          style={{ color: 'var(--sf-text)' }}
                          min="0"
                        />
                      </div>
                      <span style={{ color: 'color-mix(in srgb, var(--sf-text) 40%, transparent)' }}>–</span>
                      <div className="relative flex-1">
                        <span className="absolute left-2.5 top-2 text-xs opacity-50">{currencySymbol}</span>
                        <input
                          type="number"
                          placeholder="Max"
                          value={priceMax}
                          onChange={(e) => setPriceMax(e.target.value)}
                          className="sf-input w-full pl-6 pr-2 py-1.5 text-xs"
                          style={{ color: 'var(--sf-text)' }}
                          min="0"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => updateParams({ minPrice: priceMin || undefined, maxPrice: priceMax || undefined })}
                      className="w-full mt-2.5 py-1.5 rounded-lg text-xs font-semibold text-white transition-all"
                      style={{ backgroundColor: 'var(--sf-primary)' }}
                    >
                      Apply Price
                    </button>
                  </div>

                  {/* 5. Discounts */}
                  <div className="pt-4 border-t" style={{ borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)' }}>
                    <h3 className="text-sm font-semibold mb-2.5" style={{ color: 'var(--sf-text)' }}>Discounts</h3>
                    <div className="space-y-1 text-xs">
                      {discountOptions.map((d) => (
                        <button
                          key={d.value}
                          onClick={() => updateParams({ discount: activeDiscount === d.value ? undefined : d.value })}
                          className="w-full text-left py-1.5 px-2.5 rounded-lg transition-all flex items-center justify-between"
                          style={{
                            backgroundColor: activeDiscount === d.value ? 'color-mix(in srgb, var(--sf-primary) 12%, transparent)' : 'transparent',
                            color: activeDiscount === d.value ? 'var(--sf-primary)' : 'var(--sf-text)',
                            fontWeight: activeDiscount === d.value ? '600' : '400',
                          }}
                        >
                          <span>🏷️ {d.label}</span>
                          {d.count > 0 && <span className="text-[10px] opacity-60">({d.count})</span>}
                        </button>
                      ))}
                    </div>
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
                  <span>⚙️</span> Filters {hasFilters && <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs text-white" style={{ backgroundColor: 'var(--sf-primary)' }}>•</span>}
                </button>
              </div>

              {/* Active Filters Tags */}
              {hasFilters && (
                <div className="flex flex-wrap gap-2 mb-6 p-3 rounded-xl border bg-slate-50/50 dark:bg-slate-900/50">
                  {searchQuery && (
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: 'color-mix(in srgb, var(--sf-primary) 10%, transparent)', color: 'var(--sf-primary)' }}
                    >
                      Search: "{searchQuery}"
                      <button onClick={() => updateParams({ search: undefined, q: undefined })}>×</button>
                    </span>
                  )}
                  {activeCategory && (
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: 'color-mix(in srgb, var(--sf-primary) 10%, transparent)', color: 'var(--sf-primary)' }}
                    >
                      Category: {activeCategory}
                      <button onClick={() => updateParams({ category: undefined, categories: undefined })}>×</button>
                    </span>
                  )}
                  {activeBrand && (
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: 'color-mix(in srgb, var(--sf-primary) 10%, transparent)', color: 'var(--sf-primary)' }}
                    >
                      Brand: {activeBrand}
                      <button onClick={() => updateParams({ brand: undefined, brands: undefined })}>×</button>
                    </span>
                  )}
                  {activeGender && (
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: 'color-mix(in srgb, var(--sf-primary) 10%, transparent)', color: 'var(--sf-primary)' }}
                    >
                      Gender: {activeGender.toUpperCase()}
                      <button onClick={() => updateParams({ gender: undefined })}>×</button>
                    </span>
                  )}
                  {activeDiscount > 0 && (
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: 'color-mix(in srgb, var(--sf-primary) 10%, transparent)', color: 'var(--sf-primary)' }}
                    >
                      {activeDiscount}%+ Off
                      <button onClick={() => updateParams({ discount: undefined, minDiscount: undefined })}>×</button>
                    </span>
                  )}
                  {(searchParams.minPrice || searchParams.maxPrice) && (
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: 'color-mix(in srgb, var(--sf-primary) 10%, transparent)', color: 'var(--sf-primary)' }}
                    >
                      Price: {currencySymbol}{searchParams.minPrice || '0'} - {currencySymbol}{searchParams.maxPrice || '∞'}
                      <button onClick={() => { setPriceMin(''); setPriceMax(''); updateParams({ minPrice: undefined, maxPrice: undefined }); }}>×</button>
                    </span>
                  )}
                  <button onClick={clearFilters} className="text-xs underline ml-auto text-rose-500 font-medium">Clear All</button>
                </div>
              )}

              {products.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center py-24 rounded-2xl"
                  style={{ backgroundColor: 'color-mix(in srgb, var(--sf-text) 3%, var(--sf-bg))' }}
                >
                  <div className="w-16 h-16 mb-4 text-3xl flex items-center justify-center">🔍</div>
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
