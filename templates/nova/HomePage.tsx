'use client';

import Link from 'next/link';
import NovaHeader from './Header';
import NovaFooter from './Footer';
import NovaProductCard from './ProductCard';
import type { HomePageProps } from '@/templates';

export default function NovaHomePage({ theme, products, collections, categories }: HomePageProps) {
  const displayFeatured = products.slice(0, 4);
  const latestDrops = products.slice(0, 8);

  const heroProduct = products[0] || {
    id: 'hero-default',
    name: 'Nova Pro Max Wireless',
    description: 'Immersive spatial audio, custom acoustic architecture, and all-day battery life.',
    price: 399,
    urlSlug: 'nova-pro-max',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&auto=format&fit=crop&q=80'],
  };

  const heroSlug = heroProduct.urlSlug || heroProduct.id;

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f7] text-[#1d1d1f] font-sans antialiased selection:bg-[#0071e3] selection:text-white">
      <NovaHeader />

      <main className="flex-1">
        
        {/* ── 1. Flagship Apple-Style Full-Bleed Hero ─────────────────────── */}
        <section className="relative w-full bg-white pt-16 pb-20 px-4 sm:px-6 text-center border-b border-[#e2e2e5] overflow-hidden">
          <div className="max-w-[980px] mx-auto">
            
            <span className="inline-block text-[12px] font-semibold tracking-wider text-[#0071e3] uppercase mb-3">
              Special Presentation
            </span>

            <h1 className="text-4xl sm:text-6xl lg:text-[64px] font-semibold text-[#1d1d1f] tracking-tight leading-[1.05] mb-4">
              {heroProduct.name}
            </h1>

            <p className="text-lg sm:text-xl text-[#707070] font-normal max-w-[580px] mx-auto mb-8 leading-relaxed">
              {heroProduct.description || 'Engineered with precision. Unrivaled performance, unmatched clarity, and timeless industrial design.'}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
              <Link
                href={`/products/${heroSlug}`}
                className="px-6 py-2.5 rounded-[980px] bg-[#0071e3] text-white text-[15px] font-normal hover:bg-[#0077ed] active:scale-[0.98] transition-all shadow-sm"
              >
                Learn more
              </Link>
              <Link
                href={`/products/${heroSlug}`}
                className="px-6 py-2.5 rounded-[980px] border border-[#0066cc] text-[#0066cc] text-[15px] font-normal hover:bg-[#f4f8fb] transition-colors"
              >
                Buy &gt;
              </Link>
            </div>

            {/* Hero Image Showcase */}
            <div className="relative max-w-[720px] mx-auto aspect-[16/9] flex items-center justify-center">
              <img
                src={heroProduct.images?.[0] || heroProduct.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&auto=format&fit=crop&q=80'}
                alt={heroProduct.name}
                className="max-h-full max-w-full object-contain transform transition-transform duration-700 hover:scale-105"
              />
            </div>

          </div>
        </section>

        {/* ── 2. Category Quick Selector Pills ─────────────────────────────── */}
        <section className="w-full bg-[#f5f5f7] py-8 border-b border-[#e2e2e5]">
          <div className="max-w-[1024px] mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-start md:justify-center gap-3 overflow-x-auto pb-2 scrollbar-none">
              <Link
                href="/products"
                className="px-4 py-1.5 rounded-[980px] bg-white border border-[#d2d2d7] text-[13px] font-medium text-[#1d1d1f] hover:border-[#0071e3] hover:text-[#0071e3] transition-colors whitespace-nowrap"
              >
                All Categories
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${encodeURIComponent(cat.slug)}`}
                  className="px-4 py-1.5 rounded-[980px] bg-white border border-[#d2d2d7] text-[13px] font-medium text-[#1d1d1f] hover:border-[#0071e3] hover:text-[#0071e3] transition-colors whitespace-nowrap"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── 3. Bento-Style Promotional Grid ─────────────────────────────── */}
        <section className="w-full py-16 px-4 sm:px-6">
          <div className="max-w-[1024px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Bento Card 1: Studio Audio */}
              <div className="bg-white border border-[#e2e2e5] rounded-[8px] p-8 text-center flex flex-col justify-between min-h-[380px] hover:shadow-sm transition-shadow">
                <div>
                  <span className="text-[12px] font-semibold text-[#858585] uppercase tracking-wider block mb-1">Acoustic Engineering</span>
                  <h3 className="text-2xl font-semibold text-[#1d1d1f] mb-2">High-Fidelity Audio</h3>
                  <p className="text-[14px] text-[#707070] max-w-[320px] mx-auto mb-4">Precision-tuned drivers delivering rich bass and clean highs.</p>
                  <div className="flex items-center justify-center gap-4 text-[13px]">
                    <Link href="/products" className="text-[#0066cc] hover:underline">Learn more &gt;</Link>
                    <Link href="/products" className="text-[#0066cc] hover:underline">Buy &gt;</Link>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-center h-44">
                  <img
                    src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80"
                    alt="Audio Tech"
                    className="max-h-full object-contain"
                  />
                </div>
              </div>

              {/* Bento Card 2: Minimalist Wearables */}
              <div className="bg-[#1d1d1f] text-white rounded-[8px] p-8 text-center flex flex-col justify-between min-h-[380px] hover:shadow-md transition-shadow">
                <div>
                  <span className="text-[12px] font-semibold text-[#2997ff] uppercase tracking-wider block mb-1">Smart Performance</span>
                  <h3 className="text-2xl font-semibold text-white mb-2">Smart Living Essentials</h3>
                  <p className="text-[14px] text-[#858585] max-w-[320px] mx-auto mb-4">Always connected. All-day battery with fast wireless charging.</p>
                  <div className="flex items-center justify-center gap-4 text-[13px]">
                    <Link href="/products" className="text-[#2997ff] hover:underline">Learn more &gt;</Link>
                    <Link href="/products" className="text-[#2997ff] hover:underline">Buy &gt;</Link>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-center h-44">
                  <img
                    src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80"
                    alt="Smart Watch"
                    className="max-h-full object-contain"
                  />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── 4. Featured Product Catalog ──────────────────────────────────── */}
        <section className="w-full bg-white py-16 border-t border-b border-[#e2e2e5]">
          <div className="max-w-[1024px] mx-auto px-4 sm:px-6">
            
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-[12px] font-semibold text-[#0071e3] uppercase tracking-wider block">Curated Selection</span>
                <h2 className="text-2xl font-semibold text-[#1d1d1f] tracking-tight">Featured Releases</h2>
              </div>
              <Link href="/products" className="text-[13px] font-normal text-[#0066cc] hover:underline inline-flex items-center gap-1">
                Explore all &gt;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {displayFeatured.map((product) => (
                <NovaProductCard key={product.id} product={product} />
              ))}
            </div>

          </div>
        </section>

        {/* ── 5. Latest Drops Grid ────────────────────────────────────────── */}
        <section className="w-full py-16">
          <div className="max-w-[1024px] mx-auto px-4 sm:px-6">
            
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-[12px] font-semibold text-[#858585] uppercase tracking-wider block">Catalogue</span>
                <h2 className="text-2xl font-semibold text-[#1d1d1f] tracking-tight">Explore the Collection</h2>
              </div>
              <Link href="/products" className="text-[13px] font-normal text-[#0066cc] hover:underline inline-flex items-center gap-1">
                View catalog &gt;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {latestDrops.map((product) => (
                <NovaProductCard key={product.id} product={product} />
              ))}
            </div>

          </div>
        </section>

        {/* ── 6. Apple-Style Value Proposition Bar ────────────────────────── */}
        <section className="w-full bg-white border-t border-[#e2e2e5] py-12">
          <div className="max-w-[1024px] mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center text-[#0071e3] mb-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </div>
                <h4 className="text-[14px] font-semibold text-[#1d1d1f] mb-1">Fast, Free Delivery</h4>
                <p className="text-[12px] text-[#707070] max-w-[240px]">Enjoy complimentary shipping on all orders over $50 with live tracking.</p>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center text-[#0071e3] mb-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h4 className="text-[14px] font-semibold text-[#1d1d1f] mb-1">2-Year Warranty</h4>
                <p className="text-[12px] text-[#707070] max-w-[240px]">Every product is covered with comprehensive hardware warranty protection.</p>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center text-[#0071e3] mb-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h4 className="text-[14px] font-semibold text-[#1d1d1f] mb-1">14-Day Free Returns</h4>
                <p className="text-[12px] text-[#707070] max-w-[240px]">Hassle-free return policy if you change your mind for any reason.</p>
              </div>

            </div>
          </div>
        </section>

      </main>

      <NovaFooter />
    </div>
  );
}
