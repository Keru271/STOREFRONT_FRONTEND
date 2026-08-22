'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import MincomHeader from './Header';
import MincomFooter from './Footer';
import MincomProductCard from './ProductCard';
import type { HomePageProps } from '@/templates';
import type { Product } from '@/lib/api/types';
import { useCurrency } from '@/hooks/useCurrency';

export default function MincomHomePage({ theme, products, collections, categories }: HomePageProps) {
  const [selectedCategoryTab, setSelectedCategoryTab] = useState('all');
  const { formatPrice } = useCurrency();

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

  // Filter trending products
  const displayProducts = selectedCategoryTab === 'all'
    ? products.slice(0, 10)
    : products.filter((p) => {
        const cat = (p.categoryName || p.category || '').toLowerCase();
        const name = (p.name || '').toLowerCase();
        return cat.includes(selectedCategoryTab) || name.includes(selectedCategoryTab);
      }).slice(0, 10);

  const featuredDealProduct = products[0] || {
    id: 'deal-1',
    name: 'Mid-Century Nordic Ergonomic Lounge Chair in Oat Bouclé',
    price: 249.00,
    compareAtPrice: 349.00,
    categoryName: 'Living Room',
    stockQuantity: 12,
    images: ['https://images.unsplash.com/photo-1580481077194-4d22223a502f?q=80&w=800&auto=format&fit=crop'],
    image: 'https://images.unsplash.com/photo-1580481077194-4d22223a502f?q=80&w=800&auto=format&fit=crop',
  };

  // 4 mini lists for bottom matrix
  const topRated = products.slice(0, 3);
  const bestSelling = products.slice(3, 6);
  const onSale = products.slice(6, 9);
  const featuredPicks = products.slice(9, 12);

  return (
    <div
      className="min-h-screen flex flex-col antialiased font-sans"
      style={{ backgroundColor: 'var(--sf-bg)', color: 'var(--sf-text)' }}
    >
      <MincomHeader />

      {/* ── 1. Hero Lifestyle Banner ─────────────────────────────────────── */}
      <section className="relative w-full overflow-hidden min-h-[500px] lg:min-h-[580px] flex items-center" style={{ backgroundColor: 'var(--sf-secondary)' }}>
        {/* Background lifestyle image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1920&auto=format&fit=crop')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/40 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-xl space-y-6 text-white">
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow text-white"
              style={{ backgroundColor: 'var(--sf-accent, var(--sf-primary))' }}
            >
              <span>✨</span> NEW 2026 COLLECTION
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] font-heading">
              Elevate Your Living Space With Nordic Craft
            </h1>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-light">
              Handcrafted solid oak timber, natural wool upholstery, and ergonomic aesthetics designed for everyday serenity.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/products"
                className="px-8 py-4 text-white font-black text-xs uppercase tracking-wider shadow-xl transition transform hover:-translate-y-0.5"
                style={{
                  backgroundColor: 'var(--sf-primary)',
                  borderRadius: 'var(--sf-radius)',
                }}
              >
                Shop Collection →
              </Link>
              <Link
                href="/collections"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white backdrop-blur border border-white/20 font-bold text-xs uppercase tracking-wider transition"
                style={{ borderRadius: 'var(--sf-radius)' }}
              >
                Explore Rooms
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Trust & Guarantee Strip ────────────────────────────────────── */}
      <section className="w-full bg-white border-b border-slate-200 py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl flex-shrink-0">
              🚚
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-slate-900">Free Home Delivery</h4>
              <p className="text-[11px] text-slate-500">On all orders over $150</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl flex-shrink-0">
              🛡️
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-slate-900">10-Year Warranty</h4>
              <p className="text-[11px] text-slate-500">100% solid wood guaranteed</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl flex-shrink-0">
              🔄
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-slate-900">30-Day Easy Returns</h4>
              <p className="text-[11px] text-slate-500">Hassle-free return policy</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl flex-shrink-0">
              💳
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-slate-900">Secure Payments</h4>
              <p className="text-[11px] text-slate-500">Encrypted Stripe & Razorpay</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Room Category Highlights (4 Card Grid) ────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-amber-600">INSPIRATION</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mt-0.5">
              Shop by Living Space
            </h2>
          </div>
          <Link href="/collections" className="text-xs font-bold text-slate-600 hover:text-amber-600 underline">
            All Spaces →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Living Room',
              sub: 'Sofas, Lounges & Coffee Tables',
              count: '48 items',
              image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=600&auto=format&fit=crop',
              href: '/products?category=living-room',
            },
            {
              title: 'Bedroom Sets',
              sub: 'Platform Beds, Nightstands & Linens',
              count: '32 items',
              image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=600&auto=format&fit=crop',
              href: '/products?category=bedroom',
            },
            {
              title: 'Kitchen & Dining',
              sub: 'Solid Wood Dining Tables & Chairs',
              count: '24 items',
              image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=600&auto=format&fit=crop',
              href: '/products?category=dining',
            },
            {
              title: 'Office & Decor',
              sub: 'Ergonomic Desks, Bookshelves & Lamps',
              count: '40 items',
              image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=600&auto=format&fit=crop',
              href: '/products?category=office',
            },
          ].map((room) => (
            <Link
              key={room.title}
              href={room.href}
              className="group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 aspect-[4/5] flex flex-col justify-end p-6 border border-slate-100"
            >
              <img
                src={room.image}
                alt={room.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
              <div className="relative text-white space-y-1">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">{room.count}</span>
                <h3 className="text-lg font-black">{room.title}</h3>
                <p className="text-xs text-slate-300 line-clamp-1">{room.sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 4. Trending Products with Category Filter Tabs ────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-slate-200 pb-5">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-amber-600">HANDPICKED</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mt-0.5">
              Trending Furniture
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2 text-xs font-bold">
            {[
              { label: 'All Items', key: 'all' },
              { label: 'Living Room', key: 'living-room' },
              { label: 'Bedroom', key: 'bedroom' },
              { label: 'Dining', key: 'dining' },
              { label: 'Office', key: 'office' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedCategoryTab(tab.key)}
                className="px-4 py-2 rounded-full transition text-xs font-bold"
                style={
                  selectedCategoryTab === tab.key
                    ? { backgroundColor: 'var(--sf-primary)', color: 'white', borderColor: 'var(--sf-primary)' }
                    : { backgroundColor: 'var(--sf-bg)', color: 'var(--sf-text)', border: '1px solid rgba(150,150,150,0.2)' }
                }
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {displayProducts.map((p) => (
            <MincomProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* ── 5. Promo Spotlight: 40% Off Limited Offer ────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="bg-[#23272a] text-white rounded-3xl overflow-hidden shadow-2xl border border-slate-800 grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-6 p-8 sm:p-12 space-y-6">
            <span className="px-3.5 py-1.5 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider inline-block">
              🔥 SPECIAL PROMO OFFER
            </span>

            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Save Up to 40% Off On Minimalist Studio Sofas
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Designed with modular precision and high-density memory foam cushioning. Transform compact spaces into luxurious lounges.
            </p>

            <ul className="space-y-2 text-xs text-slate-200">
              <li className="flex items-center gap-2">✓ Stain-resistant textured woven fabric</li>
              <li className="flex items-center gap-2">✓ Kiln-dried FSC-certified solid beech frame</li>
              <li className="flex items-center gap-2">✓ Modular layout customizable in 4 colorways</li>
            </ul>

            <div className="pt-2">
              <Link
                href="/products?category=living-room"
                className="px-8 py-3.5 text-white font-black text-xs uppercase tracking-wider shadow-xl transition inline-block"
                style={{
                  backgroundColor: 'var(--sf-primary)',
                  borderRadius: 'var(--sf-radius)',
                }}
              >
                Claim Deal Now →
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 h-full min-h-[350px] relative">
            <img
              src="https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?q=80&w=1000&auto=format&fit=crop"
              alt="Promo Studio Sofa"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── 6. Circular Category Navigation Row ──────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-3 sm:grid-cols-7 gap-4 text-center">
          {[
            { icon: '🛋️', label: 'Sofas & Couches', href: '/products?category=living-room' },
            { icon: '🪑', label: 'Armchairs', href: '/products?category=chairs' },
            { icon: '🪵', label: 'Dining Tables', href: '/products?category=dining' },
            { icon: '🛏️', label: 'Beds & Sleep', href: '/products?category=bedroom' },
            { icon: '💡', label: 'Lamps & Lights', href: '/products?category=decor' },
            { icon: '🪴', label: 'Planters', href: '/products?category=decor' },
            { icon: '🗄️', label: 'Storage & TV', href: '/products?category=office' },
          ].map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              className="group p-4 bg-white rounded-2xl border border-slate-100 hover:shadow-md transition flex flex-col items-center gap-2"
              style={{ borderRadius: 'var(--sf-radius)' }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-2xl transition"
                style={{ backgroundColor: 'color-mix(in srgb, var(--sf-primary) 10%, transparent)' }}
              >
                {cat.icon}
              </div>
              <span className="text-xs font-bold transition" style={{ color: 'var(--sf-text)' }}>
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 7. Deal of the Day Spotlight Card ───────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Spotlight Image */}
          <div className="lg:col-span-6 aspect-square bg-[#f8fafc] rounded-3xl overflow-hidden p-8 flex items-center justify-center relative">
            <span className="absolute top-4 left-4 bg-rose-500 text-white font-black text-xs px-3 py-1.5 rounded-full shadow">
              DEAL OF THE DAY
            </span>
            <img
              src={featuredDealProduct.image || 'https://images.unsplash.com/photo-1580481077194-4d22223a502f?q=80&w=800&auto=format&fit=crop'}
              alt={featuredDealProduct.name}
              className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Deal Details & Countdown */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--sf-primary)' }}>HURRY UP! OFFER ENDS IN:</span>
              {/* Countdown Clocks */}
              <div className="flex gap-3 mt-2 font-mono">
                <div className="bg-[#23272a] text-white px-4 py-2.5 rounded-xl text-center min-w-[60px]">
                  <span className="text-xl font-black">{String(timeLeft.hours).padStart(2, '0')}</span>
                  <span className="block text-[9px] uppercase tracking-wider text-amber-400">Hours</span>
                </div>
                <div className="bg-[#23272a] text-white px-4 py-2.5 rounded-xl text-center min-w-[60px]">
                  <span className="text-xl font-black">{String(timeLeft.minutes).padStart(2, '0')}</span>
                  <span className="block text-[9px] uppercase tracking-wider text-amber-400">Mins</span>
                </div>
                <div className="bg-[#23272a] text-white px-4 py-2.5 rounded-xl text-center min-w-[60px]">
                  <span className="text-xl font-black">{String(timeLeft.seconds).padStart(2, '0')}</span>
                  <span className="block text-[9px] uppercase tracking-wider text-amber-400">Secs</span>
                </div>
              </div>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug font-heading" style={{ color: 'var(--sf-text)' }}>
              {featuredDealProduct.name}
            </h3>

            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--sf-accent, var(--sf-primary))' }}>
              {'★★★★★'}
              <span className="text-xs text-slate-500 font-bold ml-2">(124 Customer Reviews)</span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black" style={{ color: 'var(--sf-text)' }}>{formatPrice(featuredDealProduct.price)}</span>
              {featuredDealProduct.compareAtPrice && (
                <span className="text-lg opacity-50 line-through">{formatPrice(featuredDealProduct.compareAtPrice)}</span>
              )}
            </div>

            {/* Stock meter */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Available Units: {featuredDealProduct.stockQuantity || 12}</span>
                <span style={{ color: 'var(--sf-primary)' }}>82% Claimed</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full w-[82%]" style={{ backgroundColor: 'var(--sf-primary)' }} />
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href={`/products/${featuredDealProduct.urlSlug || featuredDealProduct.id}`}
                className="flex-1 py-4 text-white font-black text-xs uppercase tracking-wider shadow-xl text-center transition active:scale-98"
                style={{
                  backgroundColor: 'var(--sf-primary)',
                  borderRadius: 'var(--sf-radius)',
                }}
              >
                Add To Bag 🛍️
              </Link>
              <Link
                href={`/products/${featuredDealProduct.urlSlug || featuredDealProduct.id}`}
                className="px-6 py-4 text-white font-bold text-xs uppercase tracking-wider transition"
                style={{
                  backgroundColor: 'var(--sf-secondary)',
                  borderRadius: 'var(--sf-radius)',
                }}
              >
                Quick Details
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. 3-Block Alternating Editorial Promos ──────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        {[
          {
            title: 'Modern Creative Workspace',
            sub: 'Ergonomic oak desks, integrated cable management, and studio lighting.',
            image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=900&auto=format&fit=crop',
            tag: 'OFFICE & DESKS',
            href: '/products?category=office',
            reverse: false,
          },
          {
            title: 'Scandinavian Living Room',
            sub: 'Warm mustard and saffron sofas paired with organic timber tables.',
            image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=900&auto=format&fit=crop',
            tag: 'LIVING ROOM',
            href: '/products?category=living-room',
            reverse: true,
          },
          {
            title: 'Atmospheric Mid-Century Lounge',
            sub: 'Charcoal wool armchairs, brass floor lamps, and sculptural planters.',
            image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=900&auto=format&fit=crop',
            tag: 'ACCENT CHAIRS',
            href: '/products?category=chairs',
            reverse: false,
          },
        ].map((block) => (
          <div
            key={block.title}
            className={`bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 grid grid-cols-1 lg:grid-cols-12 items-center ${
              block.reverse ? 'lg:flex-row-reverse' : ''
            }`}
          >
            <div className={`lg:col-span-5 p-8 sm:p-12 space-y-4 ${block.reverse ? 'lg:order-2' : ''}`}>
              <span className="text-xs font-black uppercase tracking-widest text-amber-600">{block.tag}</span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-tight">
                {block.title}
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">{block.sub}</p>
              <Link
                href={block.href}
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition shadow"
              >
                Shop The Look →
              </Link>
            </div>

            <div className={`lg:col-span-7 h-full min-h-[320px] relative ${block.reverse ? 'lg:order-1' : ''}`}>
              <img src={block.image} alt={block.title} className="absolute inset-0 w-full h-full object-cover" />
            </div>
          </div>
        ))}
      </section>

      {/* ── 9. Testimonials Strip ────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-black uppercase tracking-widest text-amber-600">CLIENT EXPERIENCES</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mt-1">
            Loved by 20,000+ Homeowners
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Sarah Jenkins',
              role: 'Interior Architect, NY',
              quote: 'The craftsmanship on our Nordic dining table is breathtaking. Solid oak, satin smooth finish, and delivered seamlessly.',
              rating: 5,
            },
            {
              name: 'David & Marcus L.',
              role: 'Verified Buyer, CA',
              quote: 'The studio sofa exceeded every expectation. Supportive, luxurious upholstery, and assembled in less than 15 minutes.',
              rating: 5,
            },
            {
              name: 'Elena Rostova',
              role: 'Design Enthusiast, TX',
              quote: 'Mincom furniture gave our home the exact warm Scandinavian aesthetic we had pinned for months. Five stars without a doubt!',
              rating: 5,
            },
          ].map((t) => (
            <div key={t.name} className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <div className="text-amber-400 text-sm">{'★'.repeat(t.rating)}</div>
              <p className="text-xs text-slate-600 leading-relaxed italic">"{t.quote}"</p>
              <div className="pt-2 border-t border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center">
                  {t.name[0]}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">{t.name}</h4>
                  <p className="text-[11px] text-slate-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 10. 4-Column Compact Products Matrix ─────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full border-t border-slate-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: Top Rated */}
          <div>
            <h3 className="font-black text-sm text-slate-950 uppercase tracking-wider pb-3 border-b border-slate-200 mb-4">
              ⭐ Top Rated
            </h3>
            <div className="space-y-4">
              {topRated.map((p) => (
                <Link key={p.id} href={`/products/${p.urlSlug || p.id}`} className="flex gap-3 group">
                  <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                    <img src={p.image || p.images?.[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 group-hover:text-amber-600 transition line-clamp-1">{p.name}</h4>
                    <div className="text-amber-400 text-[10px]">★★★★★</div>
                    <span className="text-xs font-black text-slate-950 mt-1 block">{formatPrice(p.price)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Col 2: Best Selling */}
          <div>
            <h3 className="font-black text-sm text-slate-950 uppercase tracking-wider pb-3 border-b border-slate-200 mb-4">
              🔥 Best Selling
            </h3>
            <div className="space-y-4">
              {bestSelling.map((p) => (
                <Link key={p.id} href={`/products/${p.urlSlug || p.id}`} className="flex gap-3 group">
                  <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                    <img src={p.image || p.images?.[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 group-hover:text-amber-600 transition line-clamp-1">{p.name}</h4>
                    <div className="text-amber-400 text-[10px]">★★★★★</div>
                    <span className="text-xs font-black text-slate-950 mt-1 block">{formatPrice(p.price)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Col 3: On Sale */}
          <div>
            <h3 className="font-black text-sm text-slate-950 uppercase tracking-wider pb-3 border-b border-slate-200 mb-4">
              🏷️ On Sale
            </h3>
            <div className="space-y-4">
              {onSale.map((p) => (
                <Link key={p.id} href={`/products/${p.urlSlug || p.id}`} className="flex gap-3 group">
                  <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                    <img src={p.image || p.images?.[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 group-hover:text-amber-600 transition line-clamp-1">{p.name}</h4>
                    <div className="text-amber-400 text-[10px]">★★★★★</div>
                    <span className="text-xs font-black text-slate-950 mt-1 block">{formatPrice(p.price)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Col 4: Featured Picks */}
          <div>
            <h3 className="font-black text-sm text-slate-950 uppercase tracking-wider pb-3 border-b border-slate-200 mb-4">
              ✨ Featured Picks
            </h3>
            <div className="space-y-4">
              {featuredPicks.map((p) => (
                <Link key={p.id} href={`/products/${p.urlSlug || p.id}`} className="flex gap-3 group">
                  <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                    <img src={p.image || p.images?.[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 group-hover:text-amber-600 transition line-clamp-1">{p.name}</h4>
                    <div className="text-amber-400 text-[10px]">★★★★★</div>
                    <span className="text-xs font-black text-slate-950 mt-1 block">{formatPrice(p.price)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── 11. Dual Banner Promotions ───────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative rounded-3xl overflow-hidden aspect-[16/9] p-8 flex flex-col justify-end text-white">
            <img
              src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop"
              alt="Handmade Ceramics"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
            <div className="relative space-y-2">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">ARTISAN DECOR</span>
              <h3 className="text-xl font-black">Handmade Ceramics & Lighting</h3>
              <Link href="/products?category=decor" className="inline-block text-xs font-bold underline text-amber-400 hover:text-amber-300">
                Explore Accents →
              </Link>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden aspect-[16/9] p-8 flex flex-col justify-end text-white">
            <img
              src="https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=800&auto=format&fit=crop"
              alt="Vintage Storage"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
            <div className="relative space-y-2">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">SOLID TIMBER</span>
              <h3 className="text-xl font-black">Vintage Storage & Credenzas</h3>
              <Link href="/products?category=office" className="inline-block text-xs font-bold underline text-amber-400 hover:text-amber-300">
                Shop Storage →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 12. Design Journal / Blog Posts ──────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-amber-600">JOURNAL</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mt-0.5">
              Interior Design Stories
            </h2>
          </div>
          <Link href="/blog" className="text-xs font-bold text-slate-600 hover:text-amber-600 underline">
            Read All Articles →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Top 7 Scandinavian Living Room Trends for 2026',
              date: 'August 18, 2026',
              image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=600&auto=format&fit=crop',
            },
            {
              title: 'The Timeless Appeal of Solid Walnut and Oak Joinery',
              date: 'August 12, 2026',
              image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=600&auto=format&fit=crop',
            },
            {
              title: 'How to Layer Lighting for Cozy & Relaxing Bedrooms',
              date: 'August 05, 2026',
              image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=600&auto=format&fit=crop',
            },
          ].map((blog) => (
            <div key={blog.title} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm flex flex-col justify-between group">
              <div className="aspect-[16/10] overflow-hidden">
                <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              </div>
              <div className="p-6 space-y-2">
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">{blog.date}</span>
                <h4 className="font-bold text-sm text-slate-900 group-hover:text-amber-600 transition leading-snug">{blog.title}</h4>
                <Link href="/blog" className="inline-block text-xs font-bold text-slate-900 pt-2 hover:underline">
                  Read Article →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <MincomFooter />
    </div>
  );
}
