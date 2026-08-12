'use client';

import Link from 'next/link';
import MinimalHeader from './Header';
import MinimalFooter from './Footer';
import MinimalProductCard from './ProductCard';
import type { HomePageProps } from '@/templates';

export default function MinimalHomePage({ theme, products, collections, categories }: HomePageProps) {
  const featuredCollections = collections.slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--sf-bg)' }}>
      <MinimalHeader />
      <main className="flex-1">

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-6 pt-24 pb-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-xs tracking-widest uppercase block mb-6" style={{ color: 'var(--sf-primary)' }}>
                — New Collection
              </span>
              <h1
                className="text-6xl lg:text-8xl font-extralight leading-none mb-8"
                style={{ color: 'var(--sf-text)' }}
              >
                Designed<br />
                for the<br />
                <em className="not-italic font-bold" style={{ color: 'var(--sf-primary)' }}>essentials.</em>
              </h1>
              <p className="text-base font-light leading-relaxed mb-10 max-w-sm" style={{ color: 'color-mix(in srgb, var(--sf-text) 60%, transparent)' }}>
                Thoughtfully crafted products for those who appreciate quality without excess.
              </p>
              <div className="flex gap-6 items-center">
                <Link
                  href="/products"
                  className="text-sm tracking-widest uppercase pb-1 transition-all"
                  style={{
                    color: 'var(--sf-text)',
                    borderBottom: '1px solid var(--sf-text)',
                  }}
                >
                  Shop Now
                </Link>
                <Link
                  href="/collections"
                  className="text-sm tracking-widest uppercase transition-opacity hover:opacity-50"
                  style={{ color: 'color-mix(in srgb, var(--sf-text) 50%, transparent)' }}
                >
                  Collections
                </Link>
              </div>
            </div>

            {/* Hero visual */}
            <div className="relative">
              <div
                className="aspect-square rounded-2xl overflow-hidden"
                style={{
                  background: `linear-gradient(135deg,
                    color-mix(in srgb, var(--sf-primary) 15%, var(--sf-bg)),
                    color-mix(in srgb, var(--sf-accent) 10%, var(--sf-bg)))`,
                }}
              >
                {products[0]?.image ? (
                  <img src={products[0].image} alt={products[0].name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 rounded-full mx-auto mb-4" style={{ backgroundColor: 'color-mix(in srgb, var(--sf-primary) 20%, transparent)' }} />
                      <div className="w-32 h-2 rounded mx-auto mb-2" style={{ backgroundColor: 'color-mix(in srgb, var(--sf-primary) 15%, transparent)' }} />
                      <div className="w-24 h-2 rounded mx-auto" style={{ backgroundColor: 'color-mix(in srgb, var(--sf-primary) 10%, transparent)' }} />
                    </div>
                  </div>
                )}
              </div>
              {/* Floating badge */}
              <div
                className="absolute -bottom-5 -left-5 px-5 py-4 rounded-xl"
                style={{
                  backgroundColor: 'var(--sf-bg)',
                  boxShadow: '0 20px 60px color-mix(in srgb, var(--sf-text) 12%, transparent)',
                }}
              >
                <p className="text-xs tracking-widest uppercase" style={{ color: 'color-mix(in srgb, var(--sf-text) 40%, transparent)' }}>Free shipping</p>
                <p className="text-lg font-bold" style={{ color: 'var(--sf-text)' }}>On all orders</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Divider ───────────────────────────────────────────────────────── */}
        <div className="max-w-6xl mx-auto px-6">
          <div style={{ height: '1px', backgroundColor: 'color-mix(in srgb, var(--sf-text) 8%, transparent)' }} />
        </div>

        {/* ── Collections ──────────────────────────────────────────────────── */}
        {featuredCollections.length > 0 && (
          <section className="max-w-6xl mx-auto px-6 py-20">
            <div className="flex justify-between items-baseline mb-12">
              <h2 className="text-3xl font-extralight" style={{ color: 'var(--sf-text)' }}>Collections</h2>
              <Link href="/collections" className="text-xs tracking-widest uppercase transition-opacity hover:opacity-50" style={{ color: 'var(--sf-text)' }}>All →</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {featuredCollections.map((col) => (
                <Link
                  key={col.id}
                  href={`/collections/${col.slug}`}
                  className="group relative overflow-hidden"
                  style={{ aspectRatio: '2/3' }}
                >
                  {col.image ? (
                    <img src={col.image} alt={col.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div
                      className="w-full h-full"
                      style={{
                        background: `linear-gradient(160deg,
                          color-mix(in srgb, var(--sf-primary) 20%, var(--sf-bg)),
                          color-mix(in srgb, var(--sf-secondary) 15%, var(--sf-bg)))`,
                      }}
                    />
                  )}
                  <div className="absolute inset-0 flex items-end p-5" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }}>
                    <div>
                      <p className="text-xs tracking-widest uppercase text-white/70 mb-1">{col.type}</p>
                      <p className="text-base font-light text-white">{col.name}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Categories ───────────────────────────────────────────────────── */}
        {categories.length > 0 && (
          <section className="max-w-6xl mx-auto px-6 py-10">
            <div className="flex flex-wrap gap-2">
              <Link href="/products" className="text-xs tracking-widest uppercase px-4 py-2 transition-all" style={{ color: 'var(--sf-bg)', backgroundColor: 'var(--sf-text)' }}>
                All
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className="text-xs tracking-widest uppercase px-4 py-2 transition-all border hover:opacity-60"
                  style={{
                    color: 'var(--sf-text)',
                    borderColor: 'color-mix(in srgb, var(--sf-text) 20%, transparent)',
                  }}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Products Grid ─────────────────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <div className="flex justify-between items-baseline mb-10">
            <h2 className="text-3xl font-extralight" style={{ color: 'var(--sf-text)' }}>Featured</h2>
            <Link href="/products" className="text-xs tracking-widest uppercase transition-opacity hover:opacity-50" style={{ color: 'var(--sf-text)' }}>
              View All →
            </Link>
          </div>

          {products.length === 0 ? (
            <p className="text-center py-20 font-light" style={{ color: 'color-mix(in srgb, var(--sf-text) 35%, transparent)' }}>
              Products coming soon
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
              {products.slice(0, 8).map((p) => (
                <MinimalProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>

        {/* ── Quote Section ─────────────────────────────────────────────────── */}
        <section
          className="py-20 px-6 text-center"
          style={{ backgroundColor: 'color-mix(in srgb, var(--sf-text) 4%, var(--sf-bg))' }}
        >
          <blockquote className="max-w-2xl mx-auto">
            <p className="text-2xl lg:text-3xl font-extralight italic leading-relaxed mb-6" style={{ color: 'var(--sf-text)' }}>
              "Quality over quantity — always. Curated for those who know the difference."
            </p>
            <cite className="text-xs tracking-widest uppercase not-italic" style={{ color: 'color-mix(in srgb, var(--sf-text) 35%, transparent)' }}>
              — {theme.storeName}
            </cite>
          </blockquote>
        </section>
      </main>
      <MinimalFooter />
    </div>
  );
}
