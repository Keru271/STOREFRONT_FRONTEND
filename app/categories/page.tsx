// ─── Categories Directory — /categories ─────────────────────────────────────
import type { Metadata } from 'next';
import Link from 'next/link';
import { getTheme } from '@/lib/api/theme';
import { getCategories } from '@/lib/api/catalog';
import { FolderTree, ArrowRight, ShoppingBag } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  const theme = await getTheme();
  return {
    title: `All Categories | ${theme.storeName}`,
    description: `Browse all departments and product categories at ${theme.storeName}.`,
  };
}

export default async function CategoriesPage() {
  const [theme, categories] = await Promise.all([getTheme(), getCategories()]);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/70 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <FolderTree className="w-3.5 h-3.5" />
            Departments & Taxonomy
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Explore All Categories
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Find exactly what you are looking for by exploring our curated collections and department categories.
          </p>
        </div>

        {/* Categories Grid */}
        {categories.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
            <ShoppingBag className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No categories found</h3>
            <p className="text-sm text-slate-500 mt-1">Categories will appear here once added in the CMS.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 text-center flex flex-col items-center justify-between hover:shadow-lg hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">
                  {cat.icon || '📦'}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition truncate w-full">
                    {cat.name}
                  </h3>
                  {cat.description && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                      {cat.description}
                    </p>
                  )}
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 w-full flex items-center justify-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 opacity-80 group-hover:opacity-100 group-hover:gap-1.5 transition-all">
                  Browse <ArrowRight className="w-3 h-3 ml-1" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
