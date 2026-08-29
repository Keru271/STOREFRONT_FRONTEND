'use client';

import { useState, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import MincomHeader from './Header';
import MincomFooter from './Footer';
import MincomProductCard from './ProductCard';
import type { PLPPageProps } from '@/templates';
import { useCurrency } from '@/hooks/useCurrency';

export default function MincomPLPPage({
  categories,
  brands,
  products,
  filterFacets,
  searchParams,
}: PLPPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const currentParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const { formatPrice, symbol: currencySymbol } = useCurrency();

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Active filter state from searchParams
  const activeCategory = (searchParams.category as string) || (searchParams.categories as string) || '';
  const activeBrand = (searchParams.brand as string) || (searchParams.brands as string) || '';
  const activeGender = (searchParams.gender as string) || '';
  const activeDiscount = searchParams.discount ? Number(searchParams.discount) : (searchParams.minDiscount ? Number(searchParams.minDiscount) : 0);
  const activeMinPrice = searchParams.minPrice ? Number(searchParams.minPrice) : (filterFacets?.priceRange?.min ?? 0);
  const activeMaxPrice = searchParams.maxPrice ? Number(searchParams.maxPrice) : (filterFacets?.priceRange?.max ?? 2000);
  const activeSort = (searchParams.sort as string) || 'featured';
  const searchQuery = (searchParams.q as string) || (searchParams.search as string) || '';

  // Local state for price inputs
  const [minPriceInput, setMinPriceInput] = useState<string>(searchParams.minPrice?.toString() || '');
  const [maxPriceInput, setMaxPriceInput] = useState<string>(searchParams.maxPrice?.toString() || '');

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
    // Reset to page 1 on filter changes
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

  const handleGenderSelect = (genderVal: string) => {
    const next = activeGender.toLowerCase() === genderVal.toLowerCase() ? '' : genderVal;
    updateUrlFilters({ gender: next });
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
    activeGender ||
    activeDiscount > 0 ||
    searchParams.minPrice ||
    searchParams.maxPrice ||
    searchQuery
  );

  // Fallback lists if filterFacets isn't present
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
    <div className="min-h-screen flex flex-col bg-[#fafaf9] text-slate-900">
      <MincomHeader />

      {/* Hero Header Banner */}
      <div className="bg-[#23272a] text-white py-12 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-amber-400 font-bold uppercase tracking-widest text-xs">
              {activeBrand ? 'BRAND SPOTLIGHT' : activeCategory ? 'COLLECTION' : 'CATALOG'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mt-1">
              {activeBrand
                ? `${((searchParams._brandName as string) || activeBrand).toUpperCase()} COLLECTION`
                : activeCategory
                  ? `${((searchParams._categoryName as string) || activeCategory).toUpperCase()} COLLECTION`
                  : 'All Products & Furniture'}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {(searchParams._brandDescription as string) ||
                (searchParams._categoryDescription as string) ||
                `Showing ${products.length} crafted items ${isPending ? '(Updating...)' : ''}`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden px-4 py-2.5 bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
            >
              <span>⚙️</span> Filters {hasActiveFilters && '•'}
            </button>

            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-400 font-medium hidden sm:inline">Sort By:</label>
              <select
                value={activeSort}
                onChange={(e) => updateUrlFilters({ sort: e.target.value })}
                className="bg-[#181a1c] text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-700 outline-none cursor-pointer focus:border-amber-400"
              >
                <option value="featured">Featured Picks</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
                <option value="name">Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow">
        
        {/* Active Filter Chips Row */}
        {hasActiveFilters && (
          <div className="mb-6 p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 mr-2">Active Filters:</span>
            
            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                Search: "{searchQuery}"
                <button onClick={() => updateUrlFilters({ q: undefined, search: undefined })} className="hover:text-rose-600 font-black">×</button>
              </span>
            )}

            {activeCategory && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                Category: {activeCategory}
                <button onClick={() => handleCategorySelect(activeCategory)} className="hover:text-rose-600 font-black">×</button>
              </span>
            )}

            {activeBrand && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                Brand: {activeBrand}
                <button onClick={() => handleBrandSelect(activeBrand)} className="hover:text-rose-600 font-black">×</button>
              </span>
            )}

            {activeGender && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                Gender: {activeGender.toUpperCase()}
                <button onClick={() => handleGenderSelect(activeGender)} className="hover:text-rose-600 font-black">×</button>
              </span>
            )}

            {activeDiscount > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                {activeDiscount}%+ Off
                <button onClick={() => handleDiscountSelect(activeDiscount)} className="hover:text-rose-600 font-black">×</button>
              </span>
            )}

            {(searchParams.minPrice || searchParams.maxPrice) && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                Price: {currencySymbol}{searchParams.minPrice || '0'} - {currencySymbol}{searchParams.maxPrice || '∞'}
                <button onClick={() => { setMinPriceInput(''); setMaxPriceInput(''); updateUrlFilters({ minPrice: undefined, maxPrice: undefined }); }} className="hover:text-rose-600 font-black">×</button>
              </span>
            )}

            <button
              onClick={handleClearAll}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 underline ml-auto transition"
            >
              Clear All Filters
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6 sticky top-24">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-black text-sm uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <span>⚙️</span> Refine Selection
                </h3>
                {hasActiveFilters && (
                  <button onClick={handleClearAll} className="text-xs font-bold text-amber-600 hover:underline">
                    Reset
                  </button>
                )}
              </div>

              {/* 1. Gender Filter */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider mb-2.5 text-slate-700">Gender / Target</h4>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => updateUrlFilters({ gender: undefined })}
                    className={`py-1.5 px-3 rounded-xl text-xs font-bold transition text-center ${
                      !activeGender ? 'bg-amber-400 text-slate-950 shadow-sm' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    All
                  </button>
                  {genderOptions.map((g) => (
                    <button
                      key={g.value}
                      onClick={() => handleGenderSelect(g.value)}
                      className={`py-1.5 px-3 rounded-xl text-xs font-bold transition text-center ${
                        activeGender.toLowerCase() === g.value.toLowerCase()
                          ? 'bg-amber-400 text-slate-950 shadow-sm'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Categories / Departments Filter */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="font-bold text-xs uppercase tracking-wider mb-3 text-slate-700">Categories</h4>
                <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1 text-xs scrollbar-thin">
                  <button
                    onClick={() => updateUrlFilters({ category: undefined, categories: undefined })}
                    className={`w-full text-left py-1.5 px-3 rounded-xl font-medium transition flex items-center justify-between ${
                      !activeCategory ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>All Categories</span>
                  </button>
                  {availableCategories.map((cat) => {
                    const isSelected = activeCategory.toLowerCase() === (cat.slug || cat.name).toLowerCase();
                    return (
                      <button
                        key={cat.id || cat.slug || cat.name}
                        onClick={() => handleCategorySelect(cat.slug || cat.name)}
                        className={`w-full text-left py-1.5 px-3 rounded-xl font-medium transition flex items-center justify-between ${
                          isSelected ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span className="truncate">{cat.name}</span>
                        {cat.count > 0 && <span className="text-[10px] opacity-60">({cat.count})</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Brands Filter */}
              {availableBrands.length > 0 && (
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="font-bold text-xs uppercase tracking-wider mb-3 text-slate-700">Brands & Makers</h4>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 text-xs scrollbar-thin">
                    {availableBrands.map((b) => {
                      const isSelected = activeBrand.toLowerCase() === (b.slug || b.name).toLowerCase();
                      return (
                        <label
                          key={b.id || b.slug || b.name}
                          onClick={() => handleBrandSelect(b.slug || b.name)}
                          className="flex items-center gap-2.5 py-1.5 px-2 rounded-xl hover:bg-slate-50 cursor-pointer text-xs"
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
                          />
                          <span className="flex-1 text-slate-700 truncate">{b.name}</span>
                          {b.count > 0 && <span className="text-[10px] text-slate-400">({b.count})</span>}
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 4. Price Range Filter */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">Price Range</h4>
                <form onSubmit={handleApplyPriceFilter} className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-2.5 text-xs text-slate-400">{currencySymbol}</span>
                      <input
                        type="number"
                        placeholder="Min"
                        value={minPriceInput}
                        onChange={(e) => setMinPriceInput(e.target.value)}
                        className="w-full pl-7 pr-2 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-400"
                      />
                    </div>
                    <span className="text-slate-400 font-bold">-</span>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-2.5 text-xs text-slate-400">{currencySymbol}</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={maxPriceInput}
                        onChange={(e) => setMaxPriceInput(e.target.value)}
                        className="w-full pl-7 pr-2 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition"
                  >
                    Apply Price
                  </button>
                </form>
              </div>

              {/* 5. Discount Filter */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="font-bold text-xs uppercase tracking-wider mb-2.5 text-slate-700">Special Discounts</h4>
                <div className="space-y-1.5 text-xs">
                  {discountOptions.map((d) => (
                    <button
                      key={d.value}
                      onClick={() => handleDiscountSelect(d.value)}
                      className={`w-full text-left py-1.5 px-3 rounded-xl font-medium transition flex items-center justify-between ${
                        activeDiscount === d.value
                          ? 'bg-amber-400 text-slate-950 font-bold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>🏷️ {d.label}</span>
                      {d.count > 0 && <span className="text-[10px] opacity-60">({d.count})</span>}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </aside>

          {/* Products Grid Section */}
          <div className="lg:col-span-9">
            {products.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm">
                <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
                  🔍
                </div>
                <h3 className="text-xl font-bold text-slate-950 mb-2">No products found</h3>
                <p className="text-xs text-slate-500 mb-6 max-w-sm mx-auto">
                  No items matched your current filter criteria. Try clearing some filters or search terms.
                </p>
                <button
                  onClick={handleClearAll}
                  className="px-6 py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow transition active:scale-95"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <MincomProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Mobile Bottom Filter Drawer Sheet */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-base uppercase tracking-wider text-slate-900">Filters</h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-700"
              >
                ✕
              </button>
            </div>

            {/* Gender */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider mb-2 text-slate-700">Gender</h4>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => updateUrlFilters({ gender: undefined })}
                  className={`py-2 px-3 rounded-xl text-xs font-bold ${!activeGender ? 'bg-amber-400 text-slate-950' : 'bg-slate-100'}`}
                >
                  All
                </button>
                {genderOptions.map((g) => (
                  <button
                    key={g.value}
                    onClick={() => handleGenderSelect(g.value)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold ${activeGender.toLowerCase() === g.value.toLowerCase() ? 'bg-amber-400 text-slate-950' : 'bg-slate-100'}`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider mb-2 text-slate-700">Categories</h4>
              <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto">
                {availableCategories.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => handleCategorySelect(c.slug || c.name)}
                    className={`py-2 px-2.5 text-left rounded-xl text-xs font-bold truncate ${
                      activeCategory.toLowerCase() === (c.slug || c.name).toLowerCase() ? 'bg-amber-400 text-slate-950' : 'bg-slate-100'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Discount */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider mb-2 text-slate-700">Discounts</h4>
              <div className="grid grid-cols-2 gap-1.5">
                {discountOptions.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => handleDiscountSelect(d.value)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold ${activeDiscount === d.value ? 'bg-amber-400 text-slate-950' : 'bg-slate-100'}`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={handleClearAll}
                className="flex-1 py-3 bg-slate-100 font-bold text-xs uppercase rounded-xl"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1 py-3 bg-amber-400 font-black text-slate-950 text-xs uppercase rounded-xl shadow"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}

      <MincomFooter />
    </div>
  );
}
