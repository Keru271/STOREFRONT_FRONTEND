'use client';

import Link from 'next/link';
import LuxeHeader from './Header';
import LuxeFooter from './Footer';
import LuxeProductCard from './ProductCard';
import type { HomePageProps } from '@/templates';

export default function LuxeHomePage({ theme, products, collections, categories }: HomePageProps) {
  const featuredCollections = collections.filter((c) => c.featured).slice(0, 2);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--sf-bg)' }}>
      <LuxeHeader />
      <main className="flex-1">

        {/* ── Cinematic Hero ────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden" style={{ height: 'calc(100vh - 80px)', minHeight: '600px' }}>
          {/* Background */}
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse at 30% 60%,
                color-mix(in srgb, var(--sf-primary) 25%, var(--sf-bg)) 0%,
                color-mix(in srgb, var(--sf-secondary) 12%, var(--sf-bg)) 40%,
                var(--sf-bg) 75%)`,
            }}
          />

          {/* Decorative lines */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute"
                style={{
                  left: `${10 + i * 16}%`,
                  top: 0,
                  bottom: 0,
                  width: '1px',
                  backgroundColor: `color-mix(in srgb, var(--sf-primary) ${3 + i}%, transparent)`,
                  transform: `skewX(-${2 + i * 0.5}deg)`,
                }}
              />
            ))}
          </div>

          {/* Featured product image (right side) */}
          {products[0]?.image && (
            <div className="absolute right-0 top-0 h-full w-1/2 hidden lg:block">
              <div className="relative h-full">
                <img
                  src={products[0].image}
                  alt={products[0].name}
                  className="w-full h-full object-cover"
                  style={{ maskImage: 'linear-gradient(to right, transparent, black 30%)' }}
                />
              </div>
            </div>
          )}

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-center max-w-7xl mx-auto px-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-px" style={{ backgroundColor: 'var(--sf-primary)' }} />
                <span className="text-xs tracking-[0.3em] uppercase font-light" style={{ color: 'var(--sf-primary)' }}>
                  {new Date().getFullYear()} Collection
                </span>
              </div>

              <h1
                className="font-bold leading-none mb-8"
                style={{
                  fontSize: 'clamp(3rem, 8vw, 7rem)',
                  letterSpacing: '-0.02em',
                  color: 'var(--sf-text)',
                  lineHeight: 1,
                }}
              >
                Crafted for<br />
                <span style={{ color: 'var(--sf-primary)' }}>Excellence.</span>
              </h1>

              <p className="text-base font-light mb-10 max-w-md leading-relaxed" style={{ color: 'color-mix(in srgb, var(--sf-text) 55%, transparent)' }}>
                Discover a world where luxury meets purpose. Each piece tells a story of exceptional craftsmanship.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-3 px-8 py-4 text-xs tracking-[0.2em] uppercase font-medium transition-all duration-300 group"
                  style={{ backgroundColor: 'var(--sf-primary)', color: 'white' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'var(--sf-primary-hover)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'var(--sf-primary)';
                  }}
                >
                  Explore the Edit
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
                <Link
                  href="/collections"
                  className="inline-flex items-center gap-3 px-8 py-4 text-xs tracking-[0.2em] uppercase font-medium transition-all duration-300 border"
                  style={{
                    color: 'var(--sf-text)',
                    borderColor: 'color-mix(in srgb, var(--sf-text) 25%, transparent)',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.borderColor = 'var(--sf-primary)';
                    el.style.color = 'var(--sf-primary)';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.borderColor = 'color-mix(in srgb, var(--sf-text) 25%, transparent)';
                    el.style.color = 'var(--sf-text)';
                  }}
                >
                  View Collections
                </Link>
              </div>
            </div>
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <span className="text-xs tracking-[0.25em] uppercase font-light" style={{ color: 'color-mix(in srgb, var(--sf-text) 30%, transparent)' }}>Scroll</span>
            <div className="w-px h-8" style={{ background: `linear-gradient(to bottom, var(--sf-primary), transparent)` }} />
          </div>
        </section>

        {/* ── Featured Collections ──────────────────────────────────────────── */}
        {featuredCollections.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 py-20">
            <div className="flex items-baseline justify-between mb-12">
              <div>
                <span className="text-xs tracking-[0.3em] uppercase block mb-3" style={{ color: 'var(--sf-primary)' }}>Featured</span>
                <h2 className="text-4xl font-light" style={{ color: 'var(--sf-text)' }}>The Collections</h2>
              </div>
              <Link href="/collections" className="text-xs tracking-[0.15em] uppercase font-light transition-opacity hover:opacity-50" style={{ color: 'var(--sf-text)' }}>
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featuredCollections.map((col, i) => (
                <Link
                  key={col.id}
                  href={`/collections/${col.slug}`}
                  className="group relative overflow-hidden block"
                  style={{ height: i === 0 ? '500px' : '320px' }}
                >
                  {col.image ? (
                    <img src={col.image} alt={col.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div
                      className="w-full h-full"
                      style={{
                        background: `linear-gradient(${120 + i * 60}deg,
                          color-mix(in srgb, var(--sf-primary) ${20 - i * 5}%, var(--sf-bg)),
                          color-mix(in srgb, var(--sf-secondary) ${15 - i * 3}%, var(--sf-bg)))`,
                      }}
                    />
                  )}
                  <div className="absolute inset-0 flex flex-col justify-end p-8" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)' }}>
                    <span className="text-xs tracking-[0.2em] uppercase text-white/60 mb-2">{col.type}</span>
                    <h3 className="text-2xl font-light text-white mb-3">{col.name}</h3>
                    {col.description && (
                      <p className="text-sm text-white/60 font-light mb-4 line-clamp-2">{col.description}</p>
                    )}
                    <span className="text-xs tracking-[0.2em] uppercase text-white/80 flex items-center gap-2 transition-gap group-hover:gap-4 duration-300">
                      Discover <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── New In ──────────────────────────────────────────────────────────── */}
        <section
          className="py-20"
          style={{ backgroundColor: 'color-mix(in srgb, var(--sf-text) 3%, var(--sf-bg))' }}
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-baseline justify-between mb-12">
              <div>
                <span className="text-xs tracking-[0.3em] uppercase block mb-3" style={{ color: 'var(--sf-primary)' }}>New In</span>
                <h2 className="text-4xl font-light" style={{ color: 'var(--sf-text)' }}>Latest Arrivals</h2>
              </div>
              <Link href="/products?sort=newest" className="text-xs tracking-[0.15em] uppercase font-light transition-opacity hover:opacity-50" style={{ color: 'var(--sf-text)' }}>
                Shop All →
              </Link>
            </div>

            {/* Category Tabs */}
            {categories.length > 0 && (
              <div className="flex gap-6 mb-10 overflow-x-auto pb-2">
                {['All', ...categories.slice(0, 5).map((c) => c.name)].map((name, i) => (
                  <Link
                    key={name}
                    href={i === 0 ? '/products' : `/products?category=${categories[i - 1]?.slug}`}
                    className="text-xs tracking-[0.15em] uppercase font-light whitespace-nowrap pb-1 transition-all"
                    style={{
                      color: i === 0 ? 'var(--sf-primary)' : 'color-mix(in srgb, var(--sf-text) 50%, transparent)',
                      borderBottom: i === 0 ? '1px solid var(--sf-primary)' : '1px solid transparent',
                    }}
                  >
                    {name}
                  </Link>
                ))}
              </div>
            )}

            {products.length === 0 ? (
              <p className="text-center py-20 font-light" style={{ color: 'color-mix(in srgb, var(--sf-text) 30%, transparent)' }}>Coming soon</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
                {products.slice(0, 8).map((p) => (
                  <LuxeProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── Brand Story ─────────────────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div
              className="aspect-square relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg,
                  color-mix(in srgb, var(--sf-primary) 20%, var(--sf-bg)),
                  color-mix(in srgb, var(--sf-accent) 15%, var(--sf-bg)))`,
              }}
            >
              {/* Decorative element */}
              <div
                className="absolute top-8 left-8 right-8 bottom-8 border"
                style={{ borderColor: 'color-mix(in srgb, var(--sf-primary) 25%, transparent)' }}
              />
            </div>
            <div>
              <span className="text-xs tracking-[0.3em] uppercase block mb-4" style={{ color: 'var(--sf-primary)' }}>Our Story</span>
              <h2 className="text-4xl font-light mb-6 leading-snug" style={{ color: 'var(--sf-text)' }}>
                Redefining what luxury means today
              </h2>
              <p className="text-sm font-light leading-relaxed mb-6" style={{ color: 'color-mix(in srgb, var(--sf-text) 55%, transparent)' }}>
                {theme.description || 'We believe in creating pieces that transcend trends — timeless objects crafted with intention, precision, and an uncompromising commitment to quality that lasts a lifetime.'}
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase font-medium transition-all duration-300"
                style={{ color: 'var(--sf-primary)', borderBottom: '1px solid var(--sf-primary)', paddingBottom: '2px' }}
              >
                Our Manifesto →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <LuxeFooter />
    </div>
  );
}
