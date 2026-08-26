// ─── Storefront Blog Article Detail (/blog/[slug]) ───────────────────────────
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTheme } from '@/lib/api/theme';
import { getBlogPost, getBlogPosts } from '@/lib/api/catalog';
import {
  Calendar,
  User,
  Clock,
  ArrowLeft,
  Share2,
  Tag,
  BookOpen,
  ShoppingBag,
  Sparkles,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface BlogDetailProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BlogDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const [theme, post] = await Promise.all([getTheme(), getBlogPost(slug)]);

  if (!post) {
    return { title: 'Article Not Found' };
  }

  const title = post.metaTitle || `${post.title} | ${theme.storeName}`;
  const description =
    post.metaDescription ||
    post.excerpt ||
    `Read ${post.title} on the ${theme.storeName} editorial journal.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: post.publishedAt || post.createdAt,
      authors: [post.author || 'Store Editorial'],
      images: post.ogImage || post.featuredImage ? [post.ogImage || post.featuredImage!] : undefined,
    },
    alternates: {
      canonical: post.canonicalUrl || undefined,
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailProps) {
  const { slug } = await params;
  const [theme, post, allPosts] = await Promise.all([
    getTheme(),
    getBlogPost(slug),
    getBlogPosts(),
  ]);

  if (!post) {
    notFound();
  }

  const relatedPosts = allPosts
    .filter((p) => p.slug !== post.slug && (p.category === post.category || true))
    .slice(0, 3);

  // JSON-LD Article Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || post.metaDescription,
    image: post.featuredImage || undefined,
    author: {
      '@type': 'Person',
      name: post.author || 'Store Editorial',
    },
    publisher: {
      '@type': 'Organization',
      name: theme.storeName,
      logo: {
        '@type': 'ImageObject',
        url: theme.logo || undefined,
      },
    },
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt || post.createdAt,
  };

  return (
    <article className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      {/* Schema.org Script Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Journal
          </Link>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Link href="/" className="hover:underline">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/blog" className="hover:underline">Journal</Link>
            {post.category && (
              <>
                <ChevronRight className="w-3 h-3" />
                <span className="text-slate-600 dark:text-slate-300 font-medium">{post.category}</span>
              </>
            )}
          </div>
        </div>

        {/* Article Header */}
        <header className="space-y-4 text-center sm:text-left">
          {post.category && (
            <span className="inline-block px-3.5 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 text-xs font-bold rounded-lg uppercase tracking-wider">
              {post.category}
            </span>
          )}

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400 pt-2 border-b border-slate-100 dark:border-slate-800 pb-6">
            <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-200">
              <User className="w-4 h-4 text-indigo-500" />
              {post.author || 'Store Editorial'}
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {new Date(post.publishedAt || post.createdAt).toLocaleDateString(undefined, {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              4 min read
            </div>
          </div>
        </header>

        {/* Hero Featured Image */}
        {post.featuredImage && (
          <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden shadow-lg bg-slate-100 dark:bg-slate-800">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Article Body Content */}
        <div className="prose prose-slate dark:prose-invert max-w-none prose-lg prose-headings:font-bold prose-headings:tracking-tight prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-img:rounded-2xl leading-relaxed">
          {post.content.split('\n').map((paragraph, idx) => {
            const trimmed = paragraph.trim();
            if (!trimmed) return null;
            if (trimmed.startsWith('## ')) {
              return (
                <h2 key={idx} className="text-2xl sm:text-3xl font-bold mt-8 mb-4 text-slate-900 dark:text-white">
                  {trimmed.replace('## ', '')}
                </h2>
              );
            }
            if (trimmed.startsWith('### ')) {
              return (
                <h3 key={idx} className="text-xl sm:text-2xl font-bold mt-6 mb-3 text-slate-900 dark:text-white">
                  {trimmed.replace('### ', '')}
                </h3>
              );
            }
            if (trimmed.startsWith('> ')) {
              return (
                <blockquote
                  key={idx}
                  className="p-4 my-4 bg-slate-50 dark:bg-slate-900 border-l-4 border-indigo-500 rounded-r-xl italic text-slate-700 dark:text-slate-300"
                >
                  {trimmed.replace('> ', '')}
                </blockquote>
              );
            }
            if (trimmed.startsWith('- ')) {
              return (
                <li key={idx} className="ml-4 list-disc text-slate-700 dark:text-slate-300 mb-1">
                  {trimmed.replace('- ', '')}
                </li>
              );
            }
            return (
              <p key={idx} className="text-slate-700 dark:text-slate-300 leading-relaxed my-4 text-base sm:text-lg">
                {trimmed}
              </p>
            );
          })}
        </div>

        {/* Tags & Social Sharing Footer */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          {post.tags ? (
            <div className="flex flex-wrap items-center gap-2">
              <Tag className="w-4 h-4 text-slate-400" />
              {post.tags.split(',').map((t) => t.trim()).filter(Boolean).map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-lg"
                >
                  #{tag}
                </span>
              ))}
            </div>
          ) : <div />}

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5" /> Share
            </span>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg transition"
            >
              Twitter / X
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg transition"
            >
              LinkedIn
            </a>
          </div>
        </div>

        {/* Shoppable Featured Products inside Article */}
        {post.relatedProducts && post.relatedProducts.length > 0 && (
          <section className="pt-10 border-t border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-indigo-500" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Featured in this Story
                </h3>
              </div>
              <span className="text-xs text-slate-500">Curated by our editors</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {post.relatedProducts.map((prod) => (
                <Link
                  key={prod.id}
                  href={`/products/${prod.urlSlug || prod.id}`}
                  className="group bg-slate-50 dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-md transition flex flex-col justify-between"
                >
                  <div className="aspect-square bg-white dark:bg-slate-800 rounded-xl overflow-hidden mb-2.5">
                    {prod.images && (Array.isArray(prod.images) ? prod.images.length > 0 : Boolean(prod.images)) ? (
                      <img
                        src={Array.isArray(prod.images) ? prod.images[0] : (prod.images as string).split(',')[0].trim()}
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <ShoppingBag className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 transition">
                      {prod.name}
                    </h4>
                    <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                      {theme.currency || '$'}{prod.price.toFixed(2)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Related Stories */}
        {relatedPosts.length > 0 && (
          <section className="pt-12 border-t border-slate-200 dark:border-slate-800 space-y-6">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              More Stories from the Journal
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {relatedPosts.map((rPost) => (
                <Link
                  key={rPost.id}
                  href={`/blog/${rPost.slug}`}
                  className="group bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-md transition block space-y-3"
                >
                  <div className="aspect-[16/10] bg-slate-200 dark:bg-slate-800 rounded-xl overflow-hidden">
                    {rPost.featuredImage ? (
                      <img
                        src={rPost.featuredImage}
                        alt={rPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <BookOpen className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition line-clamp-2">
                    {rPost.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {rPost.excerpt || rPost.content.slice(0, 80) + '...'}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
