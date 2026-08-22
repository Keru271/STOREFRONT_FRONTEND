// ─── All CMS Pages Index — /pages ───────────────────────────────────────────

import type { Metadata } from 'next';
import Link from 'next/link';
import { getTheme } from '@/lib/api/theme';
import { getPages } from '@/lib/api/catalog';
import { TemplateLayout } from '@/components/shared/TemplateLayout';

export async function generateMetadata(): Promise<Metadata> {
  const theme = await getTheme();
  return {
    title: `Pages & Information | ${theme.storeName}`,
    description: `Explore all informational and custom pages for ${theme.storeName}.`,
  };
}

export default async function PagesIndexPage() {
  const [theme, pages] = await Promise.all([
    getTheme(),
    getPages(),
  ]);

  const customPages = pages.filter((p) => p.pageType === 'CUSTOM' || p.pageType === 'BRAND');
  const policyPages = pages.filter((p) => p.pageType === 'POLICY');

  return (
    <TemplateLayout theme={theme}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <header className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span
            className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full text-white inline-block"
            style={{ backgroundColor: 'var(--sf-primary)' }}
          >
            INFORMATION DIRECTORY
          </span>
          <h1 className="text-4xl sm:text-5xl font-black font-heading tracking-tight" style={{ color: 'var(--sf-text)' }}>
            Store Pages & Policies
          </h1>
          <p className="text-base opacity-70">
            Find answers, policies, brand stories, and custom guides for {theme.storeName}.
          </p>
        </header>

        {/* Custom Pages Grid */}
        <section className="mb-14">
          <h2 className="text-xl font-bold font-heading mb-6 pb-2 border-b border-slate-200/40">
            Company & Community Pages
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {customPages.map((page) => {
              const href = page.slug.startsWith('/') ? page.slug : `/pages/${page.slug}`;
              return (
                <Link
                  key={page.id}
                  href={href}
                  className="group p-6 rounded-3xl border border-slate-200/50 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
                  style={{
                    backgroundColor: 'var(--sf-bg)',
                    borderRadius: 'var(--sf-radius)',
                  }}
                >
                  <div className="space-y-2">
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider block"
                      style={{ color: 'var(--sf-primary)' }}
                    >
                      {page.pageType}
                    </span>
                    <h3 className="font-bold text-base font-heading group-hover:underline">
                      {page.title}
                    </h3>
                    {page.metaDescription && (
                      <p className="text-xs opacity-70 line-clamp-2 leading-relaxed">
                        {page.metaDescription}
                      </p>
                    )}
                  </div>
                  <span className="text-xs font-bold mt-4 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform" style={{ color: 'var(--sf-primary)' }}>
                    Read Page →
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Policies Grid */}
        {policyPages.length > 0 && (
          <section>
            <h2 className="text-xl font-bold font-heading mb-6 pb-2 border-b border-slate-200/40">
              Legal & Customer Policies
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {policyPages.map((page) => {
                const href = page.slug.startsWith('/') ? page.slug : `/policies/${page.slug}`;
                return (
                  <Link
                    key={page.id}
                    href={href}
                    className="p-5 rounded-2xl border border-slate-200/50 hover:shadow-md transition flex flex-col justify-between"
                    style={{
                      backgroundColor: 'color-mix(in srgb, var(--sf-primary) 3%, var(--sf-bg))',
                      borderRadius: 'var(--sf-radius)',
                    }}
                  >
                    <div>
                      <span className="text-lg mb-1 block">📜</span>
                      <h4 className="font-bold text-sm font-heading">{page.title}</h4>
                    </div>
                    <span className="text-[11px] font-bold mt-3" style={{ color: 'var(--sf-primary)' }}>
                      View Terms →
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </TemplateLayout>
  );
}
