'use client';

// ─── Section Resolver ─────────────────────────────────────────────────────────
// Client component that maps a SectionConfig array to React components.
// Template-aware: sections adapt typography, colors, and layout tokens based on active template.
// Includes real-time postMessage listener for live Theme Studio previewing.

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import type { ThemeConfig, Product, Collection, Category } from '@/lib/api/types';
import type { SectionConfig } from '@/lib/sections/types';
import { StorefrontFormRenderer } from '@/components/shared/StorefrontFormRenderer';
import { getStorefrontForm } from '@/lib/api/forms';
import { useCurrency } from '@/hooks/useCurrency';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import {
  FileQuestion,
  Loader2,
  Heart,
  ShoppingBag,
  Star,
  Clock,
  ArrowRight,
  Shield,
  Truck,
  RotateCcw,
  CreditCard,
  Sparkles,
} from 'lucide-react';

// ── Section Component Props ───────────────────────────────────────────────────

interface SectionProps {
  theme: ThemeConfig;
  products: Product[];
  collections: Collection[];
  categories: Category[];
  templateSlug?: string | null;
}

// ── 1. Hero Section ───────────────────────────────────────────────────────────

function HeroSection({
  theme: _theme,
  config,
}: SectionProps & { config: Extract<SectionConfig, { type: 'hero' }>['config'] }) {
  const bgImage =
    config.backgroundImage ||
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1920&auto=format&fit=crop';

  return (
    <section
      className="relative w-full overflow-hidden min-h-[500px] lg:min-h-[580px] flex items-center"
      style={{
        backgroundColor: 'var(--sf-secondary)',
      }}
    >
      {/* Background lifestyle image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{ backgroundImage: `url('${bgImage}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/50 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="max-w-2xl space-y-6 text-white">
          {config.badge && (
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow text-white"
              style={{ backgroundColor: 'var(--sf-accent, var(--sf-primary))' }}
            >
              <span>{config.badge}</span>
            </div>
          )}

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] font-heading">
            {config.headline || 'Elevate Your Living Space'}
          </h1>

          {config.subheadline && (
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-light max-w-xl">
              {config.subheadline}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href={config.ctaHref || '/products'}
              className="px-8 py-4 text-white font-black text-xs uppercase tracking-wider shadow-xl transition transform hover:-translate-y-0.5 active:translate-y-0 inline-flex items-center gap-2"
              style={{
                backgroundColor: 'var(--sf-primary)',
                borderRadius: 'var(--sf-radius, 1rem)',
              }}
            >
              <span>{config.ctaLabel || 'Shop Now'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {config.secondaryCtaLabel && (
              <Link
                href={config.secondaryCtaHref || '/collections'}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white backdrop-blur border border-white/20 font-bold text-xs uppercase tracking-wider transition inline-flex items-center gap-2"
                style={{ borderRadius: 'var(--sf-radius, 1rem)' }}
              >
                <span>{config.secondaryCtaLabel}</span>
              </Link>
            )}
          </div>

          {/* Optional Stats */}
          {config.stats && config.stats.length > 0 && (
            <div className="pt-6 border-t border-white/10 flex flex-wrap gap-8 items-center">
              {config.stats.map((stat, i) => (
                <div key={i} className="text-left">
                  <div className="text-2xl font-black text-white">{stat.value}</div>
                  <div className="text-xs text-white/70 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ── 2. Trust Badges Section ───────────────────────────────────────────────────

function TrustBadgesSection({
  config,
  templateSlug,
}: SectionProps & { config: any }) {
  // If template is Pawzy or leftBadges/rightBadges are present, render the 3-column services wheel
  const isPawzyLayout =
    templateSlug === 'pawzy' ||
    (config.leftBadges && config.leftBadges.length > 0) ||
    (config.rightBadges && config.rightBadges.length > 0);

  if (isPawzyLayout) {
    const kicker = config.kicker || 'Our Services';
    const title = config.title || 'Care You Can Trust';
    const leftBadges = config.leftBadges && config.leftBadges.length > 0 ? config.leftBadges : [
      { icon: '🛁', title: 'Bathing & Grooming', desc: 'Plant-based herbal washes, coat styling, and gentle sanitation.' },
      { icon: '✂️', title: 'Haircut & Styling', desc: 'Professional breed-specific coat trimming and detangling styling.' },
      { icon: '🐕', title: 'Dog Walking', desc: 'Certified and bonded local walkers providing GPS-tracked exercise.' },
    ];
    const rightBadges = config.rightBadges && config.rightBadges.length > 0 ? config.rightBadges : [
      { icon: '🐾', title: 'Nail & Paw Care', desc: 'Gentle claw clipping, filing, and organic pad moisturizing balm.' },
      { icon: '🏠', title: 'Pet Hotel Stay', desc: 'Safe, climate-controlled play suites with 24/7 live webcams.' },
      { icon: '🩺', title: 'Health Checkup', desc: 'Personalized dietary consults and preventative health assessments.' },
    ];
    const centerImage =
      config.centerImage ||
      'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80';

    return (
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white dark:bg-transparent">
        <div className="text-center space-y-2 mb-14">
          {kicker && (
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
              {kicker}
            </span>
          )}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 dark:text-white tracking-tight font-heading">
            {title}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left 3 items */}
          <div className="lg:col-span-4 space-y-8">
            {leftBadges.map((badge: any, idx: number) => (
              <div key={idx} className="flex items-center gap-4 text-left">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-3xl shrink-0 shadow-xs">
                  {badge.icon || '🛁'}
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-base text-slate-950 dark:text-white">
                    {badge.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
                    {badge.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Center Column: Kitten and Puppy Duo in soft arched backdrop */}
          <div className="lg:col-span-4 flex justify-center relative">
            <div className="relative w-72 h-80 sm:w-80 sm:h-96 flex items-center justify-center">
              {/* Soft purple/lavender arch background */}
              <div className="absolute inset-0 bg-[#e8edff] dark:bg-indigo-950/40 rounded-t-[10rem] rounded-b-[4rem] pointer-events-none -z-10" />

              {/* Doodle floating bone on top right */}
              <div className="absolute top-6 right-2 text-2xl select-none pointer-events-none transform rotate-12">
                🦴✨
              </div>

              {/* Main cutout image */}
              <div className="relative w-full h-full flex items-end justify-center overflow-hidden rounded-t-[10rem] rounded-b-[4rem]">
                <img
                  src={centerImage}
                  alt="Care Services"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right 3 items */}
          <div className="lg:col-span-4 space-y-8">
            {rightBadges.map((badge: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between gap-4 text-left">
                <div className="space-y-1 flex-1">
                  <h4 className="font-extrabold text-base text-slate-950 dark:text-white">
                    {badge.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
                    {badge.desc}
                  </p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-3xl shrink-0 shadow-xs">
                  {badge.icon || '🐾'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const DEFAULT_BADGES = [
    { icon: '🚚', title: 'Free Home Delivery', desc: 'On all orders over $150' },
    { icon: '🛡️', title: '10-Year Warranty', desc: '100% solid quality guaranteed' },
    { icon: '🔄', title: '30-Day Easy Returns', desc: 'Hassle-free return policy' },
    { icon: '💳', title: 'Secure Payments', desc: 'Encrypted Razorpay & PayPal' },
  ];
  const badges = config.badges && config.badges.length > 0 ? config.badges : DEFAULT_BADGES;

  return (
    <section className="w-full bg-white dark:bg-card border-b border-slate-200 dark:border-slate-800 py-6 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-slate-800 dark:text-slate-200">
        {badges.map((badge: any, idx: number) => (
          <div key={idx} className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center text-xl shrink-0">
              {badge.icon || '✨'}
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-slate-900 dark:text-foreground">
                {badge.title}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{badge.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── 3. Room Grid / Category Showcase Section ───────────────────────────────────

function RoomGridSection({
  config,
}: SectionProps & { config: Extract<SectionConfig, { type: 'room-grid' }>['config'] }) {
  const defaultItems = [
    {
      title: 'Living Room',
      sub: 'Sofas, Lounges & Coffee Tables',
      count: '48 items',
      image:
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=600&auto=format&fit=crop',
      href: '/products?category=living-room',
    },
    {
      title: 'Bedroom Sets',
      sub: 'Platform Beds, Nightstands & Linens',
      count: '32 items',
      image:
        'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=600&auto=format&fit=crop',
      href: '/products?category=bedroom',
    },
    {
      title: 'Kitchen & Dining',
      sub: 'Solid Wood Dining Tables & Chairs',
      count: '24 items',
      image:
        'https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=600&auto=format&fit=crop',
      href: '/products?category=dining',
    },
    {
      title: 'Office & Decor',
      sub: 'Ergonomic Desks, Bookshelves & Lamps',
      count: '40 items',
      image:
        'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=600&auto=format&fit=crop',
      href: '/products?category=office',
    },
  ];

  const items = config.items && config.items.length > 0 ? config.items : defaultItems;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          {config.tagline && (
            <span className="text-xs font-black uppercase tracking-widest text-amber-600 block mb-1">
              {config.tagline}
            </span>
          )}
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-foreground tracking-tight">
            {config.title || 'Shop by Living Space'}
          </h2>
        </div>
        {config.viewAllHref && (
          <Link
            href={config.viewAllHref}
            className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-amber-600 underline inline-flex items-center gap-1"
          >
            {config.viewAllLabel || 'All Spaces →'}
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((room, i) => (
          <Link
            key={i}
            href={room.href || '/products'}
            className="group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 aspect-[4/5] flex flex-col justify-end p-6 border border-slate-100 dark:border-slate-800"
          >
            <img
              src={room.image}
              alt={room.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
            <div className="relative text-white space-y-1">
              {room.count && (
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                  {room.count}
                </span>
              )}
              <h3 className="text-lg font-black">{room.title}</h3>
              {room.sub && <p className="text-xs text-slate-300 line-clamp-1">{room.sub}</p>}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ── 4. Featured Products Section ──────────────────────────────────────────────

function FeaturedProductsSection({
  products,
  config,
}: SectionProps & { config: Extract<SectionConfig, { type: 'featured-products' }>['config'] }) {
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [activeFilter, setActiveFilter] = useState('all');

  const limit = config.limit || 8;
  let filtered = products;

  if (config.category) {
    const filterKey = config.category.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        (p.categoryName || p.category || '').toLowerCase().includes(filterKey) ||
        (p.name || '').toLowerCase().includes(filterKey),
    );
  }

  if (activeFilter !== 'all') {
    filtered = filtered.filter((p) =>
      (p.categoryName || p.category || '').toLowerCase().includes(activeFilter.toLowerCase()),
    );
  }

  const display = filtered.slice(0, limit);

  // Extract unique categories for filter tabs
  const categoriesList = Array.from(
    new Set(products.map((p) => p.categoryName || p.category).filter(Boolean)),
  ).slice(0, 5);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          {config.badge && (
            <span className="text-xs font-black uppercase tracking-widest text-amber-600 block mb-1">
              {config.badge}
            </span>
          )}
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-foreground tracking-tight">
            {config.title || 'Trending Pieces & Bestsellers'}
          </h2>
          {config.subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{config.subtitle}</p>
          )}
        </div>

        {categoriesList.length > 0 && !config.category && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition ${
                activeFilter === 'all'
                  ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              All Items
            </button>
            {categoriesList.map((cat) => (
              <button
                key={String(cat)}
                onClick={() => setActiveFilter(String(cat))}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition ${
                  activeFilter === String(cat)
                    ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {String(cat)}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {display.map((product) => {
          const img =
            (product.images && product.images[0]) ||
            product.image ||
            'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=600';
          const isWish = isInWishlist(product.id);

          return (
            <div
              key={product.id}
              className="group bg-white dark:bg-card border border-slate-200/80 dark:border-slate-800 rounded-3xl p-3 flex flex-col justify-between hover:shadow-xl transition-all duration-300 relative"
            >
              {/* Image & Wishlist Button */}
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 mb-3">
                <Link href={`/products/${product.urlSlug || product.id}`}>
                  <img
                    src={img}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  aria-label="Wishlist"
                  className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition shadow-sm ${
                    isWish
                      ? 'bg-rose-50 text-rose-600'
                      : 'bg-white/90 dark:bg-slate-900/90 text-slate-600 hover:text-rose-500'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWish ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Product Info */}
              <div className="space-y-1.5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-600">
                    {product.categoryName || product.category || 'Collection'}
                  </span>
                  <Link href={`/products/${product.urlSlug || product.id}`}>
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-foreground line-clamp-2 hover:text-amber-600 transition">
                      {product.name}
                    </h3>
                  </Link>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-black text-sm sm:text-base text-slate-950 dark:text-foreground">
                      {formatPrice(product.price)}
                    </span>
                    {product.compareAtPrice && product.compareAtPrice > product.price && (
                      <span className="text-[10px] text-slate-400 line-through">
                        {formatPrice(product.compareAtPrice)}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() =>
                      addToCart({
                        productId: product.id,
                        quantity: 1,
                      })
                    }
                    className="p-2.5 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-amber-600 dark:hover:bg-amber-500 transition shadow-sm"
                    title="Add to cart"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ── 5. Deal of the Day Countdown Section ──────────────────────────────────────

function DealCountdownSection({
  products,
  config,
}: SectionProps & { config: Extract<SectionConfig, { type: 'deal-countdown' }>['config'] }) {
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  const [timeLeft, setTimeLeft] = useState({
    hours: config.hoursLeft || 14,
    minutes: 32,
    seconds: 48,
  });

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

  const featured = products[0] || {
    id: 'deal-1',
    name: config.productName || 'Mid-Century Nordic Ergonomic Lounge Chair',
    price: Number(config.price) || 249.0,
    compareAtPrice: Number(config.compareAtPrice) || 349.0,
    image:
      config.image ||
      'https://images.unsplash.com/photo-1580481077194-4d22223a502f?q=80&w=800&auto=format&fit=crop',
  };

  const dealPrice = Number(config.price || featured.price);
  const comparePrice = Number(config.compareAtPrice || featured.compareAtPrice || dealPrice * 1.3);
  const discountPct =
    config.discountPercent || Math.round(((comparePrice - dealPrice) / comparePrice) * 100);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <div className="bg-slate-950 text-white rounded-3xl overflow-hidden p-8 sm:p-12 relative flex flex-col lg:flex-row items-center justify-between gap-10 shadow-2xl border border-slate-800">
        <div className="space-y-6 max-w-xl flex-1">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-black uppercase tracking-wider border border-amber-500/30">
            <Clock className="w-3.5 h-3.5" />
            <span>{config.badge || '⚡ LIMITED TIME PROMOTION'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            {config.title || 'Deal of the Day'}
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed font-light">
            {config.subtitle ||
              'Special promotional pricing on our flagship handcrafted furniture piece. Available strictly while current batch inventory lasts.'}
          </p>

          {/* Countdown Clock Boxes */}
          <div className="flex items-center gap-3 pt-2">
            {[
              { val: String(timeLeft.hours).padStart(2, '0'), label: 'HOURS' },
              { val: String(timeLeft.minutes).padStart(2, '0'), label: 'MINS' },
              { val: String(timeLeft.seconds).padStart(2, '0'), label: 'SECS' },
            ].map((unit, idx) => (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 px-4 py-3 rounded-2xl text-center min-w-[70px]"
              >
                <span className="text-2xl font-black text-amber-400 font-mono block">
                  {unit.val}
                </span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <div className="space-y-0.5">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white">{formatPrice(dealPrice)}</span>
                <span className="text-sm text-slate-400 line-through">
                  {formatPrice(comparePrice)}
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-rose-500 text-white text-xs font-black">
                  -{discountPct}%
                </span>
              </div>
              <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <span>✓</span> In stock & ready for immediate dispatch
              </p>
            </div>

            <button
              onClick={() =>
                addToCart({
                  productId: String(featured.id),
                  quantity: 1,
                })
              }
              className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl transition transform hover:-translate-y-0.5"
            >
              {config.ctaLabel || 'Claim Deal Now →'}
            </button>
          </div>
        </div>

        {/* Product Visual */}
        <div className="w-full lg:w-96 aspect-square rounded-2xl overflow-hidden shadow-2xl relative border border-slate-800 shrink-0">
          <img
            src={
              config.image ||
              featured.image ||
              'https://images.unsplash.com/photo-1580481077194-4d22223a502f?q=80&w=800'
            }
            alt={config.productName || 'Deal product'}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4 bg-rose-600 text-white font-black text-xs px-3 py-1.5 rounded-full shadow-lg">
            SAVE {discountPct}%
          </div>
        </div>
      </div>
    </section>
  );
}

// ── 6. Lookbook Section ───────────────────────────────────────────────────────

function LookbookSection({
  config,
}: SectionProps & { config: Extract<SectionConfig, { type: 'lookbook' }>['config'] }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
      <div className="rounded-3xl p-8 sm:p-14 bg-slate-900 text-white flex flex-col lg:flex-row items-center justify-between gap-10 shadow-2xl overflow-hidden relative border border-slate-800">
        <div className="space-y-4 max-w-xl flex-1">
          <span className="px-3.5 py-1 rounded-full bg-white/10 text-white text-xs font-black uppercase tracking-wider border border-white/20 inline-block">
            {config.badge || 'Artisan Spotlight'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            {config.lookbookTitle || 'Crafted by Master Joiners in Småland'}
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light">
            {config.lookbookDesc ||
              'Every dining surface and armchair is shaped by hand using traditional mortise-and-tenon joints, sustainably harvested FSC timber, and natural organic beeswax finishes.'}
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            {config.ctaLabel && (
              <Link
                href={config.ctaHref || '/products'}
                className="inline-block px-7 py-3.5 text-xs font-black uppercase tracking-wider text-slate-900 bg-white hover:bg-slate-100 transition rounded-xl shadow-lg"
              >
                {config.ctaLabel}
              </Link>
            )}
            {config.secondaryCtaLabel && (
              <Link
                href={config.secondaryCtaHref || '/collections'}
                className="inline-block px-7 py-3.5 text-xs font-black uppercase tracking-wider text-white bg-white/10 hover:bg-white/20 border border-white/20 transition rounded-xl"
              >
                {config.secondaryCtaLabel}
              </Link>
            )}
          </div>
        </div>

        {config.lookbookImage && (
          <div className="w-full lg:w-96 h-72 sm:h-96 rounded-2xl overflow-hidden shadow-2xl shrink-0 border border-white/10">
            <img
              src={config.lookbookImage}
              alt={config.lookbookTitle || 'Lookbook'}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        )}
      </div>
    </section>
  );
}

// ── 7. Product Matrix Section ─────────────────────────────────────────────────

function ProductMatrixSection({
  products,
  config,
}: SectionProps & { config: Extract<SectionConfig, { type: 'product-matrix' }>['config'] }) {
  const { formatPrice } = useCurrency();
  const limit = config.limit || 3;

  const topRated = products.slice(0, limit);
  const bestSelling = products.slice(limit, limit * 2);
  const onSale = products.slice(limit * 2, limit * 3);
  const featuredPicks = products.slice(limit * 3, limit * 4);

  const columns = [
    { title: 'Top Rated', items: topRated },
    { title: 'Best Selling', items: bestSelling },
    { title: 'On Sale Now', items: onSale },
    { title: 'Featured Picks', items: featuredPicks },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full border-t border-slate-100 dark:border-slate-800">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {columns.map((col, idx) => (
          <div key={idx} className="space-y-4">
            <h3 className="font-black text-sm uppercase tracking-wider text-slate-900 dark:text-foreground border-b border-slate-200 dark:border-slate-800 pb-3">
              {col.title}
            </h3>
            <div className="space-y-3">
              {col.items.map((prod) => {
                const img =
                  (prod.images && prod.images[0]) ||
                  prod.image ||
                  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=300';
                return (
                  <Link
                    key={prod.id}
                    href={`/products/${prod.urlSlug || prod.id}`}
                    className="flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900 transition group"
                  >
                    <img
                      src={img}
                      alt={prod.name}
                      className="w-16 h-16 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 shrink-0"
                    />
                    <div className="space-y-0.5 overflow-hidden">
                      <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 line-clamp-1 group-hover:text-amber-600 transition">
                        {prod.name}
                      </h4>
                      <div className="flex items-center gap-1 text-[10px] text-amber-500">
                        <Star className="w-3 h-3 fill-current" />
                        <span>4.9</span>
                      </div>
                      <span className="font-black text-xs text-slate-950 dark:text-foreground block">
                        {formatPrice(prod.price)}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── 8. Categories Section ─────────────────────────────────────────────────────

function BirdSvg({ className = "w-14 h-14" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M26 14c-3-2-7-1-10 1-2 2-3 5-3 8 0 3 2 4 4 3 3-1 4-4 4-7" />
      <path d="M20 18c3-3 8-5 13-3 6 2 9 8 9 15 0 8-5 18-12 24l-2 10h-3l2-9c-6 3-12 4-18 4" />
      <circle cx="21" cy="17" r="1.5" fill="currentColor" />
      <path d="M29 25c4 1 9 4 9 10 0 7-6 13-12 15" />
      <path d="M31 31c3 2 6 5 6 9" />
      <path d="M32 37c2 2 4 4 4 7" />
      <path d="M12 49h40" strokeWidth="2.5" />
      <path d="M26 49v3" />
      <path d="M29 49v3" />
    </svg>
  );
}

function CatSvg({ className = "w-14 h-14" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 27 L16 16 L27 21 C29 20 35 20 37 21 L48 16 L46 27 C50 31 51 37 49 43 C47 49 41 52 32 52 C23 52 17 49 15 43 C13 37 14 31 18 27 Z" />
      <path d="M20 23 L18 19 L25 22" />
      <path d="M44 23 L46 19 L39 22" />
      <circle cx="25" cy="33" r="2" fill="currentColor" />
      <circle cx="39" cy="33" r="2" fill="currentColor" />
      <path d="M30 38 L34 38 L32 41 Z" fill="currentColor" />
      <path d="M32 41 C30 44 26 44 25 42" />
      <path d="M32 41 C34 44 38 44 39 42" />
      <path d="M21 35 L12 34" />
      <path d="M21 39 L12 40" />
      <path d="M43 35 L52 34" />
      <path d="M43 39 L52 40" />
      <path d="M20 52 C20 49 23 47 26 47 C29 47 30 49 30 52" />
      <path d="M34 52 C34 49 35 47 38 47 C41 47 44 49 44 52" />
    </svg>
  );
}

function DogSvg({ className = "w-14 h-14" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M24 23 C24 17 29 14 34 14 C37 14 41 16 43 19 L48 20 C50 20 51 22 50 24 C49 26 47 27 44 27 L41 27 C40 31 38 34 34 35" />
      <circle cx="48.5" cy="22" r="1.5" fill="currentColor" />
      <circle cx="36" cy="20" r="1.5" fill="currentColor" />
      <path d="M31 16 C27 16 25 19 25 24 C25 29 27 32 30 32 C33 32 34 29 34 25" />
      <path d="M27 34 C30 35 34 35 37 34" strokeWidth="3" />
      <path d="M36 36 C38 40 39 46 39 52 C39 54 37 54 35 54 C34 54 33 53 33 50 L33 42 L29 50 C29 53 28 54 26 54 C24 54 23 53 23 51 C23 46 25 40 27 36" />
      <path d="M27 34 C24 37 20 40 18 45 C16 50 18 54 22 54 L30 54" />
      <path d="M17 46 C12 44 11 39 13 36 C14 34 16 35 16 37" />
    </svg>
  );
}

function RabbitSvg({ className = "w-14 h-14" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M32 24 C30 18 29 10 32 6 C34 3 37 5 36 12 L35 22" />
      <path d="M36 22 C37 16 39 8 42 7 C44 6 46 9 44 15 L40 25" />
      <path d="M32 24 C29 24 26 26 24 29 C22 32 23 35 26 36 L34 36" />
      <circle cx="28" cy="29" r="1.5" fill="currentColor" />
      <path d="M34 26 C38 28 42 32 43 38 C44 44 43 49 40 52 C37 54 32 54 27 54 C23 54 20 53 20 50 C20 47 24 45 28 45 L34 45" />
      <path d="M29 36 C28 40 26 44 24 48 C23 50 25 51 27 51" />
      <circle cx="44" cy="46" r="3.5" />
    </svg>
  );
}

function FishSvg({ className = "w-14 h-14" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M46 22 C38 25 30 23 20 28 C12 32 12 38 20 42 C30 47 38 45 46 48 L52 52 L50 35 L52 18 Z" />
      <circle cx="20" cy="33" r="2" fill="currentColor" />
      <path d="M14 34 C12 35 12 36 14 36" />
      <path d="M25 29 C27 33 27 37 25 41" />
      <path d="M32 25 C34 20 38 18 42 19" />
      <path d="M32 45 C34 50 38 52 42 51" />
      <path d="M33 32 C35 34 35 37 33 39" />
      <path d="M38 31 C40 33 40 37 38 39" />
    </svg>
  );
}

function HamsterSvg({ className = "w-14 h-14" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="22" cy="18" r="6" />
      <circle cx="42" cy="18" r="6" />
      <path d="M22 18 C22 16 24 15 25 17" />
      <path d="M42 18 C42 16 40 15 39 17" />
      <path d="M25 22 C27 21 37 21 39 22 C45 24 49 30 48 37 C47 45 43 53 32 53 C21 53 17 45 16 37 C15 30 19 24 25 22 Z" />
      <circle cx="25" cy="30" r="2.5" fill="currentColor" />
      <circle cx="39" cy="30" r="2.5" fill="currentColor" />
      <path d="M30 34 L34 34 L32 36 Z" fill="currentColor" />
      <path d="M32 36 C30 38 27 38 26 36" />
      <path d="M32 36 C34 38 37 38 38 36" />
      <path d="M20 33 L11 32" />
      <path d="M20 37 L12 39" />
      <path d="M44 33 L53 32" />
      <path d="M44 37 L52 39" />
      <path d="M26 44 C26 41 29 40 31 42 C31 45 28 46 26 44 Z" />
      <path d="M38 44 C38 41 35 40 33 42 C33 45 36 46 38 44 Z" />
    </svg>
  );
}

function CategoriesSection({
  categories,
  config,
  templateSlug,
}: SectionProps & { config: Extract<SectionConfig, { type: 'categories' }>['config'] }) {
  const isPawzy = templateSlug === 'pawzy';

  if (isPawzy) {
    const pawzyItems = [
      { name: 'Birds', query: 'birds', Icon: BirdSvg, blobShape: 'rounded-[50%_50%_40%_60%/60%_40%_60%_40%]' },
      { name: 'Cats', query: 'cats', Icon: CatSvg, blobShape: 'rounded-[60%_40%_50%_50%/50%_60%_40%_50%]' },
      { name: 'Dogs', query: 'dogs', Icon: DogSvg, blobShape: 'rounded-[40%_60%_60%_40%/50%_50%_60%_40%]' },
      { name: 'Rabbit', query: 'rabbit', Icon: RabbitSvg, blobShape: 'rounded-[50%_50%_40%_60%/40%_60%_50%_50%]' },
      { name: 'Fish', query: 'fish', Icon: FishSvg, blobShape: 'rounded-[60%_40%_50%_50%/50%_40%_60%_50%]' },
      { name: 'Hamster', query: 'hamster', Icon: HamsterSvg, blobShape: 'rounded-[40%_60%_50%_50%/60%_50%_40%_60%]' },
    ];

    return (
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-12">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 block">
            {config.subtitle || 'Pet Picks'}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {config.title || 'Everything Your Pet Needs'}
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8 items-center justify-items-center">
          {pawzyItems.map((cat) => {
            const IconComp = cat.Icon;
            return (
              <Link
                key={cat.name}
                href={`/products?category=${cat.query}`}
                className="group flex flex-col items-center justify-center text-center transition-all duration-300 transform hover:-translate-y-1.5 focus:outline-none"
              >
                <div
                  className={`w-28 h-24 sm:w-32 sm:h-28 md:w-36 md:h-32 bg-[#edf5fd] dark:bg-sky-950/40 flex items-center justify-center shadow-xs group-hover:bg-[#e0effe] dark:group-hover:bg-sky-900/50 group-hover:scale-105 transition-all duration-300 ${cat.blobShape}`}
                >
                  <IconComp className="w-14 h-14 sm:w-16 sm:h-16 stroke-slate-900 dark:stroke-slate-100 transition-transform duration-300 group-hover:scale-110" />
                </div>
                <span className="mt-4 font-bold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    );
  }

  const limit = config.limit || 6;
  const display = categories.slice(0, limit);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-foreground tracking-tight">
            {config.title || 'Explore Categories'}
          </h2>
          {config.subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{config.subtitle}</p>
          )}
        </div>
        <Link
          href="/categories"
          className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-amber-600 underline"
        >
          View All →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {display.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.slug}`}
            className="p-5 rounded-2xl bg-white dark:bg-card border border-slate-200/80 dark:border-slate-800 hover:border-amber-400 hover:shadow-md transition text-center space-y-2 group"
          >
            <div className="w-12 h-12 mx-auto rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              {cat.icon || '📦'}
            </div>
            <h3 className="font-extrabold text-xs text-slate-900 dark:text-foreground line-clamp-1">
              {cat.name}
            </h3>
            {(cat as any).productCount !== undefined && (
              <span className="text-[10px] text-slate-400 font-medium">
                {(cat as any).productCount} items
              </span>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}

// ── 9. Collections Section ────────────────────────────────────────────────────

function CollectionsSection({
  collections,
  config,
}: SectionProps & { config: Extract<SectionConfig, { type: 'collections' }>['config'] }) {
  const limit = config.limit || 3;
  const display = collections.slice(0, limit);

  if (display.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-foreground tracking-tight">
            {config.title || 'Featured Collections'}
          </h2>
          {config.subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{config.subtitle}</p>
          )}
        </div>
        <Link
          href="/collections"
          className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-amber-600 underline"
        >
          All Collections →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {display.map((col) => (
          <Link
            key={col.id}
            href={`/collections/${col.slug}`}
            className="group relative rounded-3xl overflow-hidden aspect-[4/3] flex flex-col justify-end p-6 shadow-md hover:shadow-xl transition"
          >
            <img
              src={
                col.image ||
                'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=600'
              }
              alt={col.name}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
            <div className="relative text-white space-y-1">
              <h3 className="text-lg font-black">{col.name}</h3>
              {col.description && (
                <p className="text-xs text-slate-300 line-clamp-1">{col.description}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ── 10. Promotional Banner Section ────────────────────────────────────────────

function BannerSection({
  config,
}: SectionProps & { config: Extract<SectionConfig, { type: 'banner' }>['config'] }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <div
        className="rounded-3xl p-8 sm:p-12 text-white flex flex-col sm:flex-row items-center justify-between gap-8 shadow-xl relative overflow-hidden"
        style={{
          background:
            config.variant === 'accent'
              ? 'linear-gradient(135deg, var(--sf-accent, #f59e0b) 0%, #b45309 100%)'
              : 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          backgroundImage: config.backgroundImage ? `url('${config.backgroundImage}')` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="space-y-2 max-w-xl">
          {config.badge && (
            <span className="px-3 py-1 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-wider inline-block">
              {config.badge}
            </span>
          )}
          <h2 className="text-2xl sm:text-3xl font-black">{config.title || 'Members Get More'}</h2>
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-light">
            {config.description ||
              'Join thousands of mindful shoppers and unlock early access, private sales, and free white-glove shipping.'}
          </p>
        </div>

        {config.ctaLabel && (
          <Link
            href={config.ctaHref || '/auth/signup'}
            className="px-8 py-4 bg-white text-slate-900 font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg hover:bg-slate-100 transition whitespace-nowrap"
          >
            {config.ctaLabel}
          </Link>
        )}
      </div>
    </section>
  );
}

// ── 11. Testimonials Section ──────────────────────────────────────────────────

function TestimonialsSection({
  config,
}: SectionProps & { config: Extract<SectionConfig, { type: 'testimonials' }>['config'] }) {
  const defaultTestimonials = [
    {
      name: 'Elena Rostova',
      rating: 5,
      text: 'The dining table craftsmanship exceeded our expectations. The solid European oak finish is flawless.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200',
      role: 'Interior Architect',
    },
    {
      name: 'Marcus Vance',
      rating: 5,
      text: 'White-glove delivery arrived precisely on schedule. Beautiful minimalist aesthetics and superb comfort.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
      role: 'Verified Buyer',
    },
    {
      name: 'Sophia Lindqvist',
      rating: 5,
      text: 'The natural bouclé lounge chair is our favorite spot in the apartment. Worth every single dollar.',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200',
      role: 'Design Director',
    },
  ];

  const items =
    config.testimonials && config.testimonials.length > 0
      ? config.testimonials
      : defaultTestimonials;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
        <span className="text-xs font-black uppercase tracking-widest text-amber-600 block">
          COMMUNITY FEEDBACK
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-foreground tracking-tight">
          {config.title || 'Loved by 50,000+ Happy Homes'}
        </h2>
        {config.subtitle && (
          <p className="text-xs text-slate-500 dark:text-slate-400">{config.subtitle}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((test, i) => (
          <div
            key={i}
            className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-card border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex text-amber-400 gap-1">
                {[...Array(test.rating || 5)].map((_, idx) => (
                  <Star key={idx} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                "{test.text}"
              </p>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              {test.avatar && (
                <img
                  src={test.avatar}
                  alt={test.name}
                  className="w-10 h-10 rounded-full object-cover shrink-0"
                />
              )}
              <div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-foreground">{test.name}</h4>
                {test.role && <p className="text-[10px] text-slate-400">{test.role}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── 12. Newsletter Section ────────────────────────────────────────────────────

function NewsletterSection({
  config,
}: SectionProps & { config: Extract<SectionConfig, { type: 'newsletter' }>['config'] }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
      <div className="bg-slate-100 dark:bg-card rounded-3xl p-8 sm:p-14 border border-slate-200 dark:border-slate-800 text-center max-w-3xl mx-auto space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-amber-600 block">
            NEWSLETTER
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-foreground tracking-tight">
            {config.title || 'Join the Inner Circle'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
            {config.description ||
              'Receive early access to seasonal drops, curated interior design tips, and 10% off your first purchase.'}
          </p>
        </div>

        {subscribed ? (
          <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 max-w-md mx-auto">
            ✓ Thank you for subscribing! Check your inbox for your 10% discount code.
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={config.placeholder || 'Enter your email address...'}
              className="flex-1 px-4 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="submit"
              className="px-6 py-3.5 bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl hover:bg-amber-600 dark:hover:bg-amber-500 transition shadow-sm whitespace-nowrap"
            >
              {config.ctaLabel || 'Subscribe'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

// ── 13. Custom Form Section ───────────────────────────────────────────────────

function CustomFormSection({
  config,
}: SectionProps & { config: Extract<SectionConfig, { type: 'custom_form' }>['config'] }) {
  const [formData, setFormData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const slugOrId = config.formSlug || config.formId;
    if (!slugOrId) {
      setLoading(false);
      return;
    }
    getStorefrontForm(slugOrId)
      .then((data) => setFormData(data))
      .catch((err) => console.error('Failed to load embedded form:', err))
      .finally(() => setLoading(false));
  }, [config.formSlug, config.formId]);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="max-w-4xl mx-auto space-y-6">
        {(config.heading || config.subtitle) && (
          <div className="text-center space-y-2 mb-8">
            {config.heading && (
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-foreground">
                {config.heading}
              </h2>
            )}
            {config.subtitle && (
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
                {config.subtitle}
              </p>
            )}
          </div>
        )}
        {loading ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-amber-600 mb-2" />
            <p className="text-xs text-slate-400">Loading form...</p>
          </div>
        ) : formData ? (
          <div className="bg-white dark:bg-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-lg">
            <StorefrontFormRenderer form={formData} />
          </div>
        ) : (
          <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
            <FileQuestion className="w-8 h-8 mx-auto text-slate-400 mb-2" />
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              {config.formTitle || 'Form Not Selected'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

// ── 14. Spacer Section ────────────────────────────────────────────────────────

function SpacerSection({
  config,
}: {
  config: Extract<SectionConfig, { type: 'spacer' }>['config'];
}) {
  return <div style={{ height: config.height || 32 }} aria-hidden />;
}

// ── 15. Split Features Section (Pawzy / Customizable) ──────────────────────────

function SplitFeaturesSection({
  config,
}: SectionProps & { config: any }) {
  const tabs = config.tabs && config.tabs.length > 0 ? config.tabs : [
    {
      title: 'Fun & Play',
      icon: '⚽',
      desc: "Bring joy to your pet's day with toys, games, and accessories designed for endless fun, active play, happy moments, and daily excitement.",
    },
    {
      title: 'Healthy Nutrition',
      icon: '🥣',
      desc: 'Biologically balanced raw formulas, vet-certified organic kibbles, and essential supplements formulated for longevity.',
    },
    {
      title: 'Daily Hygiene',
      icon: '🛁',
      desc: 'Gentle plant-based herbal shampoos, paw sanitation balms, and tear-free face wash for pristine grooming.',
    },
    {
      title: 'Comfortable Living',
      icon: '🛏️',
      desc: 'Orthopedic memory foam pet beds, self-warming fleece blankets, and cozy travel crates for deep restorative sleep.',
    },
  ];

  const [activeTabIdx, setActiveTabIdx] = useState(0);
  const kicker = config.kicker || 'Gentle Service';
  const titlePrefix = config.titlePrefix || 'Complete Care For';
  const titleHighlight = config.titleHighlight || 'Happy Pets!';
  const imageUrl =
    config.image ||
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80';

  return (
    <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden bg-white dark:bg-transparent">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: Woman holding puppy with soft yellow blob backdrop & doodles */}
        <div className="lg:col-span-6 flex justify-center relative">
          <div className="relative w-full max-w-md">
            {/* Playful background blob shape */}
            <div className="absolute inset-0 bg-[#fff3d4] dark:bg-amber-950/30 rounded-[45%_55%_60%_40%/50%_45%_55%_50%] transform -rotate-3 scale-105 pointer-events-none -z-10" />

            {/* Decorative doodle scribbles */}
            <div className="absolute -top-6 -left-6 text-sky-400 dark:text-sky-500 select-none pointer-events-none opacity-80">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 24 C8 12, 24 8, 20 22 C18 30, 32 28, 30 18 C28 10, 40 12, 38 24" />
              </svg>
            </div>
            <div className="absolute -top-4 right-4 text-sky-400 dark:text-sky-500 select-none pointer-events-none opacity-80">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <path d="M20 6 L20 12" />
                <path d="M10 12 L15 16" />
                <path d="M30 12 L25 16" />
              </svg>
            </div>

            {/* Visual container */}
            <div className="relative w-full aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 bg-amber-50 dark:bg-slate-900">
              <img
                src={imageUrl}
                alt="Complete Care For Happy Pets"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Kicker, Title, and 4 vertical tabs */}
        <div className="lg:col-span-6 space-y-6">
          {kicker && (
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
              {kicker}
            </span>
          )}

          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-950 dark:text-white tracking-tight leading-[1.15] font-heading">
            {titlePrefix} <br />
            <span className="text-[#ffd100]">{titleHighlight}</span>
          </h2>

          <div className="space-y-4 pt-2">
            {tabs.map((tab: any, idx: number) => {
              const isActive = activeTabIdx === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveTabIdx(idx)}
                  className={`transition-all duration-300 cursor-pointer rounded-2xl p-4 ${
                    isActive
                      ? 'border-l-4 border-[#ffd100] bg-amber-50/40 dark:bg-amber-950/20 shadow-xs'
                      : 'border-l-4 border-transparent hover:bg-slate-50 dark:hover:bg-slate-900/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{tab.icon || '🐾'}</span>
                    <h3
                      className={`text-lg sm:text-xl font-extrabold tracking-tight ${
                        isActive
                          ? 'text-slate-950 dark:text-white'
                          : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                      }`}
                    >
                      {tab.title}
                    </h3>
                  </div>

                  {isActive && tab.desc && (
                    <p className="mt-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl animate-in fade-in">
                      {tab.desc}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── 16. FAQ & Store Locations Section (Pawzy / Customizable) ─────────────────

function FaqLocationsSection({
  config,
}: SectionProps & { config: any }) {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const locationsTitle = config.locationsTitle || 'Store Location';
  const locations = config.locations && config.locations.length > 0 ? config.locations : [
    '159 Mulholland Drive, CA, Los Angeles',
    '289 Haight Street, CA, San Francisco',
    '434 5th Avenue, NY, New York',
  ];
  const contactCtaLabel = config.contactCtaLabel || 'Contact Now';
  const contactCtaHref = config.contactCtaHref || '/contact';
  const centerImage =
    config.centerImage ||
    'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=800&q=80';
  const faqTitle = config.faqTitle || 'Frequently Asked Questions';
  const faqs = config.faqs && config.faqs.length > 0 ? config.faqs : [
    {
      question: 'What types of pets do you support?',
      answer:
        'We offer a wide range of items for dogs, cats, small animals like rabbits and hamsters, birds, and even aquatic pets.',
    },
    {
      question: 'Do you offer grooming appointments?',
      answer:
        'Yes! Our certified pet stylists offer herbal baths, nail trimming, coat de-shedding, and full spa sessions.',
    },
    {
      question: 'How long does shipping take?',
      answer:
        'Standard domestic delivery arrives in 2–3 business days. We also offer 2-hour rush local delivery in select cities.',
    },
    {
      question: "Can I return a product if it doesn't fit my pet?",
      answer:
        'Absolutely! We offer a 30-day hassle-free return and exchange guarantee on all gear and accessories.',
    },
    {
      question: 'Are your products vet-approved?',
      answer:
        'Yes! All our organic recipes, raw diets, and wellness formulas are formulated and vetted by licensed veterinary nutritionists.',
    },
  ];

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white dark:bg-transparent">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Store Locations & Contact Button */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl text-[#ffd100]">📍</span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white font-heading">
              {locationsTitle}
            </h3>
          </div>

          <ul className="space-y-3.5 text-sm text-slate-700 dark:text-slate-300 font-medium">
            {locations.map((loc: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="text-slate-900 dark:text-slate-100 font-black">•</span>
                <span>{loc}</span>
              </li>
            ))}
          </ul>

          <div className="pt-2">
            <Link
              href={contactCtaHref}
              className="px-8 py-3.5 bg-[#ffd100] hover:bg-[#e6bc00] text-slate-950 font-black text-xs uppercase tracking-wider rounded-full shadow-md inline-block transition transform active:scale-95"
            >
              {contactCtaLabel}
            </Link>
          </div>
        </div>

        {/* Center Column: 3D Red Location Pin Visual with Dog & Boy */}
        <div className="lg:col-span-4 flex justify-center relative">
          <div className="relative w-full max-w-sm aspect-square flex items-center justify-center">
            {/* Visual Container */}
            <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 bg-white dark:bg-slate-900 group">
              <img
                src={centerImage}
                alt="Store Location & Pet"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              {/* Overlay 3D Pin Badge */}
              <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-rose-500 text-white flex items-center justify-center text-xl shadow-xl border-2 border-white">
                🐾
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: FAQ Accordion */}
        <div className="lg:col-span-4 space-y-6">
          <h3 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white font-heading">
            {faqTitle}
          </h3>

          <div className="space-y-3">
            {faqs.map((faq: any, idx: number) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div
                  key={idx}
                  className="border-b border-slate-200 dark:border-slate-800 pb-3 transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between gap-4 text-left py-1 text-sm sm:text-base font-extrabold text-slate-900 dark:text-white hover:text-amber-500 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <span className="text-xl font-bold shrink-0 text-slate-400">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>

                  {isOpen && faq.answer && (
                    <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal animate-in fade-in">
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Main Section Resolver Component ───────────────────────────────────────────

interface SectionResolverProps extends SectionProps {
  sections: SectionConfig[];
  templateSlug?: string | null;
}

export function SectionResolver({
  sections: initialSections,
  theme: initialTheme,
  products,
  collections,
  categories,
  templateSlug,
}: SectionResolverProps) {
  const [activeSections, setActiveSections] = useState<SectionConfig[]>(initialSections);
  const [activeTheme, setActiveTheme] = useState<ThemeConfig>(initialTheme);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [highlightedType, setHighlightedType] = useState<string | null>(null);

  // Sync state if props change
  useEffect(() => {
    setActiveSections(initialSections);
  }, [initialSections]);

  useEffect(() => {
    setActiveTheme(initialTheme);
  }, [initialTheme]);

  // Real-time bidirectional listener for CMS Theme Manager Live Canvas Preview
  useEffect(() => {
    const handlePostMessage = (event: MessageEvent) => {
      try {
        const data = event.data;
        if (!data || typeof data !== 'object') return;

        if (data.type === 'CMS_SECTIONS_UPDATE' && Array.isArray(data.sections)) {
          const valid = data.sections
            .filter((s: any) => s && s.enabled !== false)
            .map((s: any) => ({
              type: s.type,
              config: s.config || {},
            })) as SectionConfig[];
          setActiveSections(valid);
        }

        if (data.type === 'CMS_THEME_UPDATE' && data.theme) {
          setActiveTheme((prev) => ({ ...prev, ...data.theme }));
        }

        if (data.type === 'CMS_HIGHLIGHT_SECTION') {
          const idx = typeof data.sectionIndex === 'number' ? data.sectionIndex : null;
          const type = data.sectionType || null;
          setHighlightedIndex(idx);
          setHighlightedType(type);

          setTimeout(() => {
            const targetEl =
              (idx !== null ? document.getElementById(`sf-section-${idx}`) : null) ||
              (type ? document.querySelector(`[data-section-type="${type}"]`) : null);

            if (targetEl) {
              targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 80);
        }
      } catch (err) {
        console.warn('[SectionResolver] Error handling postMessage:', err);
      }
    };

    window.addEventListener('message', handlePostMessage);

    // Notify parent CMS Theme Studio that storefront canvas is ready to receive sync
    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'STOREFRONT_READY' }, '*');
      }
    } catch (_) {}

    return () => window.removeEventListener('message', handlePostMessage);
  }, []);

  const commonProps: SectionProps = {
    theme: activeTheme,
    products,
    collections,
    categories,
    templateSlug,
  };

  return (
    <div className="w-full space-y-0">
      {activeSections.map((section, index) => {
        const key = `${section.type}-${index}`;
        const isHighlighted =
          highlightedIndex === index ||
          (highlightedIndex === null && highlightedType === section.type);

        const handleSectionClick = () => {
          try {
            if (window.parent && window.parent !== window) {
              window.parent.postMessage(
                {
                  type: 'STOREFRONT_SECTION_CLICKED',
                  sectionIndex: index,
                  sectionType: section.type,
                },
                '*',
              );
            }
          } catch (_) {}
        };

        const renderSectionContent = () => {
          switch (section.type) {
            case 'hero':
              return <HeroSection key={key} {...commonProps} config={section.config} />;

            case 'trust-badges':
              return <TrustBadgesSection key={key} {...commonProps} config={section.config} />;

            case 'room-grid':
              return <RoomGridSection key={key} {...commonProps} config={section.config} />;

            case 'deal-countdown':
              return <DealCountdownSection key={key} {...commonProps} config={section.config} />;

            case 'featured-products':
              return <FeaturedProductsSection key={key} {...commonProps} config={section.config} />;

            case 'lookbook':
              return <LookbookSection key={key} {...commonProps} config={section.config} />;

            case 'product-matrix':
              return <ProductMatrixSection key={key} {...commonProps} config={section.config} />;

            case 'categories':
              return <CategoriesSection key={key} {...commonProps} config={section.config} />;

            case 'collections':
              return <CollectionsSection key={key} {...commonProps} config={section.config} />;

            case 'banner':
              return <BannerSection key={key} {...commonProps} config={section.config} />;

            case 'testimonials':
              return <TestimonialsSection key={key} {...commonProps} config={section.config} />;

            case 'custom_form':
              return <CustomFormSection key={key} {...commonProps} config={section.config} />;

            case 'newsletter':
              return <NewsletterSection key={key} {...commonProps} config={section.config} />;

            case 'spacer':
              return <SpacerSection key={key} config={section.config} />;

            case 'split-features':
              return <SplitFeaturesSection key={key} {...commonProps} config={section.config} />;

            case 'faq-locations':
              return <FaqLocationsSection key={key} {...commonProps} config={section.config} />;

            default:
              return null;
          }
        };

        return (
          <div
            key={key}
            id={`sf-section-${index}`}
            data-section-index={index}
            data-section-type={section.type}
            onClick={handleSectionClick}
            className={`relative transition-all duration-500 ease-in-out cursor-pointer ${
              isHighlighted
                ? 'ring-4 ring-amber-500 ring-offset-4 ring-offset-white dark:ring-offset-slate-950 shadow-2xl z-30'
                : 'hover:outline hover:outline-2 hover:outline-amber-400/40 hover:outline-offset-1'
            }`}
          >
            {isHighlighted && (
              <div className="absolute top-4 left-4 z-40 px-3.5 py-1.5 rounded-full bg-amber-500 text-slate-950 font-black text-xs shadow-2xl flex items-center gap-2 border-2 border-white dark:border-slate-900 animate-bounce pointer-events-none">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-950 animate-ping" />
                <span className="uppercase tracking-wider">
                  Active Block: {section.type.replace('-', ' ')}
                </span>
              </div>
            )}
            {renderSectionContent()}
          </div>
        );
      })}
    </div>
  );
}
