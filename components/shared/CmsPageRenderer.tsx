'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { CmsPage, ThemeConfig } from '@/lib/api/types';
import { TemplateLayout } from './TemplateLayout';

// Lightweight inline SVG icons
function ChevronDownIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function StarIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

function CheckCircleIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function ArrowRightIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  );
}

interface CmsPageRendererProps {
  page: CmsPage;
  theme: ThemeConfig;
}

export function CmsPageRenderer({ page, theme }: CmsPageRendererProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  // Render dynamic PageBuilder blocks or HTML/plain text
  const renderContent = () => {
    if (!page.content) {
      return (
        <p className="text-slate-500 italic">
          This page does not have any content yet. Please update it in the CMS.
        </p>
      );
    }

    const trimmed = page.content.trim();

    // 1. Try parsing structured JSON (PageBuilder blocks or structured page object)
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);

        // Case A: Array of PageBuilder blocks
        if (Array.isArray(parsed)) {
          return (
            <div className="space-y-12">
              {parsed.map((block: any, idx: number) => {
                if (block.isVisible === false) return null;

                switch (block.type) {
                  case 'hero':
                    return (
                      <div
                        key={block.id || idx}
                        className={`relative rounded-3xl overflow-hidden shadow-lg text-${block.data?.textAlign || 'center'}`}
                        style={{
                          backgroundImage: block.data?.backgroundImage
                            ? `linear-gradient(rgba(0,0,0,${(block.data?.overlayOpacity || 50) / 100}), rgba(0,0,0,${(block.data?.overlayOpacity || 50) / 100})), url(${block.data?.backgroundImage})`
                            : `linear-gradient(135deg, var(--sf-primary) 0%, var(--sf-accent) 100%)`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          minHeight: block.data?.minHeight || '420px',
                          color: '#ffffff',
                        }}
                      >
                        <div className="relative z-10 flex flex-col items-center justify-center h-full min-h-[420px] p-8 sm:p-16">
                          <div className="max-w-2xl mx-auto space-y-5">
                            <h1 className="text-3xl sm:text-5xl font-extrabold font-heading leading-tight tracking-tight">
                              {block.data?.headline || block.data?.title || 'Welcome'}
                            </h1>
                            {block.data?.subtitle && (
                              <p className="text-base sm:text-lg opacity-90 leading-relaxed max-w-xl mx-auto">
                                {block.data.subtitle}
                              </p>
                            )}
                            <div className={`pt-2 flex flex-wrap gap-3 justify-${block.data?.textAlign === 'left' ? 'start' : block.data?.textAlign === 'right' ? 'end' : 'center'}`}>
                              {block.data?.buttonText && (
                                <Link href={block.data?.buttonUrl || '/products'} className="px-7 py-3.5 rounded-xl bg-white text-slate-900 font-bold text-sm shadow hover:bg-slate-100 transition">
                                  {block.data.buttonText}
                                </Link>
                              )}
                              {block.data?.secondaryButtonText && (
                                <Link href={block.data?.secondaryButtonUrl || '/collections'} className="px-7 py-3.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-sm backdrop-blur-sm transition">
                                  {block.data.secondaryButtonText}
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );

                  case 'value_props':
                    return (
                      <div key={block.id || idx} className="space-y-8">
                        {block.data?.heading && (
                          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-center">
                            {block.data.heading}
                          </h2>
                        )}
                        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${block.data?.columns || 4} gap-5`}>
                          {(block.data?.features || []).map((feat: any, fIdx: number) => (
                            <div key={fIdx} className="p-6 rounded-2xl border border-slate-200/60 bg-white shadow-sm space-y-3 text-center hover:shadow-md transition">
                              <div className="text-4xl mb-2">{feat.icon || '✨'}</div>
                              <h3 className="font-bold text-sm font-heading">{feat.title}</h3>
                              <p className="text-xs text-slate-500 leading-relaxed">{feat.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );

                  case 'image_text': {
                    const isRight = block.data?.imagePosition === 'right';
                    return (
                      <div key={block.id || idx} className={`flex flex-col ${isRight ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-10 p-8 rounded-3xl bg-slate-50 border border-slate-200/60`}>
                        {(block.data?.imageUrl || block.data?.image) && (
                          <div className="w-full md:w-1/2 rounded-2xl overflow-hidden shadow-md aspect-4/3">
                            <img src={block.data.imageUrl || block.data.image} alt={block.data.title || 'Showcase'} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="w-full md:w-1/2 space-y-4">
                          {block.data?.tagline && <span className="text-[11px] font-black tracking-widest uppercase" style={{ color: 'var(--sf-primary)' }}>{block.data.tagline}</span>}
                          <h2 className="text-2xl font-bold font-heading">{block.data?.title || block.data?.headline || 'Our Story'}</h2>
                          <p className="text-sm text-slate-600 leading-relaxed">{block.data?.description || block.data?.text || ''}</p>
                          {block.data?.buttonText && (
                            <Link href={block.data?.buttonUrl || '/products'} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm shadow transition" style={{ backgroundColor: 'var(--sf-primary)' }}>
                              {block.data.buttonText} <ArrowRightIcon className="w-4 h-4" />
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  }

                  case 'faq':
                    return (
                      <div key={block.id || idx} className="space-y-6 max-w-3xl mx-auto">
                        {(block.data?.heading || block.data?.title) && (
                          <div className="text-center space-y-2">
                            <h2 className="text-2xl sm:text-3xl font-bold font-heading">{block.data.heading || block.data.title}</h2>
                            {block.data?.subtitle && <p className="text-sm text-slate-500">{block.data.subtitle}</p>}
                          </div>
                        )}
                        <div className="space-y-3">
                          {(block.data?.items || []).map((faqItem: any, faqIdx: number) => {
                            const isOpen = openFaqIndex === (idx * 100 + faqIdx);
                            return (
                              <div key={faqIdx} className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
                                <button
                                  type="button"
                                  onClick={() => setOpenFaqIndex(isOpen ? null : (idx * 100 + faqIdx))}
                                  className="w-full px-6 py-4 text-left font-bold text-sm flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50 transition"
                                >
                                  <span>{faqItem.question || faqItem.q}</span>
                                  <ChevronDownIcon className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {isOpen && (
                                  <div className="px-6 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                                    {faqItem.answer || faqItem.a}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );

                  case 'testimonials':
                    return (
                      <div key={block.id || idx} className="space-y-8">
                        {block.data?.heading && (
                          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-center">{block.data.heading}</h2>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                          {(block.data?.reviews || []).map((rev: any, rIdx: number) => (
                            <div key={rIdx} className="p-6 rounded-2xl border border-slate-200/60 bg-white shadow-sm space-y-3 flex flex-col">
                              <div className="flex items-center gap-0.5 text-amber-400">
                                {Array.from({ length: rev.rating || 5 }).map((_, sIdx) => (
                                  <StarIcon key={sIdx} className="w-4 h-4" />
                                ))}
                              </div>
                              <p className="text-sm text-slate-600 italic leading-relaxed flex-1">"{rev.quote || rev.comment}"</p>
                              <div className="pt-3 border-t border-slate-100">
                                <strong className="text-sm block text-slate-900 font-bold">{rev.author || rev.name || 'Verified Customer'}</strong>
                                {rev.role && <span className="text-xs text-slate-400">{rev.role}</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );

                  case 'newsletter':
                    return (
                      <div
                        key={block.id || idx}
                        className={`p-8 sm:p-12 rounded-3xl text-center space-y-5 ${block.data?.bgDark !== false ? 'bg-slate-900 text-white' : 'bg-slate-50 border border-slate-200'}`}
                      >
                        <h2 className="text-2xl font-bold font-heading">{block.data?.heading || 'Stay in the Loop'}</h2>
                        <p className={`text-sm ${block.data?.bgDark !== false ? 'text-slate-300' : 'text-slate-600'}`}>
                          {block.data?.subtitle || 'Subscribe for exclusive drops, VIP access and offers.'}
                        </p>
                        {newsletterSubmitted ? (
                          <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 text-sm font-bold flex items-center justify-center gap-2">
                            <CheckCircleIcon className="w-5 h-5" /> Thank you for subscribing!
                          </div>
                        ) : (
                          <form onSubmit={(e) => { e.preventDefault(); if (newsletterEmail) setNewsletterSubmitted(true); }} className="flex items-center gap-2 max-w-sm mx-auto">
                            <input
                              type="email" required value={newsletterEmail} onChange={(e) => setNewsletterEmail(e.target.value)}
                              placeholder={block.data?.placeholder || 'Enter your email...'}
                              className={`flex-1 px-4 py-3 text-sm rounded-xl border focus:outline-none focus:ring-2 ${block.data?.bgDark !== false ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:ring-indigo-500' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:ring-indigo-500'}`}
                            />
                            <button type="submit" className="px-5 py-3 rounded-xl font-bold text-sm shadow transition" style={{ backgroundColor: 'var(--sf-primary)', color: '#fff' }}>
                              {block.data?.buttonText || 'Subscribe'}
                            </button>
                          </form>
                        )}
                      </div>
                    );

                  case 'cta_banner':
                    return (
                      <div
                        key={block.id || idx}
                        className="p-10 sm:p-14 rounded-3xl text-center space-y-5 shadow-xl text-white"
                        style={{ backgroundColor: block.data?.bgColor || '#0F172A' }}
                      >
                        <h2 className="text-2xl sm:text-4xl font-bold font-heading">{block.data?.headline || 'Ready to Experience Quality?'}</h2>
                        <p className="text-sm opacity-70 max-w-lg mx-auto leading-relaxed">{block.data?.subtitle || ''}</p>
                        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                          {(block.data?.primaryButtonText || block.data?.buttonText) && (
                            <Link href={block.data?.primaryButtonUrl || block.data?.buttonUrl || '/products'} className="px-7 py-3.5 rounded-xl bg-white text-slate-900 font-bold text-sm shadow hover:bg-slate-100 transition">
                              {block.data?.primaryButtonText || block.data?.buttonText}
                            </Link>
                          )}
                          {block.data?.secondaryButtonText && (
                            <Link href={block.data?.secondaryButtonUrl || '/pages/contact'} className="px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition">
                              {block.data.secondaryButtonText}
                            </Link>
                          )}
                        </div>
                      </div>
                    );

                  case 'countdown':
                    return (
                      <div key={block.id || idx} className={`p-8 sm:p-10 rounded-3xl bg-gradient-to-br ${block.data?.bgGradient || 'from-indigo-900 via-purple-900 to-slate-900'} text-white shadow-xl`}>
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                          <div className="space-y-2 text-center sm:text-left">
                            <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-black uppercase tracking-wider">{block.data?.badge || 'PROMO'}</span>
                            <h2 className="text-2xl font-black">{block.data?.title || 'Flash Sale'}</h2>
                            <p className="text-sm text-slate-300">Use code <strong className="text-amber-400 font-mono">{block.data?.discountCode}</strong> at checkout</p>
                          </div>
                          <Link href={block.data?.buttonUrl || '/products'} className="px-7 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-sm shadow-lg shrink-0 transition">
                            {block.data?.buttonText || 'Shop Offer'}
                          </Link>
                        </div>
                      </div>
                    );

                  case 'stats':
                    return (
                      <div key={block.id || idx} className="space-y-8">
                        {block.data?.heading && <h2 className="text-2xl font-bold font-heading text-center">{block.data.heading}</h2>}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                          {(block.data?.stats || []).map((s: any, sIdx: number) => (
                            <div key={sIdx} className="text-center p-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
                              <div className="text-3xl sm:text-4xl font-black font-heading" style={{ color: 'var(--sf-primary)' }}>{s.value}</div>
                              <div className="text-xs text-slate-500 mt-2 font-medium">{s.label}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );

                  case 'video':
                    return (
                      <div key={block.id || idx} className="space-y-5">
                        {(block.data?.heading || block.data?.title) && (
                          <h2 className="text-2xl font-bold font-heading text-center">{block.data.heading || block.data.title}</h2>
                        )}
                        {block.data?.videoUrl && (
                          <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-200 aspect-video">
                            <iframe src={block.data.videoUrl} className="w-full h-full" allowFullScreen title={block.data.heading || 'Video'} />
                          </div>
                        )}
                      </div>
                    );

                  case 'brand_logos':
                    return (
                      <div key={block.id || idx} className="space-y-6">
                        {block.data?.heading && <p className="text-xs font-black text-center text-slate-400 uppercase tracking-widest">{block.data.heading}</p>}
                        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
                          {(block.data?.logos || []).map((l: any, lIdx: number) => (
                            l.imageUrl
                              ? <img key={lIdx} src={l.imageUrl} alt={l.name} className="h-8 w-auto object-contain opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition" />
                              : <span key={lIdx} className="text-sm font-black text-slate-400">{l.name}</span>
                          ))}
                        </div>
                      </div>
                    );

                  case 'featured_products':
                    return (
                      <div key={block.id || idx} className="space-y-6">
                        {block.data?.heading && <h2 className="text-2xl font-bold font-heading text-center">{block.data.heading}</h2>}
                        {block.data?.subtitle && <p className="text-sm text-slate-500 text-center">{block.data.subtitle}</p>}
                        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${block.data?.columns || 3} gap-5`}>
                          {(block.data?.products || []).map((p: any, pIdx: number) => (
                            <Link key={pIdx} href={p.url || '/products'} className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group">
                              {p.image && <img src={p.image} alt={p.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />}
                              <div className="p-4 space-y-1">
                                <h3 className="font-bold text-sm text-slate-900">{p.name}</h3>
                                <span className="font-black text-base" style={{ color: 'var(--sf-primary)' }}>{p.price}</span>
                              </div>
                            </Link>
                          ))}
                        </div>
                        {block.data?.ctaText && (
                          <div className="text-center">
                            <Link href={block.data?.ctaUrl || '/products'} className="inline-block px-6 py-3 rounded-xl text-white font-bold text-sm shadow transition" style={{ backgroundColor: 'var(--sf-primary)' }}>
                              {block.data.ctaText}
                            </Link>
                          </div>
                        )}
                      </div>
                    );

                  case 'columns':
                    return (
                      <div key={block.id || idx} className={`grid grid-cols-1 md:grid-cols-${(block.data?.columns || []).length || 2} gap-8`}>
                        {(block.data?.columns || []).map((col: any, cIdx: number) => (
                          <div key={cIdx} className="space-y-3">
                            {col.heading && <h3 className="text-xl font-bold font-heading">{col.heading}</h3>}
                            <div className="prose prose-slate max-w-none prose-sm" dangerouslySetInnerHTML={{ __html: col.content || '' }} />
                          </div>
                        ))}
                      </div>
                    );

                  case 'image_gallery':
                    return (
                      <div key={block.id || idx} className="space-y-5">
                        {block.data?.heading && <h2 className="text-2xl font-bold font-heading text-center">{block.data.heading}</h2>}
                        <div className={`grid grid-cols-2 lg:grid-cols-${block.data?.columns || 3} gap-4`}>
                          {(block.data?.images || []).map((img: any, imgIdx: number) => (
                            <div key={imgIdx} className="rounded-2xl overflow-hidden aspect-square shadow-sm hover:shadow-md hover:scale-[1.02] transition-all border border-slate-200">
                              <img src={img.url} alt={img.alt || ''} className="w-full h-full object-cover" loading="lazy" />
                            </div>
                          ))}
                        </div>
                      </div>
                    );

                  case 'rich_text':
                  default: {
                    const html = block.data?.html || block.data?.content || '';
                    return (
                      <div
                        key={block.id || idx}
                        className="prose prose-slate max-w-none prose-headings:font-heading prose-headings:font-bold prose-a:text-[var(--sf-primary)] prose-img:rounded-2xl"
                        dangerouslySetInnerHTML={{ __html: html }}
                      />
                    );
                  }
                }
              })}
            </div>
          );
        }

        // Case B: Hero object with sections
        if (parsed.hero) {
          return (
            <div className="space-y-8">
              <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/60 text-center space-y-3">
                {parsed.hero.title && (
                  <h2 className="text-2xl sm:text-3xl font-bold font-heading">{parsed.hero.title}</h2>
                )}
                {parsed.hero.subtitle && (
                  <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
                    {parsed.hero.subtitle}
                  </p>
                )}
              </div>

              {parsed.sections && Array.isArray(parsed.sections) && (
                <div className="space-y-6">
                  {parsed.sections.map((sec: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-6 rounded-2xl border border-slate-200/60 bg-white shadow-2xs space-y-2"
                    >
                      {sec.heading && <h3 className="text-xl font-bold font-heading">{sec.heading}</h3>}
                      {sec.body && (
                        <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                          {sec.body}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        }
      } catch {
        // Fall back to standard HTML/plain text if JSON parse fails
      }
    }

    // 2. HTML format (from rich text editor)
    const containsHtml = /<[a-z][\s\S]*>/i.test(trimmed);
    if (containsHtml) {
      return (
        <div
          className="prose prose-slate max-w-none prose-headings:font-heading prose-headings:font-bold prose-a:text-[var(--sf-primary)] prose-img:rounded-2xl"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      );
    }

    // 3. Regular formatted plain-text with paragraphs
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full font-sans">


        {/* Page Header */}
        <header className="mb-10 pb-8 border-b border-slate-200/50">

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

        {/* Bottom Support & Help Bar */}
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
              Our support concierge is always available to help you.
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
