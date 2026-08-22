'use client';

// ─── Section Resolver ─────────────────────────────────────────────────────────
// Client component that maps a SectionConfig array to React components.
// Template-aware: sections may be customised per template via SECTION_OVERRIDES.
//
// Usage:
//   <SectionResolver
//     sections={pageLayout.sections}
//     theme={theme}
//     products={products}
//     collections={collections}
//     categories={categories}
//     templateSlug={theme.activeTemplateSlug}
//   />

import Link from 'next/link';
import type { ThemeConfig, Product, Collection, Category } from '@/lib/api/types';
import type { SectionConfig } from '@/lib/sections/types';

// ── Section Component Props ───────────────────────────────────────────────────

interface SectionProps {
  theme: ThemeConfig;
  products: Product[];
  collections: Collection[];
  categories: Category[];
}

// ── Hero Section ──────────────────────────────────────────────────────────────

function HeroSection({
  theme,
  config,
  products: _p,
  collections: _c,
  categories: _cat,
}: SectionProps & { config: Extract<SectionConfig, { type: 'hero' }>['config'] }) {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg,
          color-mix(in srgb, var(--sf-primary) 90%, black) 0%,
          color-mix(in srgb, var(--sf-secondary) 80%, black) 60%,
          color-mix(in srgb, var(--sf-accent) 70%, black) 100%)`,
        minHeight: '560px',
        backgroundImage: config.backgroundImage ? `url(${config.backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Decorative orbs */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-20 bg-white pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full opacity-10 bg-white pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 text-center lg:text-left">
          <span
            className="inline-block text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white' }}
          >
            New Season Arrivals
          </span>
          <h1 className="text-5xl lg:text-7xl font-bold text-white leading-none tracking-tight mb-6">
            {config.headline || 'Shop the Latest Drops'}
          </h1>
          {config.subheadline && (
            <p className="text-lg text-white/70 mb-10 max-w-xl leading-relaxed">
              {config.subheadline}
            </p>
          )}
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            <Link
              href={config.ctaHref || '/products'}
              className="px-8 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105"
              style={{ backgroundColor: 'white', color: 'var(--sf-primary)' }}
            >
              {config.ctaLabel || 'Shop Now'}
            </Link>
            {config.secondaryCtaLabel && (
              <Link
                href={config.secondaryCtaHref || '/collections'}
                className="px-8 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105"
                style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', border: '1.5px solid rgba(255,255,255,0.3)' }}
              >
                {config.secondaryCtaLabel}
              </Link>
            )}
          </div>
        </div>

        {/* Stats */}
        {config.stats && config.stats.length > 0 && (
          <div className="flex gap-8 lg:flex-col">
            {config.stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-white/60 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ── Trust Badges Section ───────────────────────────────────────────────────────

function TrustBadgesSection({
  config,
}: SectionProps & { config: Extract<SectionConfig, { type: 'trust-badges' }>['config'] }) {
  const DEFAULT_BADGES = [
    { icon: '🚚', title: 'Free Shipping',  desc: 'On orders over $50' },
    { icon: '↩️', title: 'Easy Returns',   desc: '30-day return policy' },
    { icon: '🔒', title: 'Secure Payment', desc: 'SSL encrypted checkout' },
    { icon: '💬', title: '24/7 Support',   desc: 'Always here to help' },
  ];
  const badges = config.badges || DEFAULT_BADGES;

  return (
    <section
      className="py-6 border-b"
      style={{ borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((badge) => (
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
  );
}

// ── Collections Section ───────────────────────────────────────────────────────

function CollectionsSection({
  collections,
  config,
}: SectionProps & { config: Extract<SectionConfig, { type: 'collections' }>['config'] }) {
  const limit = config.limit || 3;
  const featured = collections.filter((c) => c.featured).slice(0, limit);
  const display  = featured.length > 0 ? featured : collections.slice(0, limit);

  if (display.length === 0) return null;

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <div>
          <span className="text-xs font-semibold tracking-widest uppercase mb-2 block" style={{ color: 'var(--sf-primary)' }}>Explore</span>
          <h2 className="text-3xl font-bold" style={{ color: 'var(--sf-text)' }}>{config.title || 'Featured Collections'}</h2>
        </div>
        <Link href="/collections" className="text-sm font-medium hidden sm:flex items-center gap-1.5 transition-all hover:gap-2.5" style={{ color: 'var(--sf-primary)' }}>
          View All <span>→</span>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {display.map((collection, i) => (
          <Link
            key={collection.id}
            href={`/collections/${collection.slug}`}
            className={`group relative overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${i === 0 ? 'md:row-span-2' : ''}`}
            style={{ minHeight: i === 0 ? '400px' : '190px' }}
          >
            {collection.image ? (
              <img src={collection.image} alt={collection.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            ) : (
              <div className="absolute inset-0" style={{ background: `linear-gradient(${135 + i * 30}deg, color-mix(in srgb, var(--sf-primary) ${80 - i * 15}%, var(--sf-secondary)), color-mix(in srgb, var(--sf-accent) 60%, var(--sf-secondary)))` }} />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6">
              <h3 className="text-xl font-bold text-white mb-1">{collection.name}</h3>
              {collection.description && <p className="text-sm text-white/70 line-clamp-2">{collection.description}</p>}
              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-white/90 group-hover:text-white transition-colors">
                Shop Collection <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ── Categories Section ────────────────────────────────────────────────────────

function CategoriesSection({
  categories,
  config: _config,
}: SectionProps & { config: Extract<SectionConfig, { type: 'categories' }>['config'] }) {
  if (categories.length === 0) return null;

  return (
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
              style={{ color: 'var(--sf-text)', borderColor: 'color-mix(in srgb, var(--sf-text) 20%, transparent)' }}
            >
              {cat.icon && <span className="mr-1.5">{cat.icon}</span>}
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Featured Products Section ─────────────────────────────────────────────────

interface ProductCardMiniProps { product: Product; }

function ProductCardMini({ product }: ProductCardMiniProps) {
  const href = product.urlSlug ? `/products/${product.urlSlug}` : `/products/${product.id}`;
  const image = product.images?.[0] || product.image;
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <Link href={href} className="group block">
      <div
        className="relative overflow-hidden rounded-xl mb-3"
        style={{
          aspectRatio: '4/5',
          backgroundColor: 'color-mix(in srgb, var(--sf-text) 5%, var(--sf-bg))',
        }}
      >
        {image ? (
          <img src={image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">🛍️</div>
        )}
        {hasDiscount && (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{ backgroundColor: 'var(--sf-accent)' }}>
            Sale
          </span>
        )}
      </div>
      <h3 className="font-medium text-sm line-clamp-1 mb-1 group-hover:underline" style={{ color: 'var(--sf-text)' }}>
        {product.name}
      </h3>
      <div className="flex items-baseline gap-2">
        <span className="font-bold text-sm" style={{ color: 'var(--sf-primary)' }}>
          {product.price.toFixed(2)}
        </span>
        {hasDiscount && (
          <span className="text-xs line-through" style={{ color: 'color-mix(in srgb, var(--sf-text) 40%, transparent)' }}>
            {product.compareAtPrice!.toFixed(2)}
          </span>
        )}
      </div>
    </Link>
  );
}

function FeaturedProductsSection({
  products,
  config,
}: SectionProps & { config: Extract<SectionConfig, { type: 'featured-products' }>['config'] }) {
  // Filter to collection/category if specified
  let displayProducts = products;
  if (config.collection) {
    displayProducts = products.filter((p) => p.collectionName?.toLowerCase() === config.collection?.toLowerCase());
  }
  if (config.category) {
    displayProducts = displayProducts.filter((p) => p.categoryName?.toLowerCase() === config.category?.toLowerCase());
  }
  const limit = config.limit || 12;
  displayProducts = displayProducts.slice(0, limit);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <div>
          {config.subtitle && (
            <span className="text-xs font-semibold tracking-widest uppercase mb-2 block" style={{ color: 'var(--sf-primary)' }}>
              {config.subtitle}
            </span>
          )}
          <h2 className="text-3xl font-bold" style={{ color: 'var(--sf-text)' }}>
            {config.title || 'Featured Products'}
          </h2>
        </div>
        {config.viewAllHref && (
          <Link href={config.viewAllHref} className="text-sm font-medium hidden sm:flex items-center gap-1.5 transition-all hover:gap-2.5" style={{ color: 'var(--sf-primary)' }}>
            View All <span>→</span>
          </Link>
        )}
      </div>

      {displayProducts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-lg" style={{ color: 'color-mix(in srgb, var(--sf-text) 40%, transparent)' }}>Products coming soon…</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayProducts.map((product) => (
            <ProductCardMini key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

// ── Banner Section ────────────────────────────────────────────────────────────

function BannerSection({
  config,
}: SectionProps & { config: Extract<SectionConfig, { type: 'banner' }>['config'] }) {
  const bgStyle = config.variant === 'dark'
    ? { background: '#111827' }
    : config.variant === 'accent'
      ? { background: `linear-gradient(120deg, var(--sf-accent), color-mix(in srgb, var(--sf-accent) 60%, var(--sf-primary)))` }
      : { background: `linear-gradient(120deg, var(--sf-primary), color-mix(in srgb, var(--sf-primary) 60%, var(--sf-secondary)))` };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div
        className="max-w-7xl mx-auto rounded-3xl overflow-hidden relative"
        style={{ ...bgStyle, minHeight: '240px', ...(config.backgroundImage ? { backgroundImage: `url(${config.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}) }}
      >
        {config.backgroundImage && <div className="absolute inset-0 bg-black/40" />}
        <div className="relative flex items-center justify-center p-10 text-center" style={{ minHeight: '240px' }}>
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">{config.title || 'Members get more'}</h2>
            {config.description && (
              <p className="text-white/80 mb-8 max-w-md mx-auto">{config.description}</p>
            )}
            {config.ctaLabel && (
              <Link
                href={config.ctaHref || '/auth/signup'}
                className="inline-block px-8 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105"
                style={{ backgroundColor: 'white', color: config.variant === 'accent' ? 'var(--sf-accent)' : 'var(--sf-primary)' }}
              >
                {config.ctaLabel}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Testimonials Section ──────────────────────────────────────────────────────

function TestimonialsSection({
  config,
}: SectionProps & { config: Extract<SectionConfig, { type: 'testimonials' }>['config'] }) {
  const testimonials = config.testimonials || [];
  if (testimonials.length === 0) return null;

  return (
    <section
      className="py-16 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: 'color-mix(in srgb, var(--sf-text) 3%, var(--sf-bg))' }}
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--sf-text)' }}>
          {config.title || 'What our customers say'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="rounded-2xl p-6 border"
              style={{
                backgroundColor: 'var(--sf-bg)',
                borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)',
              }}
            >
              <div className="flex mb-3">
                {[...Array(5)].map((_, star) => (
                  <span key={star} style={{ color: star < t.rating ? 'var(--sf-accent)' : 'color-mix(in srgb, var(--sf-text) 20%, transparent)' }}>★</span>
                ))}
              </div>
              <p className="text-sm leading-relaxed mb-4 line-clamp-3" style={{ color: 'var(--sf-text)' }}>"{t.text}"</p>
              <div className="flex items-center gap-3">
                {t.avatar ? (
                  <img src={t.avatar} alt={t.name} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: 'var(--sf-primary)' }}>
                    {t.name[0]}
                  </div>
                )}
                <span className="text-sm font-semibold" style={{ color: 'var(--sf-text)' }}>{t.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Newsletter Section ────────────────────────────────────────────────────────

function NewsletterSection({
  config,
}: SectionProps & { config: Extract<SectionConfig, { type: 'newsletter' }>['config'] }) {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div
        className="max-w-2xl mx-auto text-center rounded-3xl p-12 border"
        style={{ borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)' }}
      >
        <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--sf-text)' }}>
          {config.title || 'Stay in the loop'}
        </h2>
        {config.description && (
          <p className="mb-8" style={{ color: 'color-mix(in srgb, var(--sf-text) 55%, transparent)' }}>
            {config.description}
          </p>
        )}
        <form className="flex gap-2 max-w-sm mx-auto" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder={config.placeholder || 'Enter your email'}
            className="sf-input flex-1 px-4 py-3 text-sm"
          />
          <button
            type="submit"
            className="btn-primary px-5 py-3 text-sm font-semibold rounded-xl"
          >
            {config.ctaLabel || 'Subscribe'}
          </button>
        </form>
      </div>
    </section>
  );
}

// ── Spacer Section ────────────────────────────────────────────────────────────

function SpacerSection({ config }: { config: Extract<SectionConfig, { type: 'spacer' }>['config'] }) {
  return <div style={{ height: config.height || 32 }} aria-hidden />;
}

// ── Section Resolver ──────────────────────────────────────────────────────────

interface SectionResolverProps extends SectionProps {
  sections: SectionConfig[];
  templateSlug?: string | null;
}

/**
 * Renders an ordered list of CMS section configs into React components.
 * Template-aware: future per-template section overrides can be added via
 * SECTION_OVERRIDES[templateSlug].
 */
export function SectionResolver({ sections, theme, products, collections, categories }: SectionResolverProps) {
  const commonProps: SectionProps = { theme, products, collections, categories };

  return (
    <>
      {sections.map((section, index) => {
        const key = `${section.type}-${index}`;

        switch (section.type) {
          case 'hero':
            return <HeroSection key={key} {...commonProps} config={section.config} />;

          case 'trust-badges':
            return <TrustBadgesSection key={key} {...commonProps} config={section.config} />;

          case 'collections':
            return <CollectionsSection key={key} {...commonProps} config={section.config} />;

          case 'categories':
            return <CategoriesSection key={key} {...commonProps} config={section.config} />;

          case 'featured-products':
            return <FeaturedProductsSection key={key} {...commonProps} config={section.config} />;

          case 'banner':
            return <BannerSection key={key} {...commonProps} config={section.config} />;

          case 'testimonials':
            return <TestimonialsSection key={key} {...commonProps} config={section.config} />;

          case 'newsletter':
            return <NewsletterSection key={key} {...commonProps} config={section.config} />;

          case 'spacer':
            return <SpacerSection key={key} config={section.config} />;

          default:
            // Unknown section type — skip silently in production, warn in dev
            if (process.env.NODE_ENV === 'development') {
              console.warn(`[SectionResolver] Unknown section type: ${(section as { type: string }).type}`);
            }
            return null;
        }
      })}
    </>
  );
}
