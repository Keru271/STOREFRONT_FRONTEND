'use client';

import React from 'react';
import Link from 'next/link';
import type { CmsPage, ThemeConfig } from '@/lib/api/types';
import { TemplateLayout } from './TemplateLayout';

interface CmsPageRendererProps {
  page: CmsPage;
  theme: ThemeConfig;
}

export function CmsPageRenderer({ page, theme }: CmsPageRendererProps) {
  // Parse content — could be plain text, HTML, or JSON blocks
  const renderContent = () => {
    if (!page.content) {
      return (
        <p className="text-slate-500 italic">
          This page does not have any content yet. Please update it in the CMS.
        </p>
      );
    }

    const trimmed = page.content.trim();

    // Check if content is a JSON structure (e.g. page builder blocks)
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        // If it's a hero object
        if (parsed.hero) {
          return (
            <div className="space-y-6">
              {parsed.hero.title && (
                <h2 className="text-2xl font-bold font-heading">{parsed.hero.title}</h2>
              )}
              {parsed.hero.subtitle && (
                <p className="text-base text-slate-600 leading-relaxed">{parsed.hero.subtitle}</p>
              )}
              {parsed.sections && Array.isArray(parsed.sections) && (
                <div className="space-y-8 mt-8">
                  {parsed.sections.map((sec: any, idx: number) => (
                    <div key={idx} className="p-6 rounded-2xl border border-slate-100 bg-white/50 space-y-2">
                      {sec.heading && <h3 className="text-xl font-bold font-heading">{sec.heading}</h3>}
                      {sec.body && <p className="text-slate-700 leading-relaxed">{sec.body}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        }
      } catch {
        // Fall back to normal rendering if JSON parse fails
      }
    }

    // Check if content contains HTML tags
    const containsHtml = /<[a-z][\s\S]*>/i.test(trimmed);

    if (containsHtml) {
      return (
        <div
          className="prose prose-slate max-w-none prose-headings:font-heading prose-headings:font-bold prose-a:text-[var(--sf-primary)] prose-img:rounded-2xl"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      );
    }

    // Regular formatted plain-text with paragraphs
    return (
      <div className="space-y-4 text-base leading-relaxed opacity-90">
        {trimmed.split(/\n\s*\n/).map((para, idx) => (
          <p key={idx} className="leading-relaxed">
            {para}
          </p>
        ))}
      </div>
    );
  };

  const formattedDate = page.updatedAt
    ? new Date(page.updatedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <TemplateLayout theme={theme}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs opacity-60 mb-8 font-medium">
          <Link href="/" className="hover:opacity-100 transition">
            Home
          </Link>
          <span>/</span>
          <span className="opacity-75">{page.pageType === 'POLICY' ? 'Policies' : 'Pages'}</span>
          <span>/</span>
          <span className="opacity-100 font-semibold" style={{ color: 'var(--sf-primary)' }}>
            {page.title}
          </span>
        </nav>

        {/* Page Header */}
        <header className="mb-10 pb-8 border-b border-slate-200/50">
          <div className="flex items-center gap-3 mb-3">
            <span
              className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full text-white"
              style={{ backgroundColor: 'var(--sf-primary)' }}
            >
              {page.pageType || 'PAGE'}
            </span>
            {formattedDate && (
              <span className="text-xs opacity-50">Last updated on {formattedDate}</span>
            )}
          </div>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight font-heading"
            style={{ color: 'var(--sf-text)' }}
          >
            {page.title}
          </h1>
          {page.metaDescription && (
            <p className="text-base sm:text-lg opacity-70 mt-3 leading-relaxed">
              {page.metaDescription}
            </p>
          )}
        </header>

        {/* Main Content Area */}
        <article
          className="p-6 sm:p-10 rounded-3xl border border-slate-200/40 shadow-sm"
          style={{
            backgroundColor: 'var(--sf-bg)',
            borderRadius: 'var(--sf-radius)',
          }}
        >
          {renderContent()}
        </article>

        {/* Bottom CTA / Support Bar */}
        <div
          className="mt-12 p-8 rounded-3xl border border-slate-200/40 flex flex-col sm:flex-row items-center justify-between gap-6"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--sf-primary) 5%, var(--sf-bg))',
            borderRadius: 'var(--sf-radius)',
          }}
        >
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-bold text-base font-heading">Have questions or need assistance?</h4>
            <p className="text-xs opacity-70">
              Our support team is always ready to help you with orders and inquiries.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {theme.contactEmail && (
              <a
                href={`mailto:${theme.contactEmail}`}
                className="px-5 py-2.5 text-white text-xs font-bold rounded-xl shadow transition"
                style={{ backgroundColor: 'var(--sf-primary)', borderRadius: 'var(--sf-radius)' }}
              >
                Contact Support
              </a>
            )}
            <Link
              href="/products"
              className="px-5 py-2.5 text-xs font-bold rounded-xl border border-slate-300/40 transition"
              style={{ backgroundColor: 'var(--sf-bg)', borderRadius: 'var(--sf-radius)' }}
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </TemplateLayout>
  );
}
