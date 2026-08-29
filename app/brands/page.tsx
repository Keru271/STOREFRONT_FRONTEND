// ─── Brands Directory — /brands ──────────────────────────────────────────
// Server Component (SSR). Displays all brand partners and manufacturers.

import type { Metadata } from 'next';
import Link from 'next/link';
import { getTheme } from '@/lib/api/theme';
import { getBrands } from '@/lib/api/catalog';
import { Building2, ArrowRight, ShoppingBag, ExternalLink, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const theme = await getTheme();
  return {
    title: `All Brands & Makers | ${theme.storeName}`,
    description: `Explore all official brand partners, designers, and manufacturers at ${theme.storeName}.`,
    openGraph: {
      title: `Brand Directory | ${theme.storeName}`,
      description: `Browse authentic products from leading brands at ${theme.storeName}.`,
    },
  };
}

export default async function BrandsPage() {
  const [theme, brands] = await Promise.all([getTheme(), getBrands()]);

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-100 dark:border-indigo-900/50">
            <Sparkles className="w-3.5 h-3.5" />
            Curated Makers & Designers
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Explore All Brands
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Shop directly from our world-class brand partners, verified artisans, and premier product designers.
          </p>
        </div>

        {/* Brands Grid */}
        {brands.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 max-w-md mx-auto space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mx-auto">
              <Building2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No brands found</h3>
            <p className="text-xs text-slate-500">Brands will appear here once added in the CMS admin studio.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {brands.map((brand) => {
              const brandSlug = brand.slug || brand.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
              return (
                <div
                  key={brand.id || brandSlug}
                  className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 flex flex-col justify-between hover:shadow-xl hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="space-y-4">
                    {/* Brand Logo or Monogram */}
                    <div className="flex items-center justify-between">
                      <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-center p-2.5 overflow-hidden group-hover:scale-105 transition-transform">
                        {brand.logo ? (
                          <img
                            src={brand.logo}
                            alt={brand.name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <span className="text-xl font-black text-slate-700 dark:text-slate-300">
                            {brand.name.slice(0, 2).toUpperCase()}
                          </span>
                        )}
                      </div>
                      {brand.website && (
                        <a
                          href={brand.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={`Visit official ${brand.name} website`}
                          className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>

                    {/* Brand Name & Description */}
                    <div>
                      <h2 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {brand.name}
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                        {brand.description || `Discover authentic products and collections from ${brand.name}.`}
                      </p>
                    </div>
                  </div>

                  {/* Explore Link */}
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <Link
                      href={`/brands/${brandSlug}`}
                      className="inline-flex items-center justify-between w-full py-2.5 px-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 group-hover:bg-indigo-600 text-slate-800 dark:text-slate-200 group-hover:text-white text-xs font-bold transition-all"
                    >
                      <span>Explore Collection</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
