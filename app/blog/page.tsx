// ─── Storefront Blog Index (/blog) ─────────────────────────────────────────────
import { Metadata } from 'next';
import Link from 'next/link';
import { getTheme } from '@/lib/api/theme';
import { getBlogPosts } from '@/lib/api/catalog';
import { Calendar, User, Clock, ArrowRight, BookOpen, Tag, Sparkles } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  const theme = await getTheme();
  return {
    title: `Journal & Stories | ${theme.storeName}`,
    description: `Discover styling tips, product guides, stories, and the latest trends from ${theme.storeName}.`,
    openGraph: {
      title: `Journal & Stories | ${theme.storeName}`,
      description: `Explore the editorial journal and stories at ${theme.storeName}.`,
    },
  };
}

interface BlogIndexProps {
  searchParams: Promise<{
    category?: string;
    tag?: string;
    search?: string;
  }>;
}

export default async function BlogIndexPage({ searchParams }: BlogIndexProps) {
  const params = await searchParams;
  const [theme, posts] = await Promise.all([
    getTheme(),
    getBlogPosts(params),
  ]);

  const activeCategory = params.category || 'ALL';
  const categories = ['ALL', ...Array.from(new Set(posts.map((p) => p.category).filter((c): c is string => Boolean(c))))];

  const featuredPost = posts[0];
  const regularPosts = posts.slice(1);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Editorial & Stories
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            The {theme.storeName} Journal
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
            Inspiring designs, in-depth craftsmanship stories, sustainable living guides, and seasonal curation.
          </p>
        </div>

        {/* Category Filter Pills */}
        {categories.length > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <Link
                key={cat}
                href={cat === 'ALL' ? '/blog' : `/blog?category=${encodeURIComponent(cat)}`}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  activeCategory === cat
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {cat === 'ALL' ? 'All Stories' : cat}
              </Link>
            ))}
          </div>
        )}

        {posts.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
            <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No articles found</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Check back soon for new stories, trend reports, and product guides.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Featured Post Card */}
            {featuredPost && (
              <div className="group relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-0">
                <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto overflow-hidden bg-slate-100 dark:bg-slate-800 min-h-[300px]">
                  {featuredPost.featuredImage ? (
                    <img
                      src={featuredPost.featuredImage}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <BookOpen className="w-12 h-12" />
                    </div>
                  )}
                  {featuredPost.category && (
                    <span className="absolute top-4 left-4 px-3 py-1 bg-black/70 backdrop-blur-md text-white text-xs font-semibold rounded-lg shadow-sm">
                      {featuredPost.category}
                    </span>
                  )}
                </div>

                <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        {featuredPost.author || 'Store Editorial'}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(featuredPost.publishedAt || featuredPost.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition leading-tight">
                      <Link href={`/blog/${featuredPost.slug}`}>{featuredPost.title}</Link>
                    </h2>

                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      {featuredPost.excerpt ||
                        featuredPost.content.replace(/<[^>]*>?/gm, '').slice(0, 180) + '...'}
                    </p>

                    {featuredPost.tags && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {featuredPost.tags
                          .split(',')
                          .map((t) => t.trim())
                          .filter(Boolean)
                          .map((tag) => (
                            <span
                              key={tag}
                              className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium"
                            >
                              #{tag}
                            </span>
                          ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <Link
                      href={`/blog/${featuredPost.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:gap-3 transition-all"
                    >
                      Read Full Article
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> 4 min read
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Grid of Regular Posts */}
            {regularPosts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularPosts.map((post) => (
                  <article
                    key={post.id}
                    className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                        {post.featuredImage ? (
                          <img
                            src={post.featuredImage}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <BookOpen className="w-8 h-8" />
                          </div>
                        )}
                        {post.category && (
                          <span className="absolute top-3 left-3 px-2.5 py-1 bg-black/70 backdrop-blur-md text-white text-[11px] font-semibold rounded-lg">
                            {post.category}
                          </span>
                        )}
                      </div>

                      <div className="p-6 space-y-3">
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <span>{post.author || 'Store Editorial'}</span>
                          <span>•</span>
                          <span>
                            {new Date(post.publishedAt || post.createdAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>

                        <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition line-clamp-2">
                          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                        </h3>

                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {post.excerpt || post.content.replace(/<[^>]*>?/gm, '').slice(0, 110) + '...'}
                        </p>
                      </div>
                    </div>

                    <div className="px-6 py-4 bg-slate-50/60 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-xs font-bold text-indigo-600 dark:text-indigo-400 inline-flex items-center gap-1.5 group-hover:underline"
                      >
                        Read Article <ArrowRight className="w-3 h-3" />
                      </Link>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> 3 min
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
