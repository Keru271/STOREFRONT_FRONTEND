'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import DemoHeader from './Header';
import DemoFooter from './Footer';
import DemoProductCard from './ProductCard';
import type { HomePageProps } from '@/templates';
import type { Product } from '@/lib/api/types';
import { useCurrency } from '@/hooks/useCurrency';
import { useCart } from '@/context/CartContext';

const CATEGORY_TILES = [
  {
    name: 'Living Room',
    desc: 'Sofas, Lounges & Coffee Tables',
    query: 'living-room',
    image:
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Bedroom Suites',
    desc: 'Minimalist Bed Frames & Nightstands',
    query: 'bedroom',
    image:
      'https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Dining & Kitchen',
    desc: 'Solid Oak Tables & Dining Chairs',
    query: 'dining',
    image:
      'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Designer Lighting',
    desc: 'Pendants, Lamps & Ambient Fixtures',
    query: 'lighting',
    image:
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=600&q=80',
  },
];

const REVIEWS = [
  {
    name: 'Astrid Lindholm',
    location: 'Stockholm, SE',
    rating: 5,
    title: 'Exquisite oak craftsmanship',
    comment:
      'The Nordic lounge chair exceeded all our expectations. Solid wood joints, impeccably finished and delivered with white-glove care.',
    productName: 'Oslo Lounge Armchair',
  },
  {
    name: 'Marcus Vance',
    location: 'Copenhagen, DK',
    rating: 5,
    title: 'Transformative dining table',
    comment:
      'The grain of the European oak is stunning. It anchors our open dining space with quiet warmth and understated elegance.',
    productName: 'Småland Dining Table',
  },
  {
    name: 'Elena Rostova',
    location: 'Berlin, DE',
    rating: 5,
    title: 'Impeccable ceramic and lighting quality',
    comment:
      'The pendant fixture creates an ethereal ambient glow. Exceptional attention to detail in packaging and installation.',
    productName: 'Kyoto Pendant Luminaire',
  },
];

