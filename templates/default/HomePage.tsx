'use client';

import Link from 'next/link';
import DefaultHeader from './Header';
import DefaultFooter from './Footer';
import DefaultProductCard from './ProductCard';
import type { HomePageProps } from '@/templates';

export default function DefaultHomePage({ theme, products, collections, categories }: HomePageProps) {
  const featuredCollections = collections.filter((c) => c.featured).slice(0, 3);
  const displayCollections = featuredCollections.length > 0 ? featuredCollections : collections.slice(0, 3);
  const newArrivals = products;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--sf-bg)' }}>
      <DefaultHeader />

      <main className="flex-1">
        {/* ── Hero Section ────────────────────────────────────────────────── */}
        <section
          className="relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg,
              color-mix(in srgb, var(--sf-primary) 90%, black) 0%,
              color-mix(in srgb, var(--sf-secondary) 80%, black) 60%,
              color-mix(in srgb, var(--sf-accent) 70%, black) 100%)`,
            minHeight: '560px',
          }}
        >
          {/* Decorative circles */}
          <div
            className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-20"
            style={{ backgroundColor: 'white' }}
          />
          <div
            className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full opacity-10"
            style={{ backgroundColor: 'white' }}
          />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <span
                className="inline-block text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6"
                style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white' }}
              >
                New Season Arrivals
              </span>
              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-none tracking-tight mb-6">
                Shop the<br />
                <span
                  className="relative inline-block"
                  style={{ WebkitTextStroke: '2px rgba(255,255,255,0.5)', color: 'transparent' }}
                >
                  Latest
                </span>{' '}
                Drops
              </h1>
              <p className="text-lg text-white/70 mb-10 max-w-xl leading-relaxed">
                Discover thousands of products curated just for you. Free shipping on orders over $50.
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Link
                  href="/products"
                  className="px-8 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105 active:scale-100"
                  style={{ backgroundColor: 'white', color: 'var(--sf-primary)' }}
                >
                  Shop Now
                </Link>
                <Link
                  href="/collections"
                  className="px-8 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105 active:scale-100"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    color: 'white',
                    border: '1.5px solid rgba(255,255,255,0.3)',
                  }}
                >
                  Explore Collections
                </Link>
              </div>
            </div>

            {/* Hero Stats */}
            <div className="flex gap-8 lg:flex-col">
              {[
                { value: '10K+', label: 'Products' },
                { value: '50K+', label: 'Happy Customers' },
                { value: '4.9★', label: 'Average Rating' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-white/60 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Trust Badges ─────────────────────────────────────────────────── */}
        <section
          className="py-6 border-b"
          style={{ borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)' }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: '🚚', title: 'Free Shipping', desc: 'On orders over $50' },
                { icon: '↩️', title: 'Easy Returns', desc: '30-day return policy' },
                { icon: '🔒', title: 'Secure Payment', desc: 'SSL encrypted checkout' },
                { icon: '💬', title: '24/7 Support', desc: 'Always here to help' },
              ].map((badge) => (
                <div key={badge.title} className="flex items-center gap-3 py-2">
                  <span className="text-2xl flex-shrink-0">{badge.icon}</span>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--sf-text)' }}>{badge.title}</p>
                    <p className="text-xs" style={{ color: 'color-mix(in srgb, var(--sf-text) 50%, transparent)' }}>{badge.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Collections ──────────────────────────────────────────────────── */}
        {displayCollections.length > 0 && (
          <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <div>
                <span
                  className="text-xs font-semibold tracking-widest uppercase mb-2 block"
                  style={{ color: 'var(--sf-primary)' }}
                >
                  Explore
                </span>
                <h2 className="text-3xl font-bold" style={{ color: 'var(--sf-text)' }}>Featured Collections</h2>
              </div>
              <Link
                href="/collections"
                className="text-sm font-medium hidden sm:flex items-center gap-1.5 transition-all hover:gap-2.5"
                style={{ color: 'var(--sf-primary)' }}
              >
                View All <span>→</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {displayCollections.map((collection, i) => (
                <Link
                  key={collection.id}
                  href={`/collections/${collection.slug}`}
                  className={`group relative overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${i === 0 ? 'md:row-span-2' : ''}`}
                  style={{ minHeight: i === 0 ? '400px' : '190px' }}
                >
                  {collection.image ? (
                    <img src={collection.image} alt={collection.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(${135 + i * 30}deg,
                          color-mix(in srgb, var(--sf-primary) ${80 - i * 15}%, var(--sf-secondary)),
                          color-mix(in srgb, var(--sf-accent) 60%, var(--sf-secondary)))`,
                      }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6">
                    <h3 className="text-xl font-bold text-white mb-1">{collection.name}</h3>
                    {collection.description && (
                      <p className="text-sm text-white/70 line-clamp-2">{collection.description}</p>
                    )}
                    <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-white/90 group-hover:text-white transition-colors">
                      Shop Collection <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Categories Pills ─────────────────────────────────────────────── */}
        {categories.length > 0 && (
          <section
            className="py-8 px-4 sm:px-6 lg:px-8"
            style={{ backgroundColor: 'color-mix(in srgb, var(--sf-text) 3%, var(--sf-bg))' }}
          >
            <div className="max-w-7xl mx-auto">
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                <Link
                  href="/products"
                  className="flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 text-white"
                  style={{ backgroundColor: 'var(--sf-primary)' }}
                >
                  All
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/products?category=${cat.slug}`}
                    className="flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 border hover:text-white"
                    style={{
                      color: 'var(--sf-text)',
                      borderColor: 'color-mix(in srgb, var(--sf-text) 20%, transparent)',
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLAnchorElement;
                      el.style.backgroundColor = 'var(--sf-primary)';
                      el.style.borderColor = 'var(--sf-primary)';
                      el.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLAnchorElement;
                      el.style.backgroundColor = '';
                      el.style.borderColor = 'color-mix(in srgb, var(--sf-text) 20%, transparent)';
                      el.style.color = 'var(--sf-text)';
                    }}
                  >
                    {cat.icon && <span className="mr-1.5">{cat.icon}</span>}
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── New Arrivals Grid ─────────────────────────────────────────────── */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span
                className="text-xs font-semibold tracking-widest uppercase mb-2 block"
                style={{ color: 'var(--sf-primary)' }}
              >
                Just In
              </span>
              <h2 className="text-3xl font-bold" style={{ color: 'var(--sf-text)' }}>New Arrivals</h2>
            </div>
            <Link
              href="/products?sort=newest"
              className="text-sm font-medium hidden sm:flex items-center gap-1.5 transition-all hover:gap-2.5"
              style={{ color: 'var(--sf-primary)' }}
            >
              View All <span>→</span>
            </Link>
          </div>

          {newArrivals?.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg" style={{ color: 'color-mix(in srgb, var(--sf-text) 40%, transparent)' }}>
                Products coming soon…
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {newArrivals?.map((product) => (
                <DefaultProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* ── Banner CTA ───────────────────────────────────────────────────── */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div
            className="max-w-7xl mx-auto rounded-3xl overflow-hidden relative"
            style={{
              background: `linear-gradient(120deg, var(--sf-accent), color-mix(in srgb, var(--sf-accent) 60%, var(--sf-primary)))`,
              minHeight: '240px',
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center p-10 text-center">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Members get more</h2>
                <p className="text-white/80 mb-8 max-w-md">
                  Join thousands of shoppers and unlock exclusive deals, early access, and free shipping.
                </p>
                <Link
                  href="/auth/signup"
                  className="inline-block px-8 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105"
                  style={{ backgroundColor: 'white', color: 'var(--sf-accent)' }}
                >
                  Join Free Today
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <DefaultFooter />
    </div>
  );
}
