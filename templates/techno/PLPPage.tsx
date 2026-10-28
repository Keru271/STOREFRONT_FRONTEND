'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import TechnoHeader from './Header';
import TechnoFooter from './Footer';
import TechnoProductCard from './ProductCard';
import type { PLPPageProps } from '@/templates';
import { useCurrency } from '@/hooks/useCurrency';
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  Sparkles,
  ArrowRight,
  Filter,
  Check,
} from 'lucide-react';

export default function TechnoPLPPage({
  theme,
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
  const activeCategory =
    (searchParams.category as string) || (searchParams.categories as string) || '';
  const activeBrand = (searchParams.brand as string) || (searchParams.brands as string) || '';
  const activeSort = (searchParams.sort as string) || 'featured';
  const searchQuery = (searchParams.q as string) || (searchParams.search as string) || '';
  const activeMinPrice = searchParams.minPrice ? Number(searchParams.minPrice) : undefined;
  const activeMaxPrice = searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined;

  const [minPriceInput, setMinPriceInput] = useState<string>(
    searchParams.minPrice?.toString() || '',
  );
  const [maxPriceInput, setMaxPriceInput] = useState<string>(
    searchParams.maxPrice?.toString() || '',
  );

  const updateUrlFilters = (updates: Record<string, string | number | undefined | null>) => {
    const params = new URLSearchParams(currentParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '' && value !== 'all') {
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

  // Local filter for responsive instantaneous feedback if products is pre-fetched
  const displayProducts = products.filter((p) => {
    if (activeCategory && activeCategory !== 'all') {
      const matchCat =
        p.category?.toLowerCase() === activeCategory.toLowerCase() ||
        p.categoryName?.toLowerCase() === activeCategory.toLowerCase();
      if (!matchCat) return false;
    }
    if (activeBrand && activeBrand !== 'all') {
      const matchBrand =
        p.brand?.toLowerCase() === activeBrand.toLowerCase() ||
        p.brandName?.toLowerCase() === activeBrand.toLowerCase();
      if (!matchBrand) return false;
    }
    if (activeMinPrice !== undefined && Number(p.price) < activeMinPrice) return false;
    if (activeMaxPrice !== undefined && Number(p.price) > activeMaxPrice) return false;
    return true;
  });

  const hasActiveFilters = Boolean(
    activeCategory || activeBrand || activeMinPrice || activeMaxPrice || searchQuery,
  );

  return (
    <div
      className="min-h-screen flex flex-col bg-[#FFFBF5] text-[#1C1917] antialiased"
      style={{ fontFamily: "'Open Sans', sans-serif" }}
    >
      <TechnoHeader />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-[12px] text-[#A8A29E]">
          <Link href="/" className="hover:text-[#C2410C] transition">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#C2410C] transition">
            Catalog
          </Link>
          {activeCategory && (
            <>
              <span>/</span>
              <span className="text-[#C2410C] font-semibold capitalize">{activeCategory}</span>
            </>
          )}
          {activeBrand && (
            <>
              <span>/</span>
              <span className="text-[#C2410C] font-semibold capitalize">{activeBrand}</span>
            </>
          )}
          {searchQuery && (
            <>
              <span>/</span>
              <span className="text-[#1C1917] font-semibold">"{searchQuery}"</span>
            </>
          )}
        </nav>

        {/* Page Header Banner */}
        <div className="pb-6 border-b border-[#E7E5E4] flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.09em] text-[#365314] block mb-1">
              INDEPENDENT ATELIERS & STUDIOS
            </span>
            <h1
              className="text-3xl sm:text-4xl font-semibold text-[#1C1917]"
              style={{ fontFamily: "'Lora', serif" }}
            >
              {searchQuery
                ? `Results for "${searchQuery}"`
                : activeCategory
                  ? `Handcrafted ${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}`
                  : activeBrand
                    ? `${activeBrand} Studio Collection`
                    : 'All Curated Handmade Goods'}
            </h1>
            <p className="text-[14px] text-[#57534E] mt-1.5">
              Showing {displayProducts.length} authentic pieces created by verified independent
              artisans.
            </p>
          </div>

          {/* Sort Controls & Mobile Filter Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden h-[42px] px-4 rounded-[4px] border border-[#D6D3D1] bg-white text-[#1C1917] hover:bg-[#FDF6EC] text-[13px] font-semibold flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#C2410C]" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-[#C2410C]" />
              )}
            </button>

            <div className="flex items-center gap-2">
              <label className="text-[12px] font-semibold text-[#57534E] hidden sm:block">
                Sort:
              </label>
              <select
                value={activeSort}
                onChange={(e) => updateUrlFilters({ sort: e.target.value })}
                className="h-[42px] px-3 rounded-[4px] border border-[#D6D3D1] bg-white text-[13px] font-medium text-[#1C1917] focus:border-[#C2410C] outline-none"
              >
                <option value="featured">Featured Works</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest Additions</option>
              </select>
            </div>
          </div>
        </div>

        {/* Layout: Sidebar Filters + Main Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* ── Desktop Filters Sidebar ───────────────────────────────────── */}
          <aside className="hidden lg:block space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E5E4]">
              <span className="text-[13px] font-bold uppercase tracking-wider text-[#1C1917] flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#C2410C]" />
                Filter by Craft
              </span>
              {hasActiveFilters && (
                <button
                  onClick={handleClearAll}
                  className="text-[12px] text-[#C2410C] hover:underline font-semibold"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Categories */}
            <div className="space-y-3">
              <h4 className="text-[13px] font-semibold text-[#1C1917]">Craft Discipline</h4>
              <div className="space-y-1.5">
                {[
                  { slug: '', label: 'All Works' },
                  { slug: 'ceramics', label: 'Ceramics & Stoneware' },
                  { slug: 'textiles', label: 'Woven Textiles & Linen' },
                  { slug: 'woodwork', label: 'Carved Woodcraft' },
                  { slug: 'jewelry', label: 'Fine Studio Jewelry' },
                  { slug: 'home', label: 'Apothecary & Candles' },
                ].map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => handleCategorySelect(cat.slug)}
                    className={`w-full text-left px-3 py-2 rounded-[4px] text-[13px] transition-colors flex items-center justify-between ${
                      (activeCategory || '') === cat.slug
                        ? 'bg-[#C2410C] text-white font-semibold'
                        : 'text-[#57534E] hover:bg-[#FDF6EC] hover:text-[#C2410C]'
                    }`}
                  >
                    <span>{cat.label}</span>
                    {(activeCategory || '') === cat.slug && (
                      <Check className="w-3.5 h-3.5" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter Box */}
            <div className="pt-4 border-t border-[#E7E5E4] space-y-3">
              <h4 className="text-[13px] font-semibold text-[#1C1917]">Price Range</h4>
              <form onSubmit={handleApplyPriceFilter} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-[#A8A29E] block mb-1">Min ({currencySymbol})</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={minPriceInput}
                      onChange={(e) => setMinPriceInput(e.target.value)}
                      className="w-full h-[38px] px-3 text-[13px] bg-white border border-[#D6D3D1] rounded-[4px] focus:border-[#C2410C] outline-none"
                      style={{ fontFamily: "'Source Code Pro', monospace" }}
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#A8A29E] block mb-1">Max ({currencySymbol})</label>
                    <input
                      type="number"
                      placeholder="1000"
                      value={maxPriceInput}
                      onChange={(e) => setMaxPriceInput(e.target.value)}
                      className="w-full h-[38px] px-3 text-[13px] bg-white border border-[#D6D3D1] rounded-[4px] focus:border-[#C2410C] outline-none"
                      style={{ fontFamily: "'Source Code Pro', monospace" }}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full h-[36px] rounded-[4px] bg-white border border-[#D6D3D1] hover:border-[#C2410C] text-[#C2410C] text-[12px] font-semibold transition-colors"
                >
                  Apply Price
                </button>
              </form>
            </div>

            {/* Artisan Values Box */}
            <div className="p-4 rounded-[6px] bg-[#FAF6F0] border border-[#E7E5E4] space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#365314] block">
                The Artisan Guarantee
              </span>
              <p className="text-[12px] text-[#57534E] leading-relaxed">
                Every purchase directly finances independent ateliers. 30-day trial with free
                artisan exchange guarantee.
              </p>
            </div>
          </aside>

          {/* ── Main Products Grid ────────────────────────────────────────── */}
          <div className="lg:col-span-3 space-y-6">
            {displayProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {displayProducts.map((p) => (
                  <TechnoProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center rounded-[8px] bg-white border border-[#E7E5E4] space-y-4">
                <div className="w-12 h-12 rounded-[4px] bg-[#FAF6F0] border border-[#D6D3D1] flex items-center justify-center text-[#C2410C] mx-auto text-xl">
                  🏺
                </div>
                <h3
                  className="text-2xl font-semibold text-[#1C1917]"
                  style={{ fontFamily: "'Lora', serif" }}
                >
                  No artisan pieces found
                </h3>
                <p className="text-[14px] text-[#57534E] max-w-md mx-auto">
                  We couldn't find any handmade objects matching your selected filters. Try
                  resetting your criteria or exploring our curated categories.
                </p>
                <button
                  onClick={handleClearAll}
                  className="inline-flex items-center gap-2 h-[42px] px-6 rounded-[4px] bg-[#C2410C] hover:bg-[#9A3412] text-white text-[13px] font-semibold transition-colors"
                >
                  <span>Reset All Filters</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ── Mobile Filters Drawer ─────────────────────────────────────────── */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-[#1C1917]/50 backdrop-blur-xs"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="relative w-full max-w-xs bg-[#FFFBF5] h-full flex flex-col justify-between p-6 border-r border-[#E7E5E4] overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E7E5E4]">
                <h3
                  className="text-lg font-semibold text-[#1C1917]"
                  style={{ fontFamily: "'Lora', serif" }}
                >
                  Filter Works
                </h3>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1.5 rounded-[4px] border border-[#E7E5E4] text-[#1C1917]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Category Options */}
              <div className="space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#A8A29E]">
                  Discipline
                </p>
                {[
                  { slug: '', label: 'All Disciplines' },
                  { slug: 'ceramics', label: 'Ceramics & Stoneware' },
                  { slug: 'textiles', label: 'Woven Textiles' },
                  { slug: 'woodwork', label: 'Carved Woodcraft' },
                  { slug: 'jewelry', label: 'Fine Studio Jewelry' },
                  { slug: 'home', label: 'Botanical & Home' },
                ].map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => {
                      handleCategorySelect(cat.slug);
                      setMobileFiltersOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-[4px] text-[13px] ${
                      (activeCategory || '') === cat.slug
                        ? 'bg-[#C2410C] text-white font-semibold'
                        : 'text-[#1C1917] hover:bg-[#FDF6EC]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-[#E7E5E4]">
              <button
                onClick={() => {
                  handleClearAll();
                  setMobileFiltersOpen(false);
                }}
                className="w-full h-[40px] rounded-[4px] border border-[#D6D3D1] text-[13px] font-semibold text-[#57534E] hover:bg-[#FDF6EC]"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}

      <TechnoFooter />
    </div>
  );
}
