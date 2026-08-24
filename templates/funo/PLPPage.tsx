'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import FunoHeader from './Header';
import FunoFooter from './Footer';
import FunoProductCard from './ProductCard';
import type { PLPPageProps } from '@/templates';

export default function FunoPLPPage({
  theme,
  products,
  categories,
  brands,
  filterFacets,
  searchParams,
}: PLPPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    (searchParams.category as string) || 'all'
  );
  const [selectedSort, setSelectedSort] = useState<string>(
    (searchParams.sort as string) || 'default'
  );

  const activeSearch = (searchParams.search || searchParams.q) as string | undefined;

  // Filter products locally if category selected
  const displayProducts = products.filter((p) => {
    if (selectedCategory !== 'all') {
      const matchCat =
        p.category?.toLowerCase() === selectedCategory.toLowerCase() ||
        p.categoryName?.toLowerCase() === selectedCategory.toLowerCase();
      if (!matchCat) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfdfd] text-slate-900">
      <FunoHeader />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        
        {/* Breadcrumb & Header */}
        <div className="space-y-3 pb-6 border-b border-slate-100">
          <nav className="flex items-center gap-2 text-xs text-slate-400">
            <Link href="/" className="hover:text-slate-900 transition">Home</Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Catalog</span>
            {activeSearch && (
              <>
                <span>/</span>
                <span className="text-orange-600 font-bold">Search: "{activeSearch}"</span>
              </>
            )}
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 font-heading">
                {activeSearch ? `Search Results for "${activeSearch}"` : 'All Studio Furniture & Objects'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Showing {displayProducts.length} curated design pieces
              </p>
            </div>

            {/* Sort Control */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500">Sort by:</span>
              <select
                value={selectedSort}
                onChange={(e) => {
                  setSelectedSort(e.target.value);
                  const url = new URL(window.location.href);
                  url.searchParams.set('sort', e.target.value);
                  window.location.href = url.toString();
                }}
                className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 shadow-2xs focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="default">Featured & Trending</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">Newest Drops</option>
                <option value="discount">Special Discounts</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content Layout with Filter Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar */}
          <aside className="lg:col-span-3 space-y-6 bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs">
            
            {/* Category Filter */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100">
                Categories
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                    selectedCategory === 'all'
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
                    onClick={() => setSelectedCategory(cat.slug || cat.name)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                      selectedCategory.toLowerCase() === (cat.slug || cat.name).toLowerCase()
                        ? 'bg-black text-white'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Price Filter */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Price Filter
              </h3>
              <div className="space-y-1.5 text-xs font-medium text-slate-600">
                {[
                  { label: 'Under $100', href: '/products?maxPrice=100' },
                  { label: '$100 to $300', href: '/products?minPrice=100&maxPrice=300' },
                  { label: '$300 to $600', href: '/products?minPrice=300&maxPrice=600' },
                  { label: 'Above $600', href: '/products?minPrice=600' },
                ].map((tier, idx) => (
                  <Link
                    key={idx}
                    href={tier.href}
                    className="block px-3 py-1.5 rounded-lg hover:bg-slate-50 hover:text-orange-600 transition"
                  >
                    {tier.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* In-Stock Only */}
            <div className="pt-4 border-t border-slate-100">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 select-none">
                <input type="checkbox" defaultChecked className="rounded text-orange-500 focus:ring-orange-400" />
                <span>In-Stock Items Only</span>
              </label>
            </div>

          </aside>

          {/* Product Grid */}
          <div className="lg:col-span-9 space-y-8">
            {displayProducts.length === 0 ? (
              <div className="p-16 text-center bg-white rounded-3xl border border-slate-100 space-y-4">
                <div className="text-4xl">🛋️</div>
                <h3 className="text-lg font-bold text-slate-900">No matching products found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try adjusting your category filter or search terms to discover other studio pieces.
                </p>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="px-6 py-2.5 rounded-xl bg-black text-white text-xs font-bold hover:bg-orange-500 transition"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayProducts.map((prod) => (
                  <FunoProductCard key={prod.id} product={prod} />
                ))}
              </div>
            )}
          </div>

        </div>

      </main>

      <FunoFooter />
    </div>
  );
}
