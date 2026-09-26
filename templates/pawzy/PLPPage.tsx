'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import PawzyHeader from './Header';
import PawzyFooter from './Footer';
import PawzyProductCard from './ProductCard';
import type { PLPPageProps } from '@/templates';
import { useCurrency } from '@/hooks/useCurrency';

export default function PawzyPLPPage({
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
      className="min-h-screen flex flex-col bg-[#fdfdfd] text-[#1f2937]"
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >
      <PawzyHeader />

      <main className="flex-1 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        {/* ── Breadcrumb & Header ────────────────────────────────────────── */}
        <div className="space-y-3 pb-6 border-b border-[#eaeaea]">
          <nav className="flex items-center gap-2 text-[12px] text-[#6b7280]">
            <Link href="/" className="hover:text-[#1f2937] transition">
              Home
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-[#1f2937] transition">
              Pet Store
            </Link>
            {activeBrand ? (
              <>
                <span>/</span>
                <span className="text-[#1f2937] font-bold capitalize">
                  {(searchParams._brandName as string) || activeBrand}
                </span>
              </>
            ) : activeCategory && activeCategory !== 'all' ? (
              <>
                <span>/</span>
                <span className="text-[#1f2937] font-bold capitalize">
                  {(searchParams._categoryName as string) || activeCategory}
                </span>
              </>
            ) : searchQuery ? (
              <>
                <span>/</span>
                <span className="text-[#1f2937] font-bold">Search: "{searchQuery}"</span>
              </>
            ) : null}
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
            <div>
              <h1
                className="text-3xl sm:text-4xl font-normal text-[#1f2937]"
                style={{ fontFamily: "'Fredoka', cursive, sans-serif" }}
              >
                {searchQuery
                  ? `Search Results for "${searchQuery}"`
                  : activeBrand
                    ? (searchParams._brandName as string) || activeBrand
                    : activeCategory && activeCategory !== 'all'
                      ? (searchParams._categoryName as string) || activeCategory
                      : 'All Pet Food, Toys & Accessories'}
              </h1>
              <p className="text-[13.44px] text-[#6b7280] mt-1">
                {(searchParams._brandDescription as string) ||
                  (searchParams._categoryDescription as string) ||
                  `Showing ${displayProducts.length} certified pet supplies`}
              </p>
            </div>

            {/* Sort & View Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden px-4 py-2 rounded-full bg-[#ffd100] text-[#1f2937] text-xs font-bold flex items-center gap-2"
              >
                <span>⚡</span>
                <span>Filters</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#6b7280]">Sort:</span>
                <select
                  value={activeSort}
                  onChange={(e) => updateUrlFilters({ sort: e.target.value })}
                  className="px-4 py-2 rounded-full bg-white border border-[#eaeaea] text-xs font-bold text-[#1f2937] shadow-2xs focus:outline-none focus:border-[#ffd100] cursor-pointer"
                >
                  <option value="default">Featured & Popular</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="newest">New Arrivals</option>
                  <option value="discount">Biggest Discounts</option>
                </select>
              </div>

              <div className="hidden sm:flex items-center border border-[#eaeaea] rounded-full overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1.5 text-xs cursor-pointer ${
                    viewMode === 'grid' ? 'bg-[#ffd100] text-[#1f2937] font-bold' : 'bg-white text-[#6b7280]'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1.5 text-xs cursor-pointer ${
                    viewMode === 'list' ? 'bg-[#ffd100] text-[#1f2937] font-bold' : 'bg-white text-[#6b7280]'
                  }`}
                >
                  List
                </button>
              </div>
            </div>
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-[11px] font-bold text-[#6b7280] uppercase tracking-wider">
                Active:
              </span>
              {activeCategory && (
                <button
                  onClick={() => handleCategorySelect(activeCategory)}
                  className="px-3.5 py-1 rounded-full bg-[#eff5ff] text-[#1f2937] text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <span>Category: {activeCategory}</span>
                  <span className="text-slate-400 hover:text-slate-900">✕</span>
                </button>
              )}
              {activeBrand && (
                <button
                  onClick={() => handleBrandSelect(activeBrand)}
                  className="px-3.5 py-1 rounded-full bg-[#eff5ff] text-[#1f2937] text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <span>Brand: {activeBrand}</span>
                  <span className="text-slate-400 hover:text-slate-900">✕</span>
                </button>
              )}
              {activeDiscount > 0 && (
                <button
                  onClick={() => handleDiscountSelect(activeDiscount)}
                  className="px-3.5 py-1 rounded-full bg-[#ffd100] text-[#1f2937] text-xs font-bold flex items-center gap-1.5"
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
          <aside className="hidden lg:block lg:col-span-3 space-y-6 bg-white p-6 rounded-3xl border border-[#eaeaea] shadow-xs">
            {/* Category Filter */}
            <div className="space-y-3">
              <h3
                className="text-[14px] font-bold text-[#1f2937] pb-2 border-b border-[#eaeaea]"
                style={{ fontFamily: "'Fredoka', sans-serif" }}
              >
                Pet Categories
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() => handleCategorySelect('')}
                  className={`w-full text-left px-3.5 py-2 rounded-2xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                    !activeCategory
                      ? 'bg-[#ffd100] text-[#1f2937]'
                      : 'text-[#6b7280] hover:bg-[#f5f5f5]'
                  }`}
                >
                  <span>All Pet Supplies</span>
                  <span>{products.length}</span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.slug || cat.name)}
                    className={`w-full text-left px-3.5 py-2 rounded-2xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                      activeCategory.toLowerCase() === (cat.slug || cat.name).toLowerCase()
                        ? 'bg-[#ffd100] text-[#1f2937]'
                        : 'text-[#6b7280] hover:bg-[#f5f5f5]'
                    }`}
                  >
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-3 pt-4 border-t border-[#eaeaea]">
              <h3
                className="text-[14px] font-bold text-[#1f2937] pb-2 border-b border-[#eaeaea]"
                style={{ fontFamily: "'Fredoka', sans-serif" }}
              >
                Price Filter
              </h3>
              <form onSubmit={handleApplyPriceFilter} className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-2.5 text-xs text-[#9ca3af]">
                      {currencySymbol || '$'}
                    </span>
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPriceInput}
                      onChange={(e) => setMinPriceInput(e.target.value)}
                      className="w-full pl-7 pr-2 py-2 rounded-full border border-[#eaeaea] text-xs text-[#1f2937] focus:outline-none focus:border-[#ffd100]"
                    />
                  </div>
                  <span className="text-[#9ca3af] text-xs">-</span>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-2.5 text-xs text-[#9ca3af]">
                      {currencySymbol || '$'}
                    </span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPriceInput}
                      onChange={(e) => setMaxPriceInput(e.target.value)}
                      className="w-full pl-7 pr-2 py-2 rounded-full border border-[#eaeaea] text-xs text-[#1f2937] focus:outline-none focus:border-[#ffd100]"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-[#f5f5f5] hover:bg-[#ffd100] rounded-full text-xs font-bold text-[#1f2937] transition cursor-pointer"
                >
                  Apply Price Range
                </button>
              </form>
            </div>

            {/* Brands Filter */}
            {brands && brands.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-[#eaeaea]">
                <h3
                  className="text-[14px] font-bold text-[#1f2937] pb-2 border-b border-[#eaeaea]"
                  style={{ fontFamily: "'Fredoka', sans-serif" }}
                >
                  Popular Brands
                </h3>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {brands.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => handleBrandSelect(b.slug || b.name)}
                      className={`w-full text-left px-3.5 py-1.5 rounded-2xl text-xs font-semibold transition flex items-center justify-between cursor-pointer ${
                        activeBrand.toLowerCase() === (b.slug || b.name).toLowerCase()
                          ? 'bg-[#ffd100] text-[#1f2937] font-bold'
                          : 'text-[#6b7280] hover:bg-[#f5f5f5]'
                      }`}
                    >
                      <span>{b.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Special Discounts */}
            <div className="space-y-3 pt-4 border-t border-[#eaeaea]">
              <h3
                className="text-[14px] font-bold text-[#1f2937] pb-2 border-b border-[#eaeaea]"
                style={{ fontFamily: "'Fredoka', sans-serif" }}
              >
                Special Discounts
              </h3>
              <div className="space-y-1">
                {[10, 20, 30, 40].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => handleDiscountSelect(pct)}
                    className={`w-full text-left px-3.5 py-1.5 rounded-2xl text-xs font-semibold transition cursor-pointer ${
                      activeDiscount === pct
                        ? 'bg-[#ffd100] text-[#1f2937] font-bold'
                        : 'text-[#6b7280] hover:bg-[#f5f5f5]'
                    }`}
                  >
                    {pct}% or more off
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
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
                  <PawzyProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#eaeaea] space-y-4">
                <div className="text-5xl">🐕</div>
                <h3
                  className="text-xl font-bold text-[#1f2937]"
                  style={{ fontFamily: "'Fredoka', sans-serif" }}
                >
                  No pet supplies match your filters
                </h3>
                <p className="text-[13.44px] text-[#6b7280] max-w-sm mx-auto">
                  Try adjusting or clearing your selected filters to view our full catalog.
                </p>
                <button
                  onClick={handleClearAll}
                  className="px-6 py-2.5 rounded-full bg-[#ffd100] text-[#1f2937] text-xs font-bold uppercase tracking-wider hover:bg-[#ecbd00] transition cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Filter Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-[95] lg:hidden bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="w-4/5 max-w-sm bg-white h-full p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#eaeaea]">
              <h3 className="font-bold text-base uppercase">Filter Products</h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-1 text-[#6b7280] hover:text-[#1f2937]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider">Categories</h4>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    handleCategorySelect('');
                    setMobileFiltersOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 rounded-2xl text-xs font-bold"
                >
                  All Products
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      handleCategorySelect(cat.slug || cat.name);
                      setMobileFiltersOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 rounded-2xl text-xs font-semibold ${
                      activeCategory.toLowerCase() === (cat.slug || cat.name).toLowerCase()
                        ? 'bg-[#ffd100] text-[#1f2937]'
                        : 'text-[#6b7280]'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                handleClearAll();
                setMobileFiltersOpen(false);
              }}
              className="w-full py-3 rounded-full bg-[#ffd100] text-xs font-bold text-[#1f2937]"
            >
              Clear All Filters
            </button>
          </div>
          <div className="flex-1" onClick={() => setMobileFiltersOpen(false)} />
        </div>
      )}

      <PawzyFooter />
    </div>
  );
}
