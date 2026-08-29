'use client';

import { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import NovaHeader from './Header';
import NovaFooter from './Footer';
import NovaProductCard from './ProductCard';
import type { PLPPageProps } from '@/templates';
import { useCurrency } from '@/hooks/useCurrency';

export default function NovaPLPPage({
  categories,
  brands,
  products,
  filterFacets,
  searchParams,
}: PLPPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const currentParams = useSearchParams();
  const { symbol: currencySymbol } = useCurrency();

  const activeCategory = (searchParams.category as string) || (searchParams.categories as string) || '';
  const activeBrand = (searchParams.brand as string) || (searchParams.brands as string) || '';
  const activeGender = (searchParams.gender as string) || '';
  const activeDiscount = searchParams.discount ? Number(searchParams.discount) : (searchParams.minDiscount ? Number(searchParams.minDiscount) : 0);
  const activeSort = (searchParams.sort as string) || 'featured';
  const searchQuery = (searchParams.search as string) || (searchParams.q as string) || '';

  const [priceMin, setPriceMin] = useState(searchParams.minPrice?.toString() || '');
  const [priceMax, setPriceMax] = useState(searchParams.maxPrice?.toString() || '');

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
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    setPriceMin('');
    setPriceMax('');
    router.push(pathname);
  };

  const hasActiveFilters = Boolean(
    activeCategory ||
    activeBrand ||
    activeGender ||
    activeDiscount > 0 ||
    searchParams.minPrice ||
    searchParams.maxPrice ||
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
    <div className="min-h-screen flex flex-col bg-[#f5f5f7] text-[#1d1d1f] font-sans antialiased selection:bg-[#0071e3] selection:text-white">
      <NovaHeader />

      <main className="flex-1">
        {/* ── Sticky Sub-Header ─────────────────────────────────────────── */}
        <div className="bg-white border-b border-[#e2e2e5] py-6 px-4 sm:px-6">
          <div className="max-w-[1024px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-semibold tracking-wider text-[#0071e3] uppercase block">
                {activeBrand ? 'Brand Showcase' : activeCategory ? 'Category Filter' : 'All Products'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-semibold text-[#1d1d1f] tracking-tight">
                {searchQuery
                  ? `Search results for "${searchQuery}"`
                  : activeBrand
                    ? ((searchParams._brandName as string) || activeBrand)
                    : activeCategory
                      ? categories.find((c) => c.slug === activeCategory)?.name || activeCategory
                      : 'Explore All Hardware & Goods'}
              </h1>
              <p className="text-[12px] text-[#707070] mt-1">
                {(searchParams._brandDescription as string) ||
                  (searchParams._categoryDescription as string) ||
                  `Showing ${products.length} ${products.length === 1 ? 'item' : 'items'}`}
              </p>
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-[#707070]">Sort by:</span>
              <select
                value={activeSort}
                onChange={(e) => updateUrlFilters({ sort: e.target.value })}
                className="bg-[#f5f5f7] border border-[#d2d2d7] rounded-[980px] px-3.5 py-1.5 text-[12px] font-medium text-[#1d1d1f] focus:outline-none focus:border-[#0071e3] transition-colors cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">Newest First</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── Active Filter Pills Bar ───────────────────────────────────── */}
        {hasActiveFilters && (
          <div className="bg-[#f5f5f7] border-b border-[#e2e2e5] py-2.5 px-4 sm:px-6">
            <div className="max-w-[1024px] mx-auto flex items-center gap-2 flex-wrap text-[12px]">
              <span className="text-[#858585]">Active filters:</span>
              
              {searchQuery && (
                <button
                  onClick={() => updateUrlFilters({ search: undefined, q: undefined })}
                  className="px-2.5 py-1 rounded-[980px] bg-white border border-[#d2d2d7] text-[#1d1d1f] hover:border-[#0071e3] flex items-center gap-1.5"
                >
                  <span>Search: "{searchQuery}"</span>
                  <span className="text-[#858585]">✕</span>
                </button>
              )}

              {activeCategory && (
                <button
                  onClick={() => updateUrlFilters({ category: undefined, categories: undefined })}
                  className="px-2.5 py-1 rounded-[980px] bg-white border border-[#d2d2d7] text-[#1d1d1f] hover:border-[#0071e3] flex items-center gap-1.5"
                >
                  <span>Category: {activeCategory}</span>
                  <span className="text-[#858585]">✕</span>
                </button>
              )}

              {activeBrand && (
                <button
                  onClick={() => updateUrlFilters({ brand: undefined, brands: undefined })}
                  className="px-2.5 py-1 rounded-[980px] bg-white border border-[#d2d2d7] text-[#1d1d1f] hover:border-[#0071e3] flex items-center gap-1.5"
                >
                  <span>Brand: {activeBrand}</span>
                  <span className="text-[#858585]">✕</span>
                </button>
              )}

              {activeGender && (
                <button
                  onClick={() => updateUrlFilters({ gender: undefined })}
                  className="px-2.5 py-1 rounded-[980px] bg-white border border-[#d2d2d7] text-[#1d1d1f] hover:border-[#0071e3] flex items-center gap-1.5"
                >
                  <span>Gender: {activeGender.toUpperCase()}</span>
                  <span className="text-[#858585]">✕</span>
                </button>
              )}

              {activeDiscount > 0 && (
                <button
                  onClick={() => updateUrlFilters({ discount: undefined, minDiscount: undefined })}
                  className="px-2.5 py-1 rounded-[980px] bg-white border border-[#d2d2d7] text-[#1d1d1f] hover:border-[#0071e3] flex items-center gap-1.5"
                >
                  <span>{activeDiscount}%+ Off</span>
                  <span className="text-[#858585]">✕</span>
                </button>
              )}

              {(searchParams.minPrice || searchParams.maxPrice) && (
                <button
                  onClick={() => { setPriceMin(''); setPriceMax(''); updateUrlFilters({ minPrice: undefined, maxPrice: undefined }); }}
                  className="px-2.5 py-1 rounded-[980px] bg-white border border-[#d2d2d7] text-[#1d1d1f] hover:border-[#0071e3] flex items-center gap-1.5"
                >
                  <span>Price: {currencySymbol}{searchParams.minPrice || '0'} - {currencySymbol}{searchParams.maxPrice || '∞'}</span>
                  <span className="text-[#858585]">✕</span>
                </button>
              )}

              <button
                onClick={clearFilters}
                className="text-[#0066cc] hover:underline ml-2 text-[12px]"
              >
                Clear all
              </button>
            </div>
          </div>
        )}

        {/* ── Main PLP Content Grid with Filter Sidebar ─────────────────── */}
        <div className="max-w-[1024px] mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Sidebar Filter Panel */}
            <aside className="md:col-span-1 space-y-6">
              
              {/* 1. Gender */}
              <div className="bg-white border border-[#e2e2e5] rounded-[8px] p-4">
                <h3 className="text-[13px] font-semibold text-[#1d1d1f] uppercase tracking-wider mb-2.5">
                  Gender
                </h3>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => updateUrlFilters({ gender: undefined })}
                    className={`py-1 px-2 rounded-md text-[12px] font-medium transition ${
                      !activeGender ? 'bg-[#0071e3] text-white' : 'bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e8e8ed]'
                    }`}
                  >
                    All
                  </button>
                  {genderOptions.map((g) => (
                    <button
                      key={g.value}
                      onClick={() => updateUrlFilters({ gender: activeGender.toLowerCase() === g.value.toLowerCase() ? undefined : g.value })}
                      className={`py-1 px-2 rounded-md text-[12px] font-medium transition ${
                        activeGender.toLowerCase() === g.value.toLowerCase() ? 'bg-[#0071e3] text-white' : 'bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e8e8ed]'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Category Filter */}
              <div className="bg-white border border-[#e2e2e5] rounded-[8px] p-4">
                <h3 className="text-[13px] font-semibold text-[#1d1d1f] uppercase tracking-wider mb-3">
                  Categories
                </h3>
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1 text-[13px]">
                  <button
                    onClick={() => updateUrlFilters({ category: undefined, categories: undefined })}
                    className={`w-full text-left py-1 px-2 rounded-md transition-colors flex items-center justify-between ${
                      !activeCategory ? 'bg-[#f5f5f7] font-semibold text-[#0071e3]' : 'text-[#707070] hover:text-[#1d1d1f]'
                    }`}
                  >
                    <span>All Categories</span>
                  </button>
                  {availableCategories.map((cat) => {
                    const isSelected = activeCategory.toLowerCase() === (cat.slug || cat.name).toLowerCase();
                    return (
                      <button
                        key={cat.id || cat.slug || cat.name}
                        onClick={() => updateUrlFilters({ category: isSelected ? undefined : (cat.slug || cat.name) })}
                        className={`w-full text-left py-1 px-2 rounded-md transition-colors flex items-center justify-between ${
                          isSelected ? 'bg-[#f5f5f7] font-semibold text-[#0071e3]' : 'text-[#707070] hover:text-[#1d1d1f]'
                        }`}
                      >
                        <span className="truncate">{cat.name}</span>
                        {cat.count > 0 && <span className="text-[10px] text-[#858585]">({cat.count})</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Brand Filter */}
              {availableBrands.length > 0 && (
                <div className="bg-white border border-[#e2e2e5] rounded-[8px] p-4">
                  <h3 className="text-[13px] font-semibold text-[#1d1d1f] uppercase tracking-wider mb-3">
                    Brands
                  </h3>
                  <div className="space-y-1 max-h-44 overflow-y-auto pr-1 text-[13px]">
                    {availableBrands.map((b) => {
                      const isSelected = activeBrand.toLowerCase() === (b.slug || b.name).toLowerCase();
                      return (
                        <button
                          key={b.id || b.slug || b.name}
                          onClick={() => updateUrlFilters({ brand: isSelected ? undefined : (b.slug || b.name) })}
                          className={`w-full text-left py-1 px-2 rounded-md transition-colors flex items-center justify-between ${
                            isSelected ? 'bg-[#f5f5f7] font-semibold text-[#0071e3]' : 'text-[#707070] hover:text-[#1d1d1f]'
                          }`}
                        >
                          <span className="truncate">{b.name}</span>
                          {b.count > 0 && <span className="text-[10px] text-[#858585]">({b.count})</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 4. Price Range */}
              <div className="bg-white border border-[#e2e2e5] rounded-[8px] p-4">
                <h3 className="text-[13px] font-semibold text-[#1d1d1f] uppercase tracking-wider mb-2.5">
                  Price Range
                </h3>
                <div className="flex gap-2 items-center text-[12px] mb-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    className="w-full px-2 py-1 bg-[#f5f5f7] border border-[#d2d2d7] rounded-md outline-none focus:border-[#0071e3]"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    className="w-full px-2 py-1 bg-[#f5f5f7] border border-[#d2d2d7] rounded-md outline-none focus:border-[#0071e3]"
                  />
                </div>
                <button
                  onClick={() => updateUrlFilters({ minPrice: priceMin || undefined, maxPrice: priceMax || undefined })}
                  className="w-full py-1.5 rounded-[980px] bg-[#1d1d1f] text-white text-[11px] font-semibold hover:bg-black transition"
                >
                  Filter Price
                </button>
              </div>

              {/* 5. Discount Options */}
              <div className="bg-white border border-[#e2e2e5] rounded-[8px] p-4">
                <h3 className="text-[13px] font-semibold text-[#1d1d1f] uppercase tracking-wider mb-2.5">
                  Special Offers
                </h3>
                <div className="space-y-1 text-[12px]">
                  {discountOptions.map((d) => (
                    <button
                      key={d.value}
                      onClick={() => updateUrlFilters({ discount: activeDiscount === d.value ? undefined : d.value })}
                      className={`w-full text-left py-1 px-2 rounded-md transition flex items-center justify-between ${
                        activeDiscount === d.value ? 'bg-[#f5f5f7] text-[#0071e3] font-semibold' : 'text-[#707070] hover:text-[#1d1d1f]'
                      }`}
                    >
                      <span>🏷️ {d.label}</span>
                      {d.count > 0 && <span className="text-[10px] text-[#858585]">({d.count})</span>}
                    </button>
                  ))}
                </div>
              </div>

            </aside>

            {/* Product Grid Area */}
            <div className="md:col-span-3">
              {products.length === 0 ? (
                <div className="bg-white border border-[#e2e2e5] rounded-[8px] p-12 text-center">
                  <div className="w-12 h-12 rounded-full bg-[#f5f5f7] flex items-center justify-center text-[#858585] mx-auto mb-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <circle cx="11" cy="11" r="7" />
                      <path strokeLinecap="round" d="m21 21-4.35-4.35" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-[#1d1d1f] mb-2">No products matched your criteria</h3>
                  <p className="text-[13px] text-[#707070] max-w-[340px] mx-auto mb-6">
                    Try clearing some filters or searching for different product keywords.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="px-5 py-2 rounded-[980px] bg-[#0071e3] text-white text-[13px] font-normal hover:bg-[#0077ed] transition-colors"
                  >
                    Reset all filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {products.map((product) => (
                    <NovaProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

      </main>

      <NovaFooter />
    </div>
  );
}
