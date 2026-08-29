'use client';

import { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import LuxeHeader from './Header';
import LuxeFooter from './Footer';
import LuxeProductCard from './ProductCard';
import type { PLPPageProps } from '@/templates';
import { useCurrency } from '@/hooks/useCurrency';

export default function LuxePLPPage({ products, categories, brands, filterFacets, searchParams }: PLPPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const currentParams = useSearchParams();
  const { symbol: currencySymbol } = useCurrency();

  const activeCategory = (searchParams.category as string) || (searchParams.categories as string) || '';
  const activeBrand = (searchParams.brand as string) || (searchParams.brands as string) || '';
  const activeGender = (searchParams.gender as string) || '';
  const activeDiscount = searchParams.discount ? Number(searchParams.discount) : (searchParams.minDiscount ? Number(searchParams.minDiscount) : 0);
  const activeSort = (searchParams.sort as string) || 'newest';

  const [priceMin, setPriceMin] = useState(searchParams.minPrice?.toString() || '');
  const [priceMax, setPriceMax] = useState(searchParams.maxPrice?.toString() || '');

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
    setPriceMin('');
    setPriceMax('');
    router.push(pathname);
  };

  const hasFilters = Boolean(activeCategory || activeBrand || activeGender || activeDiscount > 0 || searchParams.minPrice || searchParams.maxPrice);

  const availableCategories = filterFacets?.categories?.length
    ? filterFacets.categories
    : categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug, count: 0 }));

  const availableBrands = filterFacets?.brands?.length
    ? filterFacets.brands
    : brands.map((b) => ({ id: b.id, name: b.name, slug: b.slug, count: 0 }));

  const genderOptions = filterFacets?.genders || [
    { label: 'Men', value: 'men' },
    { label: 'Women', value: 'women' },
    { label: 'Unisex', value: 'unisex' },
    { label: 'Kids', value: 'kids' },
  ];

  const discountOptions = filterFacets?.discounts || [
    { label: '10%+', value: 10 },
    { label: '20%+', value: 20 },
    { label: '30%+', value: 30 },
    { label: '50%+', value: 50 },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--sf-bg)' }}>
      <LuxeHeader />
      <main className="flex-1">
        {/* Page Header */}
        <div
          className="py-16 px-6 text-center border-b"
          style={{ borderColor: 'color-mix(in srgb, var(--sf-text) 8%, transparent)' }}
        >
          <span className="text-xs tracking-[0.3em] uppercase block mb-3" style={{ color: 'var(--sf-primary)' }}>
            The Edit
          </span>
          <h1 className="text-5xl font-light" style={{ color: 'var(--sf-text)' }}>
            {activeBrand ? (
              <span className="capitalize">{(searchParams._brandName as string) || activeBrand}</span>
            ) : activeCategory ? (
              <span className="capitalize">{(searchParams._categoryName as string) || activeCategory}</span>
            ) : (
              'All Products'
            )}
          </h1>
          <p className="mt-3 text-sm font-light max-w-xl mx-auto" style={{ color: 'color-mix(in srgb, var(--sf-text) 40%, transparent)' }}>
            {(searchParams._brandDescription as string) ||
             (searchParams._categoryDescription as string) ||
             `${products.length} curated pieces`}
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          {/* Filters Top Bar */}
          <div
            className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 py-6 mb-8 border-b"
            style={{ borderColor: 'color-mix(in srgb, var(--sf-text) 8%, transparent)' }}
          >
            {/* Category / Gender pills */}
            <div className="flex flex-wrap items-center gap-6 text-xs tracking-[0.15em] uppercase font-light">
              <div className="flex gap-3 items-center">
                <span style={{ color: 'color-mix(in srgb, var(--sf-text) 30%, transparent)' }}>Gender:</span>
                <button
                  onClick={() => updateParams({ gender: undefined })}
                  style={{ color: !activeGender ? 'var(--sf-primary)' : 'var(--sf-text)', textDecoration: !activeGender ? 'underline' : 'none' }}
                >
                  All
                </button>
                {genderOptions.map((g) => (
                  <button
                    key={g.value}
                    onClick={() => updateParams({ gender: activeGender.toLowerCase() === g.value.toLowerCase() ? undefined : g.value })}
                    style={{ color: activeGender.toLowerCase() === g.value.toLowerCase() ? 'var(--sf-primary)' : 'var(--sf-text)', textDecoration: activeGender.toLowerCase() === g.value.toLowerCase() ? 'underline' : 'none' }}
                  >
                    {g.label}
                  </button>
                ))}
              </div>

              <div className="flex gap-3 items-center">
                <span style={{ color: 'color-mix(in srgb, var(--sf-text) 30%, transparent)' }}>Category:</span>
                <button
                  onClick={() => updateParams({ category: undefined, categories: undefined })}
                  style={{ color: !activeCategory ? 'var(--sf-primary)' : 'var(--sf-text)', textDecoration: !activeCategory ? 'underline' : 'none' }}
                >
                  All
                </button>
                {availableCategories.slice(0, 5).map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => updateParams({ category: activeCategory.toLowerCase() === (cat.slug || cat.name).toLowerCase() ? undefined : (cat.slug || cat.name) })}
                    style={{
                      color: activeCategory.toLowerCase() === (cat.slug || cat.name).toLowerCase() ? 'var(--sf-primary)' : 'var(--sf-text)',
                      textDecoration: activeCategory.toLowerCase() === (cat.slug || cat.name).toLowerCase() ? 'underline' : 'none'
                    }}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <select
              value={activeSort}
              onChange={(e) => updateParams({ sort: e.target.value })}
              className="text-xs tracking-[0.15em] uppercase bg-transparent border-none outline-none cursor-pointer font-light"
              style={{ color: 'var(--sf-text)' }}
            >
              <option value="newest">Newest</option>
              <option value="popular">Best Selling</option>
              <option value="price_asc">Price ↑</option>
              <option value="price_desc">Price ↓</option>
            </select>
          </div>

          {/* Brands & Discount filters */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-4 border-b" style={{ borderColor: 'color-mix(in srgb, var(--sf-text) 6%, transparent)' }}>
            {availableBrands.length > 0 && (
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-[11px] tracking-[0.15em] uppercase font-light mr-1" style={{ color: 'color-mix(in srgb, var(--sf-text) 30%, transparent)' }}>
                  Brand:
                </span>
                {availableBrands.map((brand) => (
                  <button
                    key={brand.name}
                    onClick={() => updateParams({ brand: activeBrand === (brand.slug || brand.name) ? undefined : (brand.slug || brand.name) })}
                    className="px-3 py-1 text-[11px] tracking-[0.1em] uppercase font-light border transition-all"
                    style={{
                      color: activeBrand === (brand.slug || brand.name) ? 'white' : 'color-mix(in srgb, var(--sf-text) 60%, transparent)',
                      backgroundColor: activeBrand === (brand.slug || brand.name) ? 'var(--sf-primary)' : 'transparent',
                      borderColor: activeBrand === (brand.slug || brand.name) ? 'var(--sf-primary)' : 'color-mix(in srgb, var(--sf-text) 15%, transparent)',
                    }}
                  >
                    {brand.name}
                  </button>
                ))}
              </div>
            )}

            {/* Discounts */}
            <div className="flex gap-2 items-center text-xs tracking-wider">
              <span style={{ color: 'color-mix(in srgb, var(--sf-text) 30%, transparent)' }}>Offer:</span>
              {discountOptions.map((d) => (
                <button
                  key={d.value}
                  onClick={() => updateParams({ discount: activeDiscount === d.value ? undefined : d.value })}
                  className="px-2.5 py-1 text-[11px] font-light border"
                  style={{
                    backgroundColor: activeDiscount === d.value ? 'var(--sf-primary)' : 'transparent',
                    color: activeDiscount === d.value ? 'white' : 'var(--sf-text)',
                    borderColor: 'color-mix(in srgb, var(--sf-text) 15%, transparent)',
                  }}
                >
                  {d.label}
                </button>
              ))}
              {hasFilters && (
                <button onClick={clearFilters} className="text-xs tracking-widest uppercase ml-4 underline text-rose-500 font-light">
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Product Grid */}
          {products.length === 0 ? (
            <div className="py-32 text-center">
              <p className="text-lg font-light" style={{ color: 'color-mix(in srgb, var(--sf-text) 30%, transparent)' }}>
                No pieces found for this selection
              </p>
              <button
                onClick={clearFilters}
                className="mt-4 text-xs tracking-[0.2em] uppercase font-light transition-opacity hover:opacity-60"
                style={{ color: 'var(--sf-primary)' }}
              >
                Clear Filters →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-14 pb-20">
              {products.map((p) => (
                <LuxeProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </main>
      <LuxeFooter />
    </div>
  );
}
