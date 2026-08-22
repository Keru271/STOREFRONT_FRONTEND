// ─── Collections Index — /collections ────────────────────────────────────────
// Server Component (ISR 300s). Lists all collections in a grid.

import type { Metadata } from 'next';
import Link from 'next/link';
import { getTheme } from '@/lib/api/theme';
import { getCollections } from '@/lib/api/catalog';

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const theme = await getTheme();
  return {
    title: 'Collections',
    description: `Browse all curated collections at ${theme.storeName}.`,
    openGraph: {
      title: `Collections — ${theme.storeName}`,
      description: `Browse all curated collections at ${theme.storeName}.`,
    },
  };
}

export default async function CollectionsPage() {
  const [theme, collections] = await Promise.all([getTheme(), getCollections()]);

  const featured   = collections.filter((c) => c.featured);
  const rest       = collections.filter((c) => !c.featured);
  const allSorted  = [...featured, ...rest];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--sf-bg)' }}>

      {/* ── Page Hero ──────────────────────────────────────────────────────── */}
      <section
        className="py-20 px-4 text-center"
        style={{
          background: `linear-gradient(135deg,
            color-mix(in srgb, var(--sf-primary) 10%, var(--sf-bg)) 0%,
            var(--sf-bg) 100%)`,
        }}
      >
        <span
          className="inline-block text-xs font-semibold tracking-widest uppercase mb-4 px-4 py-1.5 rounded-full"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--sf-primary) 12%, transparent)',
            color: 'var(--sf-primary)',
          }}
        >
          Curated Picks
        </span>
        <h1
          className="text-4xl lg:text-5xl font-bold mb-4"
          style={{ color: 'var(--sf-text)' }}
        >
          All Collections
        </h1>
        <p
          className="text-lg max-w-xl mx-auto"
          style={{ color: 'color-mix(in srgb, var(--sf-text) 55%, transparent)' }}
        >
          Handpicked selections crafted for every style, season, and story.
        </p>
      </section>

      {/* ── Collections Grid ───────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {allSorted.length === 0 ? (
          <div className="text-center py-24">
            <p
              className="text-lg"
              style={{ color: 'color-mix(in srgb, var(--sf-text) 40%, transparent)' }}
            >
              No collections yet — check back soon.
            </p>
            <Link
              href="/products"
              className="mt-6 inline-block px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:scale-105"
              style={{ backgroundColor: 'var(--sf-primary)' }}
            >
              Shop All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allSorted.map((collection, i) => (
              <Link
                key={collection.id}
                href={`/collections/${collection.slug}`}
                className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                style={{ minHeight: '260px' }}
              >
                {/* Background */}
                {collection.image ? (
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(${130 + i * 25}deg,
                        color-mix(in srgb, var(--sf-primary) ${85 - i * 8}%, var(--sf-secondary)),
                        color-mix(in srgb, var(--sf-accent) 55%, var(--sf-secondary)))`,
                    }}
                  />
                )}
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Featured badge */}
                {collection.featured && (
                  <div className="absolute top-4 left-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-sm">
                      Featured
                    </span>
                  </div>
                )}

                {/* Collection type badge */}
                <div className="absolute top-4 right-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-black/30 text-white/80 backdrop-blur-sm capitalize">
                    {collection.type}
                  </span>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h2 className="text-xl font-bold text-white mb-1">{collection.name}</h2>
                  {collection.description && (
                    <p className="text-sm text-white/70 line-clamp-2 mb-3">
                      {collection.description}
                    </p>
                  )}
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-white/90 group-hover:text-white transition-all group-hover:gap-2.5">
                    Shop Collection <span className="transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
