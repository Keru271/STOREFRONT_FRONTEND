'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import FurnitureHeader from './Header';
import FurnitureFooter from './Footer';
import FurnitureProductCard from './ProductCard';
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

export default function FurniturePLPPage({
  theme,
  categories = [],
  brands = [],
  products = [],
  filterFacets,
  searchParams,
}: PLPPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const currentParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const { formatPrice } = useCurrency();

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Active filter state from searchParams
  const activeCategory =
    (searchParams.category as string) || (searchParams.categories as string) || '';
  const activeBrand = (searchParams.brand as string) || (searchParams.brands as string) || '';
  const activeSort = (searchParams.sort as string) || 'featured';
  const searchQuery = (searchParams.q as string) || (searchParams.search as string) || '';

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

  // Local filter fallback
  const displayProducts = products.filter((p) => {
    if (activeCategory && activeCategory !== 'all') {
      const matchCat =
        p.category?.toLowerCase() === activeCategory.toLowerCase() ||
        p.categoryName?.toLowerCase() === activeCategory.toLowerCase();
      if (!matchCat) return false;
    }
    if (activeBrand && activeBrand !== 'all') {
      const matchBrand = (p.brandName || '').toLowerCase() === activeBrand.toLowerCase();
      if (!matchBrand) return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        (p.name || '').toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q) ||
        (p.categoryName || '').toLowerCase().includes(q);
      if (!matchSearch) return false;
    }
    return true;
  });

  const totalCount = displayProducts.length;

  return (
    <div
      className="min-h-screen flex flex-col bg-[#faf9f6] text-[#1a1c1a]"
      style={{ fontFamily: 'var(--font-plus-jakarta, sans-serif)' }}
    >
      <FurnitureHeader />

      <main className="flex-1 w-full pt-28 pb-20">
        {/* Editorial Collection Header Banner */}
        <section className="bg-[#f4f3f1] border-b border-[#e3e2e0] py-12 px-4 sm:px-8">
          <div className="max-w-[1440px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <nav className="flex items-center gap-2 text-xs text-[#747878] uppercase tracking-wider mb-3">
                  <Link href="/" className="hover:text-[#040505]">
                    Home
                  </Link>
                  <span>/</span>
                  <span className="text-[#040505] font-semibold">
                    {activeCategory ? activeCategory : 'Archive Collection'}
                  </span>
                </nav>
                <h1
                  className="text-3xl sm:text-4xl text-[#040505] tracking-tight"
                  style={{ fontFamily: 'var(--font-playfair, serif)' }}
                >
                  {activeCategory
                    ? `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}`
                    : searchQuery
                      ? `Search: “${searchQuery}”`
                      : 'Artisanal Objects & Furnishings'}
                </h1>
              </div>
              <p className="text-[13px] text-[#444748] max-w-sm">
                Quiet geometry, enduring joinery, and natural organic materials from independent
                workshops.
              </p>
            </div>
          </div>
        </section>

        {/* Catalog Container */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-8">
          {/* Controls Bar */}
          <div className="flex items-center justify-between pb-6 mb-8 border-b border-[#e3e2e0]">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-lg bg-[#ffffff] border border-[#e3e2e0] text-xs font-semibold text-[#040505]"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filters
              </button>
              <span className="text-xs text-[#747878]">
                Showing <strong className="text-[#040505]">{totalCount}</strong> crafted pieces
              </span>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <label htmlFor="sort-select" className="text-xs text-[#747878] hidden sm:inline">
                Sort by:
              </label>
              <select
                id="sort-select"
                value={activeSort}
                onChange={(e) => updateUrlFilters({ sort: e.target.value })}
                className="bg-[#ffffff] border border-[#e3e2e0] text-xs rounded-lg px-3 py-2 text-[#040505] focus:outline-none focus:border-[#466557]"
              >
                <option value="featured">Featured Archetypes</option>
                <option value="newest">New Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Desktop Filters Sidebar */}
            <aside className="hidden lg:block lg:col-span-3 space-y-8 pr-4">
              {/* Categories */}
              <div>
                <h3 className="text-xs font-bold text-[#040505] uppercase tracking-wider mb-4">
                  Domain Categories
                </h3>
                <ul className="space-y-2 text-xs">
                  <li>
                    <button
                      onClick={() => handleCategorySelect('')}
                      className={`w-full text-left py-1 transition-colors flex items-center justify-between ${
                        !activeCategory ? 'font-bold text-[#466557]' : 'text-[#444748] hover:text-[#040505]'
                      }`}
                    >
                      <span>All Objects</span>
                      {!activeCategory && <Check className="w-3.5 h-3.5 text-[#466557]" />}
                    </button>
                  </li>
                  {(categories.length > 0
                    ? categories
                    : [
                        { id: '1', name: 'Ceramics & Tableware', slug: 'ceramics' },
                        { id: '2', name: 'Architectural Lighting', slug: 'lighting' },
                        { id: '3', name: 'Natural Fragrance', slug: 'wellness' },
                        { id: '4', name: 'Organic Lounge Linens', slug: 'furniture' },
                      ]
                  ).map((cat) => {
                    const isSelected =
                      activeCategory.toLowerCase() === (cat.slug || cat.name).toLowerCase();
                    return (
                      <li key={cat.id}>
                        <button
                          onClick={() => handleCategorySelect(cat.slug || cat.name)}
                          className={`w-full text-left py-1 transition-colors flex items-center justify-between ${
                            isSelected
                              ? 'font-bold text-[#466557]'
                              : 'text-[#444748] hover:text-[#040505]'
                          }`}
                        >
                          <span>{cat.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#466557]" />}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Price Filter */}
              <div className="pt-6 border-t border-[#e3e2e0]">
                <h3 className="text-xs font-bold text-[#040505] uppercase tracking-wider mb-4">
                  Investment Range
                </h3>
                <form onSubmit={handleApplyPriceFilter} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPriceInput}
                      onChange={(e) => setMinPriceInput(e.target.value)}
                      className="w-full bg-[#ffffff] border border-[#e3e2e0] rounded-lg px-2.5 py-1.5 text-xs text-[#040505] focus:outline-none focus:border-[#466557]"
                    />
                    <span className="text-xs text-[#747878]">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPriceInput}
                      onChange={(e) => setMaxPriceInput(e.target.value)}
                      className="w-full bg-[#ffffff] border border-[#e3e2e0] rounded-lg px-2.5 py-1.5 text-xs text-[#040505] focus:outline-none focus:border-[#466557]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-1.5 bg-[#040505] text-white rounded-lg text-xs font-medium hover:bg-[#466557] transition-colors"
                  >
                    Apply Filter
                  </button>
                </form>
              </div>

              {/* Reset */}
              {(activeCategory || activeBrand || minPriceInput || maxPriceInput) && (
                <div className="pt-4 border-t border-[#e3e2e0]">
                  <button
                    onClick={handleClearAll}
                    className="w-full py-2 text-xs font-semibold text-[#ba1a1a] hover:bg-[#ffdad6]/20 rounded-lg transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </aside>

            {/* Product Grid Area */}
            <div className="lg:col-span-9">
              {displayProducts.length === 0 ? (
                <div className="p-12 text-center bg-[#ffffff] rounded-2xl border border-[#e3e2e0] my-8">
                  <p
                    className="text-xl text-[#040505] mb-2"
                    style={{ fontFamily: 'var(--font-playfair, serif)' }}
                  >
                    No objects found
                  </p>
                  <p className="text-xs text-[#444748] mb-6">
                    Try refining your category selections or adjusting your search query.
                  </p>
                  <button
                    onClick={handleClearAll}
                    className="px-6 py-2.5 bg-[#040505] text-white rounded-lg text-xs font-medium hover:bg-[#466557] transition-colors"
                  >
                    View All Archetypes
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayProducts.map((p) => (
                    <FurnitureProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <FurnitureFooter />
    </div>
  );
}