export default function DemoHomePage({
  theme,
  products,
  collections,
  categories,
}: HomePageProps) {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'new' | 'featured' | 'deals'>('all');
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  const [dealAdding, setDealAdding] = useState(false);
  const [dealAdded, setDealAdded] = useState(false);

  // Countdown timer state for Deal of the Day
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 48 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredProducts = products.filter((p) => {
    if (selectedFilter === 'new') return true;
    if (selectedFilter === 'featured')
      return Boolean((p as any).rating && (p as any).rating >= 4.5);
    if (selectedFilter === 'deals')
      return Boolean(p.compareAtPrice && p.compareAtPrice > p.price);
    return true;
  });

  const featuredDealProduct = products[0] || {
    id: 'demo-deal-1',
    name: 'Mid-Century Nordic Ergonomic Lounge Chair in Oat Bouclé',
    price: 249.0,
    compareAtPrice: 349.0,
    categoryName: 'Living Room',
    stockQuantity: 12,
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
    ],
    image:
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
  };

  const handleAddDeal = async () => {
    if (dealAdding) return;
    setDealAdding(true);
    try {
      await addToCart({ productId: featuredDealProduct.id, quantity: 1 });
      setDealAdded(true);
      setTimeout(() => setDealAdded(false), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setDealAdding(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-white text-slate-900"
      style={{ fontFamily: "'Jost', sans-serif" }}
    >
      <DemoHeader />

      <main className="flex-1">
        {/* ── 1. Hero Showcase Banner ──────────────────────────────────── */}
        <section className="relative overflow-hidden bg-[#f4f2ee] min-h-[580px] sm:min-h-[660px] flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-6 space-y-6 z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white border border-[#e0ded8] shadow-xs text-xs font-semibold text-slate-800">
                <span className="w-2 h-2 rounded-full bg-[#ff9638] animate-pulse" />
                <span>Spring 2026 Collection Drop</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-slate-950 tracking-tight leading-[1.1]">
                Furniture for Mindful, Calm Living.
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg font-normal">
                Thoughtfully engineered silhouettes crafted from solid European oak, natural bouclé,
                and artisanal ceramics.
              </p>

              {/* Action Buttons matching design.md button recipes */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/products"
                  className="px-8 py-3.5 rounded-lg bg-black hover:bg-[#ff9638] text-white font-medium text-sm transition-all shadow-md active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  <span>Explore Catalog</span>
                  <span>→</span>
                </Link>
                <Link
                  href="/collections"
                  className="px-7 py-3.5 rounded-lg bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-200 font-medium text-sm transition shadow-xs cursor-pointer"
                >
                  View Lookbook
                </Link>
              </div>

              {/* Mini Stats Bar */}
              <div className="pt-8 border-t border-slate-200/80 grid grid-cols-3 gap-6">
                <div>
                  <div className="text-2xl font-bold text-slate-900">100%</div>
                  <div className="text-[11px] text-slate-500 font-medium">Solid FSC Oak</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">5-Year</div>
                  <div className="text-[11px] text-slate-500 font-medium">Frame Warranty</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">Free</div>
                  <div className="text-[11px] text-slate-500 font-medium">White Glove Shipping</div>
                </div>
              </div>
            </div>

            {/* Right Hero Image */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3] bg-slate-200">
                <img
                  src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80"
                  alt="Funie Interior Living"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Product Badge */}
              <div className="absolute -bottom-6 -left-6 sm:bottom-6 sm:-left-8 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-xl border border-slate-100 hidden sm:flex items-center gap-4 max-w-xs">
                <div className="w-12 h-12 rounded-lg bg-[#f7f7f7] p-1 overflow-hidden shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=200&q=80"
                    alt="Featured chair"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase text-[#ff9638]">
                    Editor's Pick
                  </div>
                  <div className="text-xs font-semibold text-slate-900 truncate">
                    Oslo Lounge Armchair
                  </div>
                  <div className="text-xs font-bold text-slate-900">$480.00</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. Trust & Guarantee Strip ────────────────────────────────── */}
        <section className="w-full bg-white border-b border-slate-100 py-8 px-4">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-slate-800">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-lg bg-orange-50 text-[#ff9638] flex items-center justify-center text-xl flex-shrink-0">
                🚚
              </div>
              <div>
                <h4 className="font-semibold text-xs text-slate-900">White Glove Delivery</h4>
                <p className="text-[11px] text-slate-500">Free placement & assembly</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-lg bg-emerald-50 text-[#108474] flex items-center justify-center text-xl flex-shrink-0">
                🌿
              </div>
              <div>
                <h4 className="font-semibold text-xs text-slate-900">Sustainable Oak</h4>
                <p className="text-[11px] text-slate-500">100% FSC European timber</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-lg bg-orange-50 text-[#ff9638] flex items-center justify-center text-xl flex-shrink-0">
                🛡️
              </div>
              <div>
                <h4 className="font-semibold text-xs text-slate-900">5-Year Warranty</h4>
                <p className="text-[11px] text-slate-500">Craftsmanship guaranteed</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-lg bg-emerald-50 text-[#108474] flex items-center justify-center text-xl flex-shrink-0">
                🔄
              </div>
              <div>
                <h4 className="font-semibold text-xs text-slate-900">30-Day In-Home Trial</h4>
                <p className="text-[11px] text-slate-500">Hassle-free return pickup</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. Category Tiles Showcase ───────────────────────────────── */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-12">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#ff9638]">
              Curated Spaces
            </span>
            <h2 className="text-3xl sm:text-4xl font-medium text-slate-950">
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
                className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-slate-900 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-end p-6"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="relative z-10 space-y-1 text-white">
                  <h3 className="text-lg font-bold leading-tight">{cat.name}</h3>
                  <p className="text-[11px] text-slate-300 line-clamp-1">{cat.desc}</p>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#ff9638] pt-2 group-hover:translate-x-1 transition-transform">
                    <span>Explore Collection</span>
                    <span>→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── 4. Featured & Trending Products ──────────────────────────── */}
        <section className="py-16 bg-[#fafafa] border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            {/* Header & Filter Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#ff9638]">
                  Featured Catalog
                </span>
                <h2 className="text-3xl font-medium text-slate-950">
                  Trending Furniture Pieces
                </h2>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-2 bg-white p-1.5 rounded-lg border border-slate-200/80 shadow-xs">
                {[
                  { id: 'all', label: 'All Items' },
                  { id: 'new', label: '✨ New Arrivals' },
                  { id: 'featured', label: '🔥 Top Rated' },
                  { id: 'deals', label: '⚡ Sale Deals' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSelectedFilter(tab.id as any)}
                    className={`px-4 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      selectedFilter === tab.id
                        ? 'bg-black text-white shadow-xs'
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
                <DemoProductCard key={prod.id} product={prod} />
              ))}
            </div>

            {/* View Full Catalog CTA */}
            <div className="text-center pt-6">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-white hover:bg-black hover:text-white border border-slate-200 text-slate-900 font-medium text-xs uppercase tracking-wider shadow-xs transition-all"
              >
                <span>View All Products ({products.length})</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ── 5. Deal of the Day Countdown Spotlight ───────────────────── */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#f8f7f5] rounded-2xl border border-[#ece9e2] p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Deal Info */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#ff9638] text-white font-bold text-xs uppercase tracking-wider">
                ⚡ Limited Flash Drop
              </div>

              <h2 className="text-3xl sm:text-4xl font-medium text-slate-950 leading-snug">
                {featuredDealProduct.name}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Sculpted from sustainably sourced Scandinavian timber with plush textural upholstery.
                Engineered for lifetime ergonomics.
              </p>

              {/* Price & Discount */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-slate-950">
                  {formatPrice(featuredDealProduct.price)}
                </span>
                {featuredDealProduct.compareAtPrice && (
                  <span className="text-lg text-slate-400 line-through">
                    {formatPrice(featuredDealProduct.compareAtPrice)}
                  </span>
                )}
                <span className="px-2.5 py-1 rounded-md bg-rose-100 text-rose-700 font-bold text-xs">
                  Save{' '}
                  {Math.round(
                    (((featuredDealProduct.compareAtPrice || 349) - featuredDealProduct.price) /
                      (featuredDealProduct.compareAtPrice || 349)) *
                      100,
                  )}
                  %
                </span>
              </div>

              {/* Countdown Clocks */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Offer Expires In:
                </span>
                <div className="flex items-center gap-3">
                  {[
                    { label: 'Hours', value: timeLeft.hours },
                    { label: 'Mins', value: timeLeft.minutes },
                    { label: 'Secs', value: timeLeft.seconds },
                  ].map((unit, idx) => (
                    <div
                      key={idx}
                      className="bg-white px-4 py-2.5 rounded-lg border border-slate-200 text-center min-w-[64px] shadow-xs"
                    >
                      <div className="text-xl font-bold text-slate-900 font-mono">
                        {String(unit.value).padStart(2, '0')}
                      </div>
                      <div className="text-[9px] font-bold uppercase text-slate-400">
                        {unit.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add To Cart CTA */}
              <div className="pt-2 flex items-center gap-4">
                <button
                  onClick={handleAddDeal}
                  disabled={dealAdding}
                  className="px-8 py-3.5 rounded-lg bg-black hover:bg-[#ff9638] text-white font-medium text-sm transition-all shadow-md active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  <span>{dealAdded ? 'Added to Cart! ✓' : dealAdding ? 'Adding...' : 'Claim Deal & Add to Cart'}</span>
                  <span>🛍️</span>
                </button>
                <Link
                  href={`/products/${featuredDealProduct.id}`}
                  className="text-xs font-semibold text-slate-700 hover:text-[#ff9638] underline"
                >
                  View Details
                </Link>
              </div>
            </div>

            {/* Right Deal Image */}
            <div className="lg:col-span-6 relative aspect-square rounded-2xl overflow-hidden bg-white p-6 shadow-sm border border-slate-100 flex items-center justify-center">
              <img
                src={
                  featuredDealProduct.image ||
                  (featuredDealProduct.images && featuredDealProduct.images[0]) ||
                  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80'
                }
                alt={featuredDealProduct.name}
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </section>

        {/* ── 6. Split Lookbook Promotional Banner ─────────────────────── */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-[#1c1c1c] text-white overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-6 p-8 sm:p-14 space-y-6">
              <span className="px-3 py-1 rounded-md bg-[#ff9638] text-white font-bold text-[10px] uppercase tracking-wider inline-block">
                Artisan Collaboration
              </span>
              <h2 className="text-3xl sm:text-4xl font-medium leading-tight">
                Crafted by Master Joiners in Småland, Sweden.
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Every dining surface and armchair is shaped by hand using traditional mortise-and-tenon
                joinery and low-VOC natural beeswax finishes.
              </p>
              <div className="pt-2">
                <Link
                  href="/pages/about"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-white text-slate-900 hover:bg-[#ff9638] hover:text-white font-medium text-xs uppercase tracking-wider transition shadow-md"
                >
                  <span>Read Our Craft Journal</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 h-full min-h-[380px] relative">
              <img
                src="https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80"
                alt="Woodworking workshop"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* ── 7. Judgeme / Customer Reviews Section ─────────────────────── */}
        <section className="py-20 bg-[#fafafa] border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs text-[#108474] font-bold">
                <span>★★★★★</span>
                <span>4.9 / 5.0 Rating from 1,200+ Verified Buyers</span>
              </div>
              <h2 className="text-3xl font-medium text-slate-950">
                Loved in Nordic Homes Worldwide
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {REVIEWS.map((rev, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-[#108474] font-bold tracking-widest">
                        {'★'.repeat(rev.rating)}
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-[#108474]">
                        ✓ Verified Buyer
                      </span>
                    </div>
                    <h4 className="font-semibold text-sm text-slate-900">{rev.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed italic">
                      "{rev.comment}"
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{rev.name}</div>
                      <div className="text-[10px] text-slate-400">{rev.location}</div>
                    </div>
                    <span className="text-[11px] text-[#ff9638] font-medium truncate max-w-[120px]">
                      {rev.productName}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 8. Design Journal / Blog Grid ─────────────────────────────── */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#ff9638]">
                From The Studio
              </span>
              <h2 className="text-3xl font-medium text-slate-950">Design Stories & Insights</h2>
            </div>
            <Link
              href="/pages/about"
              className="text-xs font-bold text-slate-900 hover:text-[#ff9638] underline"
            >
              Explore All Journal Articles →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'The Principles of Calm Nordic Living in Modern Apartments',
                date: 'April 2026',
                author: 'Sven Larson',
                image:
                  'https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=600&q=80',
              },
              {
                title: 'Solid European Oak vs. Engineered Veneer: A Master Joiner’s Guide',
                date: 'March 2026',
                author: 'Freja Møller',
                image:
                  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
              },
              {
                title: 'Sculptural Lighting: Setting Mood and Warmth for Open Floorplans',
                date: 'March 2026',
                author: 'Karin Nilsson',
                image:
                  'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=600&q=80',
              },
            ].map((story, idx) => (
              <div key={idx} className="group space-y-4">
                <div className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 relative">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {story.date} • By {story.author}
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 group-hover:text-[#ff9638] transition leading-snug">
                    {story.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <DemoFooter />
    </div>
  );
}
