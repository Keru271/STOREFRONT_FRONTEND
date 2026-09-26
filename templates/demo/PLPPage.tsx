'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import DemoHeader from './Header';
import DemoFooter from './Footer';
import DemoProductCard from './ProductCard';
import type { PLPPageProps } from '@/templates';
import { useCurrency } from '@/hooks/useCurrency';

export default function DemoPLPPage({
  theme,
  products,
  categories,
  brands,
  filterFacets,
  searchParams,
}: PLPPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const currentParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const { formatPrice, symbol: currencySymbol } = useCurrency();

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Active filter state from searchParams
  const activeCategory =
    (searchParams.category as string) || (searchParams.categories as string) || '';
  const activeBrand = (searchParams.brand as string) || (searchParams.brands as string) || '';
  const activeSort = (searchParams.sort as string) || 'default';
  const searchQuery = (searchParams.q as string) || (searchParams.search as string) || '';
  const activeDiscount = searchParams.discount
    ? Number(searchParams.discount)
    : searchParams.minDiscount
      ? Number(searchParams.minDiscount)
      : 0;

  // Local state for price inputs
  const [minPriceInput, setMinPriceInput] = useState<string>(
    searchParams.minPrice?.toString() || '',
  );
  const [maxPriceInput, setMaxPriceInput] = useState<string>(
    searchParams.maxPrice?.toString() || '',
  );

  // Helper to push URL query updates
  const updateUrlFilters = (updates: Record<string, string | number | undefined | null>) => {
    const params = new URLSearchParams(currentParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '' && value !== 0 && value !== 'all') {
        params.set(key, String(value));
      } else {
        params.delete(key);
      }
    });
    params.delete('page');

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleCategorySelect = (slugOrName: string) => {
    const next = activeCategory.toLowerCase() === slugOrName.toLowerCase() ? '' : slugOrName;
    updateUrlFilters({ category: next, categories: undefined });
  };

  const handleBrandSelect = (slugOrName: string) => {
    const next = activeBrand.toLowerCase() === slugOrName.toLowerCase() ? '' : slugOrName;
    updateUrlFilters({ brand: next, brands: undefined });
  };

  const handleDiscountSelect = (pct: number) => {
    const next = activeDiscount === pct ? 0 : pct;
    updateUrlFilters({ discount: next, minDiscount: undefined });
  };

  const handleApplyPriceFilter = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateUrlFilters({
      minPrice: minPriceInput ? Number(minPriceInput) : undefined,
      maxPrice: maxPriceInput ? Number(maxPriceInput) : undefined,
    });
  };

  const handleClearAll = () => {
    setMinPriceInput('');
    setMaxPriceInput('');
    startTransition(() => {
      router.push(pathname);
    });
  };

  const hasActiveFilters = Boolean(
    activeCategory ||
    activeBrand ||
    activeDiscount > 0 ||
    searchParams.minPrice ||
    searchParams.maxPrice ||
    searchQuery,
  );

  // Filter products locally if category or brand selected
  const displayProducts = products.filter((p) => {
    if (activeCategory && activeCategory !== 'all') {
      const matchCat =
        p.category?.toLowerCase() === activeCategory.toLowerCase() ||
        p.categoryName?.toLowerCase() === activeCategory.toLowerCase() ||
        (p as any).categorySlug?.toLowerCase() === activeCategory.toLowerCase();
      if (!matchCat) return false;
    }
    if (activeBrand) {
      const matchBrand =
        p.brandName?.toLowerCase() === activeBrand.toLowerCase() ||
        (p as any).brand?.toLowerCase() === activeBrand.toLowerCase() ||
        (p as any).brandSlug?.toLowerCase() === activeBrand.toLowerCase();
      if (!matchBrand) return false;
    }
    return true;
  });

  return (
    <div
      className="min-h-screen flex flex-col bg-[#fdfdfd] text-slate-900"
      style={{ fontFamily: "'Jost', sans-serif" }}
    >
      <DemoHeader />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        {/* ── Breadcrumb & Header ────────────────────────────────────────── */}
        <div className="space-y-3 pb-6 border-b border-slate-100">
          <nav className="flex items-center gap-2 text-xs text-slate-400">
            <Link href="/" className="hover:text-slate-900 transition">
              Home
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-slate-900 transition">
              Catalog
            </Link>
            {activeBrand ? (
              <>
                <span>/</span>
                <Link href="/brands" className="hover:text-slate-900 transition">
                  Brands
                </Link>
                <span>/</span>
                <span className="text-[#ff9638] font-bold capitalize">
                  {(searchParams._brandName as string) || activeBrand}
                </span>
              </>
            ) : activeCategory && activeCategory !== 'all' ? (
              <>
                <span>/</span>
                <Link href="/categories" className="hover:text-slate-900 transition">
                  Categories
                </Link>
                <span>/</span>
                <span className="text-[#ff9638] font-bold capitalize">
                  {(searchParams._categoryName as string) || activeCategory}
                </span>
              </>
            ) : searchQuery ? (
              <>
                <span>/</span>
                <span className="text-[#ff9638] font-bold">Search: "{searchQuery}"</span>
              </>
            ) : null}
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-medium text-slate-950">
                {searchQuery
                  ? `Search Results for "${searchQuery}"`
                  : activeBrand
                    ? (searchParams._brandName as string) || activeBrand
                    : activeCategory && activeCategory !== 'all'
                      ? (searchParams._categoryName as string) || activeCategory
                      : 'All Studio Furniture & Objects'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {(searchParams._brandDescription as string) ||
                  (searchParams._categoryDescription as string) ||
                  `Showing ${displayProducts.length} curated design pieces`}
              </p>
            </div>

            {/* Sort & View Controls */}
            <div className="flex items-center gap-3">
              {/* Mobile filter toggle */}
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden px-3 py-2 rounded-lg border border-slate-200 text-xs font-bold flex items-center gap-2"
              >
                <span>⚡</span>
                <span>Filters</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Sort:</span>
                <select
                  value={activeSort}
                  onChange={(e) => updateUrlFilters({ sort: e.target.value })}
                  className="px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-800 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#ff9638] cursor-pointer"
                >
                  <option value="default">Featured & Trending</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="newest">Newest Drops</option>
                  <option value="discount">Special Discounts</option>
                </select>
              </div>

              {/* Grid / List view mode */}
              <div className="hidden sm:flex items-center border border-slate-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 text-xs cursor-pointer ${
                    viewMode === 'grid' ? 'bg-black text-white' : 'bg-white text-slate-600'
                  }`}
                  title="Grid View"
                >
                  ▦
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 text-xs cursor-pointer ${
                    viewMode === 'list' ? 'bg-black text-white' : 'bg-white text-slate-600'
                  }`}
                  title="List View"
                >
                  ☰
                </button>
              </div>
            </div>
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Active:
              </span>
              {activeCategory && (
                <button
                  onClick={() => handleCategorySelect(activeCategory)}
                  className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 flex items-center gap-1.5 transition"
                >
                  <span>Category: {activeCategory}</span>
                  <span className="text-slate-400 hover:text-slate-900">✕</span>
                </button>
              )}
              {activeBrand && (
                <button
                  onClick={() => handleBrandSelect(activeBrand)}
                  className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 flex items-center gap-1.5 transition"
                >
                  <span>Brand: {activeBrand}</span>
                  <span className="text-slate-400 hover:text-slate-900">✕</span>
                </button>
              )}
              {activeDiscount > 0 && (
                <button
                  onClick={() => handleDiscountSelect(activeDiscount)}
                  className="px-3 py-1 rounded-full bg-orange-50 text-[#ff9638] text-xs font-semibold flex items-center gap-1.5"
                >
                  <span>{activeDiscount}%+ Off</span>
                  <span>✕</span>
                </button>
              )}
              <button
                onClick={handleClearAll}
                className="text-xs font-bold text-rose-600 hover:underline ml-2"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* ── Content Layout with Filter Sidebar ─────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6 bg-white p-6 rounded-xl border border-slate-100 shadow-xs">
            {/* Category Filter */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100">
                Categories
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() => handleCategorySelect('')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer ${
                    !activeCategory
                      ? 'bg-black text-white'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>All Categories</span>
                  <span>{products.length}</span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.slug || cat.name)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer ${
                      activeCategory.toLowerCase() === (cat.slug || cat.name).toLowerCase()
                        ? 'bg-black text-white'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100">
                Price Range
              </h3>
              <form onSubmit={handleApplyPriceFilter} className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-400">
                      {currencySymbol || '$'}
                    </span>
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPriceInput}
                      onChange={(e) => setMinPriceInput(e.target.value)}
                      className="w-full pl-7 pr-2 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#ff9638]"
                    />
                  </div>
                  <span className="text-slate-400 text-xs">-</span>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-400">
                      {currencySymbol || '$'}
                    </span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPriceInput}
                      onChange={(e) => setMaxPriceInput(e.target.value)}
                      className="w-full pl-7 pr-2 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#ff9638]"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-slate-100 hover:bg-black hover:text-white rounded-lg text-xs font-bold text-slate-800 transition cursor-pointer"
                >
                  Apply Price
                </button>
              </form>
            </div>

            {/* Brands Filter */}
            {brands && brands.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100">
                  Brands & Studios
                </h3>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {brands.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => handleBrandSelect(b.slug || b.name)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center justify-between cursor-pointer ${
                        activeBrand.toLowerCase() === (b.slug || b.name).toLowerCase()
                          ? 'bg-black text-white font-bold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>{b.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Discounts Filter */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100">
                Discount Deals
              </h3>
              <div className="space-y-1">
                {[10, 20, 30, 50].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => handleDiscountSelect(pct)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                      activeDiscount === pct
                        ? 'bg-[#ff9638] text-white font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {pct}% or more off
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid / List Area */}
          <div className="lg:col-span-9 space-y-8">
            {displayProducts.length > 0 ? (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-4'
                }
              >
                {displayProducts.map((p) => (
                  <DemoProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 space-y-4">
                <div className="text-4xl">🛋️</div>
                <h3 className="text-lg font-bold text-slate-900">No products match your filters</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try adjusting or clearing your selected filters to view our available catalog.
                </p>
                <button
                  onClick={handleClearAll}
                  className="px-6 py-2.5 rounded-lg bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-[#ff9638] transition cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Filters Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-[95] lg:hidden bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="w-4/5 max-w-sm bg-white h-full p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-sm uppercase">Filter Products</h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-900"
              >
                ✕
              </button>
            </div>

            {/* Category Filter Mobile */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider">Categories</h4>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    handleCategorySelect('');
                    setMobileFiltersOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold"
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      handleCategorySelect(cat.slug || cat.name);
                      setMobileFiltersOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold ${
                      activeCategory.toLowerCase() === (cat.slug || cat.name).toLowerCase()
                        ? 'bg-black text-white'
                        : 'text-slate-600'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear button */}
            <button
              onClick={() => {
                handleClearAll();
                setMobileFiltersOpen(false);
              }}
              className="w-full py-3 rounded-lg bg-slate-100 text-xs font-bold text-slate-800"
            >
              Clear All Filters
            </button>
          </div>
          <div className="flex-1" onClick={() => setMobileFiltersOpen(false)} />
        </div>
      )}

      <DemoFooter />
    </div>
  );
}
