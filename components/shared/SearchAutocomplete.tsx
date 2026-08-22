'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getSearchSuggestions } from '@/lib/api/products';
import type { ProductSuggestion, SearchSuggestionsResponse } from '@/lib/api/types';
import { useCurrency } from '@/hooks/useCurrency';
import { useTheme } from '@/context/ThemeContext';

interface SearchAutocompleteProps {
  placeholder?: string;
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
  categories?: Array<{ name: string; slug?: string }>;
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
  showCategoryDropdown?: boolean;
}

export function SearchAutocomplete({
  placeholder = 'Search products, categories, brands...',
  selectedCategory = 'all',
  onCategoryChange,
  categories = [],
  className = '',
  inputClassName = '',
  buttonClassName = '',
  showCategoryDropdown = true,
}: SearchAutocompleteProps) {
  const router = useRouter();
  const { formatPrice } = useCurrency();
  const { theme } = useTheme();

  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<SearchSuggestionsResponse | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const template = (theme.activeTemplateSlug || 'mincom').toLowerCase();

  // Fetch suggestions
  const fetchSuggestions = useCallback(async (searchQuery: string, cat?: string) => {
    setIsLoading(true);
    try {
      const res = await getSearchSuggestions(searchQuery, cat, 6);
      setData(res);
    } catch (err) {
      console.error('Error loading search suggestions:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setSelectedIndex(-1);
    setIsOpen(true);

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      fetchSuggestions(val, selectedCategory);
    }, 200);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    if (!data) {
      fetchSuggestions(query, selectedCategory);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Form submit
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsOpen(false);

    if (selectedIndex >= 0 && data?.products[selectedIndex]) {
      const selectedProd = data.products[selectedIndex];
      router.push(`/products/${selectedProd.urlSlug || selectedProd.id}`);
      return;
    }

    if (query.trim()) {
      const catParam = selectedCategory && selectedCategory !== 'all' ? `&category=${encodeURIComponent(selectedCategory)}` : '';
      router.push(`/products?search=${encodeURIComponent(query.trim())}${catParam}`);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || !data?.products?.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < data.products.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : data.products.length - 1));
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const clearQuery = () => {
    setQuery('');
    setSelectedIndex(-1);
    fetchSuggestions('', selectedCategory);
  };

  const products = data?.products || [];
  const matchingCategories = data?.categories || [];
  const matchingBrands = data?.brands || [];
  const popularSearches = data?.popularSearches || [];

  return (
    <div ref={containerRef} className={`relative flex-1 ${className}`}>
      {/* Search Bar Input Form */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center bg-white rounded-full p-1 shadow-inner border border-transparent focus-within:border-amber-400 transition-colors w-full"
      >
        {/* Category Dropdown */}
        {showCategoryDropdown && (
          <select
            value={selectedCategory}
            onChange={(e) => {
              const cat = e.target.value;
              if (onCategoryChange) onCategoryChange(cat);
              fetchSuggestions(query, cat);
            }}
            className="bg-transparent text-slate-700 text-xs font-semibold px-3 sm:px-4 py-2 outline-none border-r border-slate-200 cursor-pointer max-w-[130px] sm:max-w-none truncate"
          >
            <option value="all">All Categories</option>
            {categories.length > 0
              ? categories.map((c) => (
                  <option key={c.slug || c.name} value={c.slug || c.name}>
                    {c.name}
                  </option>
                ))
              : (
                <>
                  <option value="living-room">Living Room</option>
                  <option value="bedroom">Bedroom</option>
                  <option value="dining">Dining & Kitchen</option>
                  <option value="office">Office & Study</option>
                  <option value="decor">Decor & Lamps</option>
                </>
              )}
          </select>
        )}

        {/* Input */}
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          className={`flex-1 px-3 sm:px-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 bg-transparent outline-none min-w-0 ${inputClassName}`}
        />

        {/* Clear query button */}
        {query && (
          <button
            type="button"
            onClick={clearQuery}
            className="text-slate-400 hover:text-slate-600 p-1 text-xs mr-1"
            title="Clear search"
          >
            ✕
          </button>
        )}

        {/* Search Submit Button */}
        <button
          type="submit"
          className={`bg-amber-400 hover:bg-amber-500 text-slate-950 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-bold text-xs flex items-center gap-1.5 transition-colors shadow flex-shrink-0 ${buttonClassName}`}
          aria-label="Search"
        >
          {isLoading ? (
            <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
          <span className="hidden sm:inline">Search</span>
        </button>
      </form>

      {/* ── Auto-Complete Suggestions Dropdown Menu ─────────────────────────── */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[100] text-xs divide-y divide-slate-100 max-h-[80vh] overflow-y-auto">
          
          {/* 1. Popular / Trending Suggestions (when query is empty) */}
          {!query && popularSearches.length > 0 && (
            <div className="p-4 bg-slate-50/70">
              <span className="font-bold text-[10px] uppercase tracking-wider text-slate-400 block mb-2">
                🔥 Popular Searches
              </span>
              <div className="flex flex-wrap gap-1.5">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      setQuery(term);
                      router.push(`/products?search=${encodeURIComponent(term)}`);
                      setIsOpen(false);
                    }}
                    className="px-3 py-1 bg-white hover:bg-amber-100 hover:text-amber-900 border border-slate-200 rounded-full text-xs font-medium text-slate-700 transition"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 2. Matching Categories & Brands Pills */}
          {(matchingCategories.length > 0 || matchingBrands.length > 0) && (
            <div className="p-3 bg-slate-50/50 flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Explore in:
              </span>
              {matchingCategories.map((c) => (
                <Link
                  key={c.id || c.slug}
                  href={`/products?category=${encodeURIComponent(c.slug || c.name)}`}
                  onClick={() => setIsOpen(false)}
                  className="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 font-semibold text-[11px] transition"
                >
                  📁 {c.name}
                </Link>
              ))}
              {matchingBrands.map((b) => (
                <Link
                  key={b.id || b.slug}
                  href={`/products?brand=${encodeURIComponent(b.slug || b.name)}`}
                  onClick={() => setIsOpen(false)}
                  className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-900 border border-blue-200 hover:bg-blue-100 font-semibold text-[11px] transition"
                >
                  🏷️ {b.name}
                </Link>
              ))}
            </div>
          )}

          {/* 3. Matching Product Suggestions */}
          <div className="p-2 space-y-1">
            <span className="font-bold text-[10px] uppercase tracking-wider text-slate-400 px-3 py-1.5 block">
              {query ? `Products matching "${query}" (${products.length})` : 'Recommended Products'}
            </span>

            {products.length === 0 ? (
              <div className="py-6 px-4 text-center text-slate-500">
                <span className="text-2xl block mb-1">🔍</span>
                No direct products matched &quot;{query}&quot;
                <p className="text-[11px] text-slate-400 mt-1">Press Enter to search full catalog.</p>
              </div>
            ) : (
              products.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                const discount =
                  item.compareAtPrice && item.compareAtPrice > item.price
                    ? Math.round(((item.compareAtPrice - item.price) / item.compareAtPrice) * 100)
                    : null;

                return (
                  <Link
                    key={item.id}
                    href={`/products/${item.urlSlug || item.id}`}
                    onClick={() => setIsOpen(false)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center gap-3 p-2.5 rounded-xl transition ${
                      isSelected ? 'bg-amber-50/80 text-slate-950' : 'hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-100 relative">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs">🛍️</div>
                      )}
                    </div>

                    {/* Name & Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-slate-900 truncate block">
                          {item.name}
                        </span>
                        {discount && (
                          <span className="px-1.5 py-0.5 bg-rose-100 text-rose-700 font-bold text-[9px] rounded-md flex-shrink-0">
                            {discount}% OFF
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        {item.categoryName && <span>{item.categoryName}</span>}
                        {item.brandName && (
                          <>
                            <span>•</span>
                            <span>{item.brandName}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right flex-shrink-0">
                      <div className="font-black text-xs text-slate-950">
                        {formatPrice(item.price)}
                      </div>
                      {item.compareAtPrice && (
                        <div className="text-[10px] text-slate-400 line-through">
                          {formatPrice(item.compareAtPrice)}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })
            )}
          </div>

          {/* 4. Footer View All Link */}
          {query && (
            <div className="p-3 bg-slate-50 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Press <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono">↵ Enter</kbd> to search
              </span>
              <button
                type="button"
                onClick={() => handleSubmit()}
                className="font-bold text-amber-600 hover:text-amber-700 hover:underline flex items-center gap-1"
              >
                View all results for &quot;{query}&quot; →
              </button>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
