'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import FunoHeader from './Header';
import FunoFooter from './Footer';
import FunoProductCard from './ProductCard';
import type { HomePageProps } from '@/templates';

const CATEGORY_TILES = [
  { name: 'Living Room', desc: 'Sofas, Lounges & Coffee Tables', query: 'living-room', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80' },
  { name: 'Bedroom Suites', desc: 'Minimalist Bed Frames & Nightstands', query: 'bedroom', image: 'https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=600&q=80' },
  { name: 'Dining & Kitchen', desc: 'Solid Oak Tables & Dining Chairs', query: 'dining', image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=600&q=80' },
  { name: 'Designer Lighting', desc: 'Pendants, Lamps & Ambient Fixtures', query: 'lighting', image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=600&q=80' },
];

export default function FunoHomePage({ theme, products, collections, categories }: HomePageProps) {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'new' | 'featured'>('all');

  const filteredProducts = products.filter((p) => {
    if (selectedFilter === 'new') return true;
    if (selectedFilter === 'featured') return Boolean(p.compareAtPrice && p.compareAtPrice > p.price);
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans">
      <FunoHeader />

      <main className="flex-1">
        
        {/* ── 1. Hero Showcase Banner ──────────────────────────────────── */}
        <section className="relative overflow-hidden bg-[#f4f2ee] min-h-[580px] sm:min-h-[660px] flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-6 space-y-6 z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#e0ded8] shadow-xs text-xs font-bold text-slate-800">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                <span>Spring 2026 Collection Drop</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.1] font-heading">
                Furniture for Mindful, Calm Living.
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg">
                Thoughtfully engineered silhouettes crafted from solid European oak, natural bouclé, and artisanal ceramics.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/products"
                  className="px-8 py-4 rounded-xl bg-black hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-widest transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center gap-2"
                >
                  <span>Explore Catalog</span>
                  <span>→</span>
                </Link>
                <Link
                  href="/collections"
                  className="px-7 py-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 border border-slate-200 font-bold text-xs uppercase tracking-widest transition shadow-xs"
                >
                  View Lookbook
                </Link>
              </div>

              {/* Mini Stats Bar */}
              <div className="pt-8 border-t border-slate-200/80 grid grid-cols-3 gap-6">
                <div>
                  <div className="text-2xl font-black text-slate-900 font-heading">100%</div>
                  <div className="text-[11px] text-slate-500 font-medium">Solid FSC Oak</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900 font-heading">5-Year</div>
                  <div className="text-[11px] text-slate-500 font-medium">Frame Warranty</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900 font-heading">Free</div>
                  <div className="text-[11px] text-slate-500 font-medium">White Glove Shipping</div>
                </div>
              </div>
            </div>

            {/* Right Hero Image */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] bg-slate-200">
                <img
                  src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80"
                  alt="Funie Interior Living"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Product Badge */}
              <div className="absolute -bottom-6 -left-6 sm:bottom-6 sm:-left-8 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-100 hidden sm:flex items-center gap-4 max-w-xs">
                <div className="w-12 h-12 rounded-xl bg-[#f7f7f7] p-1 overflow-hidden shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=200&q=80"
                    alt="Featured chair"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase text-orange-500">Editor's Pick</div>
                  <div className="text-xs font-bold text-slate-900 truncate">Oslo Lounge Armchair</div>
                  <div className="text-xs font-black text-slate-900">$480.00</div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ── 2. Category Tiles Showcase ───────────────────────────────── */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-12">
            <span className="text-[11px] font-black uppercase tracking-widest text-orange-500">
              Curated Spaces
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 font-heading">
              Shop by Living Space
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Explore purpose-built furniture collections designed for harmonious flow.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORY_TILES.map((cat, idx) => (
              <Link
                key={idx}
                href={`/products?category=${cat.query}`}
                className="group relative rounded-3xl overflow-hidden aspect-[4/5] bg-slate-900 shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col justify-end p-6"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-108 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="relative z-10 space-y-1 text-white">
                  <h3 className="text-lg font-black font-heading leading-tight">{cat.name}</h3>
                  <p className="text-[11px] text-slate-300 line-clamp-1">{cat.desc}</p>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-400 pt-2 group-hover:translate-x-1 transition-transform">
                    <span>Explore Collection</span>
                    <span>→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── 3. Featured & Trending Products ──────────────────────────── */}
        <section className="py-16 bg-[#fafafa] border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            
            {/* Header & Filter Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <div className="space-y-1">
                <span className="text-[11px] font-black uppercase tracking-widest text-orange-500">
                  Featured Catalog
                </span>
                <h2 className="text-3xl font-extrabold text-slate-950 font-heading">
                  Trending Furniture Pieces
                </h2>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-xs">
                {[
                  { id: 'all', label: 'All Items' },
                  { id: 'new', label: '✨ New Arrivals' },
                  { id: 'featured', label: '🔥 Top Rated' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSelectedFilter(tab.id as any)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      selectedFilter === tab.id
                        ? 'bg-black text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.slice(0, 8).map((prod) => (
                <FunoProductCard key={prod.id} product={prod} />
              ))}
            </div>

            {/* View Full Catalog CTA */}
            <div className="text-center pt-6">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white hover:bg-black hover:text-white border border-slate-200 text-slate-900 font-bold text-xs uppercase tracking-widest shadow-sm transition-all"
              >
                <span>View All Products ({products.length})</span>
                <span>→</span>
              </Link>
            </div>

          </div>
        </section>

        {/* ── 4. Split Lookbook Promotional Banner ─────────────────────── */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-[#1c1c1c] text-white overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12 items-center">
            
            <div className="lg:col-span-6 p-8 sm:p-14 space-y-6">
              <span className="px-3 py-1 rounded-full bg-orange-500 text-white font-black text-[10px] uppercase tracking-wider inline-block">
                Artisan Collaboration
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-heading leading-tight">
                Crafted by Master Joiners in Småland, Sweden.
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Every dining surface and armchair is shaped by hand using traditional mortise-and-tenon joints, protected with organic beeswax, and inspected individually.
              </p>
              <div className="pt-2">
                <Link
                  href="/pages/about"
                  className="inline-block px-7 py-3.5 rounded-xl bg-white text-slate-950 hover:bg-orange-500 hover:text-white font-bold text-xs uppercase tracking-widest transition shadow"
                >
                  Read The Craft Story →
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 h-full min-h-[380px] relative">
              <img
                src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80"
                alt="Woodworking Craft"
                className="w-full h-full object-cover min-h-[380px]"
              />
            </div>

          </div>
        </section>

        {/* ── 5. Value Propositions ───────────────────────────────────── */}
        <section className="py-14 border-t border-slate-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: '🚚', title: 'White-Glove Shipping', desc: 'Room-of-choice placement and packaging removal included.' },
              { icon: '🌿', title: 'Certified Sustainable', desc: '100% FSC-certified timber and non-toxic plant-based finishes.' },
              { icon: '🛡️', title: '5-Year Frame Guarantee', desc: 'Engineered with solid joinery built to last generations.' },
              { icon: '↩️', title: '30-Day In-Home Trial', desc: 'Live with your pieces risk-free with straightforward returns.' },
            ].map((prop, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-3xl p-2 rounded-xl bg-white shadow-2xs shrink-0">{prop.icon}</span>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wide">{prop.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{prop.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      <FunoFooter />
    </div>
  );
}
