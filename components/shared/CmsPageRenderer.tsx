'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import type { CmsPage, ThemeConfig } from '@/lib/api/types';
import { TemplateLayout } from './TemplateLayout';
import { StorefrontFormRenderer } from './StorefrontFormRenderer';
import { StorefrontForm, getStorefrontForm } from '@/lib/api/forms';

// Inline Icons
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
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M14 5l7 7m0 0l-7 7m7-7H3"
      />
    </svg>
  );
}

function ChevronLeftIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ChevronRightIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

// ─── Image Slider Component ─────────────────────────────────────────────────
function StorefrontImageSlider({ block }: { block: any }) {
  const slides = block.data?.slides || [];
  const [currentIdx, setCurrentIdx] = useState(0);
  const autoplay = block.data?.autoplay ?? true;
  const intervalTime = block.data?.interval || 5000;

  useEffect(() => {
    if (!autoplay || slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % slides.length);
    }, intervalTime);
    return () => clearInterval(timer);
  }, [autoplay, intervalTime, slides.length]);

  if (slides.length === 0) return null;
  const activeSlide = slides[currentIdx] || slides[0];

  return (
    <div
      className="relative rounded-3xl overflow-hidden shadow-xl"
      style={{ height: block.data?.height || '520px' }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{
          backgroundImage: `url(${activeSlide.imageUrl || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1600&q=80'})`,
        }}
      />
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: (activeSlide.overlayOpacity ?? 45) / 100 }}
      />

      <div
        className={`relative z-10 h-full flex flex-col justify-center p-8 sm:p-16 text-white text-${activeSlide.textAlign || 'center'} items-${activeSlide.textAlign === 'left' ? 'start' : activeSlide.textAlign === 'right' ? 'end' : 'center'}`}
      >
        <div className="max-w-2xl space-y-5">
          <h1 className="text-3xl sm:text-5xl font-black font-heading tracking-tight leading-tight">
            {activeSlide.title || 'Featured Drop'}
          </h1>
          {activeSlide.subtitle && (
            <p className="text-base sm:text-lg text-white/90 max-w-xl mx-auto leading-relaxed">
              {activeSlide.subtitle}
            </p>
          )}
          <div
            className={`pt-2 flex flex-wrap gap-3 justify-${activeSlide.textAlign === 'left' ? 'start' : activeSlide.textAlign === 'right' ? 'end' : 'center'}`}
          >
            {activeSlide.buttonText && (
              <Link
                href={activeSlide.buttonUrl || '/products'}
                className="px-7 py-3.5 rounded-xl bg-white text-slate-950 font-bold text-sm shadow-xl hover:bg-slate-100 transition"
              >
                {activeSlide.buttonText}
              </Link>
            )}
            {activeSlide.secondaryButtonText && (
              <Link
                href={activeSlide.secondaryButtonUrl || '/collections'}
                className="px-7 py-3.5 rounded-xl bg-white/20 text-white font-bold text-sm backdrop-blur-md hover:bg-white/30 transition"
              >
                {activeSlide.secondaryButtonText}
              </Link>
            )}
          </div>
        </div>
      </div>

      {slides.length > 1 && (
        <>
          <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 z-20 flex justify-between pointer-events-none">
            <button
              type="button"
              onClick={() => setCurrentIdx((currentIdx - 1 + slides.length) % slides.length)}
              className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-black flex items-center justify-center pointer-events-auto transition cursor-pointer"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentIdx((currentIdx + 1) % slides.length)}
              className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-black flex items-center justify-center pointer-events-auto transition cursor-pointer"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="absolute bottom-6 inset-x-0 z-20 flex justify-center gap-2">
            {slides.map((_: any, i: number) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentIdx(i)}
                className={`h-2.5 rounded-full transition-all cursor-pointer ${currentIdx === i ? 'w-8 bg-white' : 'w-2.5 bg-white/40'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Countdown Clock Component ───────────────────────────────────────────────
function StorefrontCountdown({ block }: { block: any }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 18, minutes: 44, seconds: 29 });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const { data } = block;

  return (
    <div
      className={`p-8 sm:p-12 rounded-3xl bg-gradient-to-r ${data?.bgGradient || 'from-violet-950 via-indigo-900 to-slate-950'} text-white space-y-6 shadow-2xl`}
    >
      <div className="text-center space-y-2">
        {data?.badge && (
          <span className="inline-block px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider">
            {data.badge}
          </span>
        )}
        <h3 className="text-2xl sm:text-4xl font-black font-heading">
          {data?.title || 'Flash Sale'}
        </h3>
        {data?.subtitle && (
          <p className="text-sm text-slate-300 max-w-md mx-auto">{data.subtitle}</p>
        )}
      </div>

      <div className="flex justify-center gap-3 sm:gap-4 py-2">
        {[
          { v: String(timeLeft.hours).padStart(2, '0'), l: 'HOURS' },
          { v: String(timeLeft.minutes).padStart(2, '0'), l: 'MINUTES' },
          { v: String(timeLeft.seconds).padStart(2, '0'), l: 'SECONDS' },
        ].map((t, idx) => (
          <div
            key={idx}
            className="w-20 sm:w-24 p-3.5 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center"
          >
            <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">{t.v}</div>
            <div className="text-[10px] font-bold text-slate-300 tracking-wider mt-0.5">{t.l}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        {data?.discountCode && (
          <button
            type="button"
            onClick={() => copyCode(data.discountCode)}
            className="px-5 py-3 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 font-mono font-black text-amber-300 text-xs transition cursor-pointer"
          >
            {copied ? '✓ COPIED!' : `CODE: ${data.discountCode}`}
          </button>
        )}
        {data?.buttonText && (
          <Link
            href={data.buttonUrl || '/products'}
            className="px-8 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-xl transition"
          >
            {data.buttonText}
          </Link>
        )}
      </div>
    </div>
  );
}

// ─── Embedded Form Component ────────────────────────────────────────────────
function StorefrontEmbeddedForm({ block }: { block: any }) {
  const [form, setForm] = useState<StorefrontForm | null>(null);
  const [loading, setLoading] = useState(true);

  const formIdOrSlug = block.data?.formSlug || block.data?.formId;

  useEffect(() => {
    if (!formIdOrSlug) {
      setLoading(false);
      return;
    }
    let isMounted = true;
    getStorefrontForm(formIdOrSlug)
      .then((res) => {
        if (isMounted) {
          setForm(res);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [formIdOrSlug]);

  if (!formIdOrSlug) return null;

  if (loading) {
    return (
      <div className="py-10 flex flex-col items-center justify-center gap-2">
        <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs opacity-60">Loading form...</span>
      </div>
    );
  }

  if (!form) return null;

  return (
    <div className="py-4">
      {(block.data?.heading || block.data?.subtitle) && (
        <div className="mb-6 text-center space-y-1">
          {block.data.heading && (
            <h3
              className="text-2xl sm:text-3xl font-black font-heading"
              style={{ color: 'var(--sf-text)' }}
            >
              {block.data.heading}
            </h3>
          )}
          {block.data.subtitle && (
            <p className="text-sm opacity-70 max-w-md mx-auto">{block.data.subtitle}</p>
          )}
        </div>
      )}
      <StorefrontFormRenderer form={form} />
    </div>
  );
}

// ─── Main Renderer ──────────────────────────────────────────────────────────
interface CmsPageRendererProps {
  page: CmsPage;
  theme: ThemeConfig;
}

export function CmsPageRenderer({ page, theme }: CmsPageRendererProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  const renderContent = () => {
    if (!page.content) {
      return (
        <p className="text-slate-500 italic">
          This page does not have any content yet. Please update it in the CMS.
        </p>
      );
    }

    const trimmed = page.content.trim();

    // 1. Structured JSON PageBuilder blocks
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);

        if (Array.isArray(parsed)) {
          return (
            <div className="space-y-12 w-full">
              {parsed.map((block: any, idx: number) => {
                if (block.isVisible === false) return null;

                const renderBlockContent = () => {
                  switch (block.type) {
                  // ── 1. HEADING TAG (H1-H6) ──
                  case 'heading': {
                    const Tag = (
                      ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(block.data?.level)
                        ? block.data.level
                        : 'h2'
                    ) as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
                    const sizeCls =
                      {
                        xl: 'text-xl',
                        '2xl': 'text-2xl sm:text-3xl',
                        '3xl': 'text-3xl sm:text-4xl',
                        '4xl': 'text-4xl sm:text-5xl',
                        '5xl': 'text-5xl sm:text-6xl',
                        '6xl': 'text-6xl sm:text-7xl',
                      }[block.data?.fontSize as string] || 'text-3xl sm:text-4xl';

                    return (
                      <div
                        key={block.id || idx}
                        className={`py-4 text-${block.data?.textAlign || 'center'} space-y-2`}
                      >
                        {block.data?.eyebrow && (
                          <div
                            className="inline-block px-3 py-1 rounded-full bg-slate-100 font-extrabold text-[11px] tracking-wider uppercase mb-1"
                            style={{ color: 'var(--sf-primary)' }}
                          >
                            {block.data.eyebrow}
                          </div>
                        )}
                        <Tag
                          className={`font-black font-heading tracking-tight leading-tight ${sizeCls} ${
                            block.data?.isGradient
                              ? 'bg-gradient-to-r from-violet-600 via-indigo-600 to-fuchsia-600 bg-clip-text text-transparent'
                              : 'text-slate-950 dark:text-white'
                          }`}
                        >
                          {block.data?.text || 'Heading'}
                        </Tag>
                        {block.data?.subtitle && (
                          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mt-1">
                            {block.data.subtitle}
                          </p>
                        )}
                        {block.data?.hasUnderline && (
                          <div
                            className={`w-16 h-1 rounded-full mt-3 ${block.data?.textAlign === 'left' ? '' : block.data?.textAlign === 'right' ? 'ml-auto' : 'mx-auto'}`}
                            style={{ backgroundColor: 'var(--sf-primary)' }}
                          />
                        )}
                      </div>
                    );
                  }

                  // ── 2. SPAN / BADGE TAG ──
                  case 'span_badge': {
                    const colorClasses: Record<string, string> = {
                      violet: 'bg-violet-100 text-violet-800 border-violet-200',
                      emerald: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                      rose: 'bg-rose-100 text-rose-800 border-rose-200',
                      amber: 'bg-amber-100 text-amber-900 border-amber-200',
                      blue: 'bg-blue-100 text-blue-800 border-blue-200',
                      slate: 'bg-slate-100 text-slate-800 border-slate-200',
                    };
                    const shapeClasses: Record<string, string> = {
                      pill: 'rounded-full',
                      rounded: 'rounded-xl',
                      square: 'rounded-none',
                    };
                    const colorCls =
                      colorClasses[block.data?.colorPreset || 'violet'] || colorClasses.violet;
                    const shapeCls =
                      shapeClasses[block.data?.variant || 'pill'] || shapeClasses.pill;

                    const content = (
                      <span
                        className={`inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-black tracking-wide uppercase border shadow-xs ${colorCls} ${shapeCls}`}
                      >
                        {block.data?.iconEmoji && <span>{block.data.iconEmoji}</span>}
                        <span>{block.data?.text || 'BADGE'}</span>
                      </span>
                    );

                    return (
                      <div
                        key={block.id || idx}
                        className={`flex justify-${block.data?.align === 'left' ? 'start' : block.data?.align === 'right' ? 'end' : 'center'}`}
                      >
                        {block.data?.linkUrl ? (
                          <Link href={block.data.linkUrl}>{content}</Link>
                        ) : (
                          content
                        )}
                      </div>
                    );
                  }

                  // ── 3. CONTAINER / DIV BOX ──
                  case 'container_box': {
                    return (
                      <div key={block.id || idx} className="flex justify-center">
                        <div
                          className={`w-full max-w-${block.data?.maxWidth || '4xl'} p-8 rounded-3xl border shadow-xs`}
                          style={{
                            backgroundColor: block.data?.bgColor || '#f8fafc',
                            borderColor: block.data?.borderColor || '#e2e8f0',
                            borderStyle:
                              block.data?.borderStyle === 'none'
                                ? 'none'
                                : block.data?.borderStyle || 'solid',
                          }}
                        >
                          {block.data?.title && (
                            <h3 className="text-lg font-bold font-heading text-slate-900 mb-2">
                              {block.data.title}
                            </h3>
                          )}
                          <div
                            className="prose prose-slate max-w-none"
                            dangerouslySetInnerHTML={{ __html: block.data?.content || '' }}
                          />
                        </div>
                      </div>
                    );
                  }

                  // ── 4. PARAGRAPH TEXT ──
                  case 'paragraph': {
                    return (
                      <div
                        key={block.id || idx}
                        className={`text-${block.data?.textAlign || 'center'} px-4`}
                      >
                        <p
                          className={`text-${block.data?.fontSize || 'base'} text-slate-600 dark:text-slate-300 leading-${block.data?.lineHeight || 'relaxed'} max-w-3xl mx-auto font-medium`}
                        >
                          {block.data?.text || ''}
                        </p>
                      </div>
                    );
                  }

                  // ── 5. BUTTON GROUP ──
                  case 'button_group': {
                    return (
                      <div
                        key={block.id || idx}
                        className={`flex flex-wrap gap-3 justify-${block.data?.align === 'left' ? 'start' : block.data?.align === 'right' ? 'end' : 'center'}`}
                      >
                        {(block.data?.buttons || []).map((b: any, bIdx: number) => {
                          let styleClass = 'bg-slate-900 text-white hover:bg-slate-800';
                          if (b.variant === 'secondary')
                            styleClass =
                              'bg-slate-100 text-slate-900 hover:bg-slate-200 border border-slate-300';
                          if (b.variant === 'outline')
                            styleClass =
                              'bg-transparent text-slate-900 border-2 border-slate-900 hover:bg-slate-900 hover:text-white';
                          if (b.variant === 'glow')
                            styleClass =
                              'bg-violet-600 text-white shadow-lg shadow-violet-500/30 hover:bg-violet-700';

                          return (
                            <Link
                              key={bIdx}
                              href={b.url || '/products'}
                              className={`inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm transition ${styleClass}`}
                            >
                              <span>{b.text || 'Button'}</span>
                              <ArrowRightIcon className="w-4 h-4" />
                            </Link>
                          );
                        })}
                      </div>
                    );
                  }

                  // ── 6. DIVIDER / SPACER ──
                  case 'divider_spacer': {
                    return (
                      <div
                        key={block.id || idx}
                        className="flex items-center justify-center relative my-2"
                        style={{ height: `${block.data?.height || 48}px` }}
                      >
                        <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                        {block.data?.showIcon && (
                          <span className="absolute px-3 bg-white dark:bg-slate-950 text-slate-400 text-xs font-bold">
                            {block.data.iconText || '✦'}
                          </span>
                        )}
                      </div>
                    );
                  }

                  // ── 7. IMAGE SLIDER / HERO CAROUSEL ──
                  case 'image_slider': {
                    return <StorefrontImageSlider key={block.id || idx} block={block} />;
                  }

                  // ── 8. PRODUCT SLIDER / CAROUSEL ──
                  case 'product_slider': {
                    return (
                      <div
                        key={block.id || idx}
                        className="p-8 space-y-6 bg-slate-50/70 dark:bg-neutral-900 rounded-3xl border border-slate-200/80 dark:border-neutral-800 shadow-sm"
                      >
                        <div className="flex items-end justify-between">
                          <div>
                            <h3 className="text-2xl font-black font-heading text-slate-900 dark:text-white">
                              {block.data?.heading || 'Trending Bestsellers'}
                            </h3>
                            {block.data?.subtitle && (
                              <p className="text-xs text-slate-500 mt-1">{block.data.subtitle}</p>
                            )}
                          </div>
                          <Link
                            href="/products"
                            className="text-xs font-bold text-indigo-600 hover:underline"
                          >
                            View Catalog →
                          </Link>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                          {(block.data?.items || []).map((p: any, pIdx: number) => (
                            <Link
                              key={pIdx}
                              href={p.url || '/products'}
                              className="group rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 overflow-hidden shadow-xs hover:shadow-md transition"
                            >
                              <div className="relative aspect-square bg-slate-100 dark:bg-neutral-900 overflow-hidden">
                                {p.image ? (
                                  <img
                                    src={p.image}
                                    alt={p.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                  />
                                ) : null}
                                {p.badge && (
                                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-slate-900 text-white font-black text-[10px] uppercase tracking-wider">
                                    {p.badge}
                                  </span>
                                )}
                              </div>
                              <div className="p-4 space-y-1">
                                <div className="flex text-amber-400 text-xs">★★★★★</div>
                                <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                                  {p.name}
                                </h4>
                                <div className="flex items-center gap-2 pt-1">
                                  <span className="font-black text-sm text-slate-900 dark:text-white">
                                    {p.price}
                                  </span>
                                  {p.compareAtPrice && (
                                    <span className="text-xs text-slate-400 line-through">
                                      {p.compareAtPrice}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  // ── 9. ANNOUNCEMENT & PROMO BAR ──
                  case 'announcement_bar': {
                    return (
                      <div
                        key={block.id || idx}
                        className="p-3.5 rounded-2xl bg-indigo-950 text-white flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm shadow-md"
                      >
                        {block.data?.badge && (
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase">
                            {block.data.badge}
                          </span>
                        )}
                        <span className="font-bold">{block.data?.message}</span>
                        {block.data?.couponCode && (
                          <span className="px-2.5 py-0.5 rounded-md bg-white/20 font-mono font-black text-amber-300">
                            {block.data.couponCode}
                          </span>
                        )}
                        {block.data?.ctaText && (
                          <Link
                            href={block.data.ctaUrl || '/products'}
                            className="underline font-bold text-amber-300 ml-1 hover:text-white"
                          >
                            {block.data.ctaText} →
                          </Link>
                        )}
                      </div>
                    );
                  }

                  // ── 10. PRICING TABLE ──
                  case 'pricing_table': {
                    return (
                      <div key={block.id || idx} className="space-y-8 py-4">
                        <div className="text-center space-y-2">
                          <h3 className="text-3xl font-black font-heading text-slate-900 dark:text-white">
                            {block.data?.heading || 'Membership Plans'}
                          </h3>
                          {block.data?.subtitle && (
                            <p className="text-sm text-slate-500">{block.data.subtitle}</p>
                          )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-stretch max-w-6xl mx-auto">
                          {(block.data?.plans || []).map((p: any, pIdx: number) => (
                            <div
                              key={pIdx}
                              className={`p-8 rounded-3xl border flex flex-col justify-between ${p.isPopular ? 'border-indigo-600 bg-indigo-50/20 shadow-2xl relative' : 'border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900'}`}
                            >
                              {p.isPopular && (
                                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-indigo-600 text-white font-black text-[10px] uppercase tracking-wider">
                                  POPULAR CHOICE
                                </span>
                              )}
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-extrabold text-lg text-slate-900 dark:text-white">
                                    {p.name}
                                  </h4>
                                  <p className="text-xs text-slate-500 mt-1">{p.description}</p>
                                </div>
                                <div className="flex items-baseline gap-1">
                                  <span className="text-4xl font-black text-slate-900 dark:text-white">
                                    {p.price}
                                  </span>
                                  <span className="text-xs text-slate-500">{p.period}</span>
                                </div>
                                <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-neutral-800">
                                  {(Array.isArray(p.features) ? p.features : []).map(
                                    (f: string, fIdx: number) => (
                                      <div
                                        key={fIdx}
                                        className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300"
                                      >
                                        <CheckCircleIcon className="w-4 h-4 text-emerald-500 shrink-0" />
                                        <span>{f}</span>
                                      </div>
                                    ),
                                  )}
                                </div>
                              </div>
                              <Link
                                href={p.buttonUrl || '/checkout'}
                                className={`w-full mt-8 py-3.5 rounded-xl font-bold text-xs text-center block transition ${p.isPopular ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md' : 'bg-slate-900 dark:bg-white text-white dark:text-black hover:opacity-90'}`}
                              >
                                {p.buttonText || 'Get Started'}
                              </Link>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  // ── 11. TRUST BADGES ──
                  case 'trust_badges': {
                    return (
                      <div
                        key={block.id || idx}
                        className="p-8 rounded-3xl bg-slate-50 dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 space-y-6"
                      >
                        {block.data?.heading && (
                          <h4 className="text-sm font-black text-center text-slate-900 dark:text-white uppercase tracking-wider">
                            {block.data.heading}
                          </h4>
                        )}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
                          {(block.data?.badges || []).map((b: any, bIdx: number) => (
                            <div key={bIdx} className="space-y-1">
                              <div className="text-3xl mb-1.5">{b.icon || '🛡️'}</div>
                              <div className="font-bold text-sm text-slate-900 dark:text-white">
                                {b.title}
                              </div>
                              <div className="text-xs text-slate-500">{b.desc}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  // ── 12. BANNER GRID ──
                  case 'banner_grid': {
                    return (
                      <div key={block.id || idx} className="space-y-6">
                        {block.data?.heading && (
                          <h3 className="text-2xl font-black font-heading text-slate-900 dark:text-white">
                            {block.data.heading}
                          </h3>
                        )}
                        <div
                          className={`grid grid-cols-1 sm:grid-cols-${block.data?.columns || 3} gap-6`}
                        >
                          {(block.data?.banners || []).map((b: any, bIdx: number) => (
                            <Link
                              key={bIdx}
                              href={b.url || '/collections'}
                              className="relative rounded-3xl overflow-hidden aspect-4/3 group shadow-md block"
                            >
                              {b.imageUrl ? (
                                <img
                                  src={b.imageUrl}
                                  alt={b.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                />
                              ) : null}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent flex flex-col justify-end p-6 text-white">
                                {b.badge && (
                                  <span className="self-start px-2.5 py-0.5 rounded-md bg-white text-slate-900 font-black text-[10px] uppercase mb-1.5">
                                    {b.badge}
                                  </span>
                                )}
                                <h4 className="font-extrabold text-lg text-white">{b.title}</h4>
                                <p className="text-xs text-white/80">{b.subtitle}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  // ── 13. INSTAGRAM FEED ──
                  case 'instagram_feed': {
                    return (
                      <div key={block.id || idx} className="space-y-6 text-center">
                        <div>
                          <h3 className="text-2xl font-black font-heading text-slate-900 dark:text-white">
                            {block.data?.heading || 'Follow Us'}
                          </h3>
                          <p className="text-xs font-bold text-indigo-600 mt-1">
                            {block.data?.handle || '@store_official'}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {(block.data?.items || []).map((it: any, itIdx: number) => (
                            <div
                              key={itIdx}
                              className="relative rounded-2xl overflow-hidden aspect-square group shadow-xs"
                            >
                              <img
                                src={it.imageUrl}
                                alt="Instagram post"
                                className="w-full h-full object-cover group-hover:scale-105 transition"
                              />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-4 text-white text-xs font-bold">
                                <span>❤️ {it.likes || '1k'}</span>
                                <span>💬 {it.comments || '24'}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  // ── 14. COUNTDOWN TIMER ──
                  case 'countdown_timer': {
                    return <StorefrontCountdown key={block.id || idx} block={block} />;
                  }

                  // ── 15. HERO BANNER ──
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
                            <div
                              className={`pt-2 flex flex-wrap gap-3 justify-${block.data?.textAlign === 'left' ? 'start' : block.data?.textAlign === 'right' ? 'end' : 'center'}`}
                            >
                              {block.data?.buttonText && (
                                <Link
                                  href={block.data?.buttonUrl || '/products'}
                                  className="px-7 py-3.5 rounded-xl bg-white text-slate-900 font-bold text-sm shadow hover:bg-slate-100 transition"
                                >
                                  {block.data.buttonText}
                                </Link>
                              )}
                              {block.data?.secondaryButtonText && (
                                <Link
                                  href={block.data?.secondaryButtonUrl || '/collections'}
                                  className="px-7 py-3.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-sm backdrop-blur-sm transition"
                                >
                                  {block.data.secondaryButtonText}
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );

                  // ── 16. VALUE PROPS ──
                  case 'value_props':
                    return (
                      <div key={block.id || idx} className="space-y-8">
                        {block.data?.heading && (
                          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-center">
                            {block.data.heading}
                          </h2>
                        )}
                        <div
                          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${block.data?.columns || 4} gap-5`}
                        >
                          {(block.data?.features || []).map((feat: any, fIdx: number) => (
                            <div
                              key={fIdx}
                              className="p-6 rounded-2xl border border-slate-200/60 bg-white shadow-sm space-y-3 text-center hover:shadow-md transition"
                            >
                              <div className="text-4xl mb-2">{feat.icon || '✨'}</div>
                              <h3 className="font-bold text-sm font-heading">{feat.title}</h3>
                              <p className="text-xs text-slate-500 leading-relaxed">{feat.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );

                  // ── 17. IMAGE & TEXT ──
                  case 'image_text': {
                    const isRight = block.data?.imagePosition === 'right';
                    return (
                      <div
                        key={block.id || idx}
                        className={`flex flex-col ${isRight ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-10 p-8 rounded-3xl bg-slate-50 border border-slate-200/60`}
                      >
                        {(block.data?.imageUrl || block.data?.image) && (
                          <div className="w-full md:w-1/2 rounded-2xl overflow-hidden shadow-md aspect-4/3">
                            <img
                              src={block.data.imageUrl || block.data.image}
                              alt={block.data.title || 'Showcase'}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="w-full md:w-1/2 space-y-4">
                          {block.data?.tagline && (
                            <span
                              className="text-[11px] font-black tracking-widest uppercase"
                              style={{ color: 'var(--sf-primary)' }}
                            >
                              {block.data.tagline}
                            </span>
                          )}
                          <h2 className="text-2xl font-bold font-heading">
                            {block.data?.title || block.data?.headline || 'Our Story'}
                          </h2>
                          <p className="text-sm text-slate-600 leading-relaxed">
                            {block.data?.description || block.data?.text || ''}
                          </p>
                          {block.data?.buttonText && (
                            <Link
                              href={block.data?.buttonUrl || '/products'}
                              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm shadow transition"
                              style={{ backgroundColor: 'var(--sf-primary)' }}
                            >
                              {block.data.buttonText} <ArrowRightIcon className="w-4 h-4" />
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  }

                  // ── 18. FAQ ──
                  case 'faq':
                    return (
                      <div key={block.id || idx} className="space-y-6 max-w-3xl mx-auto">
                        {(block.data?.heading || block.data?.title) && (
                          <div className="text-center space-y-2">
                            <h2 className="text-2xl sm:text-3xl font-bold font-heading">
                              {block.data.heading || block.data.title}
                            </h2>
                            {block.data?.subtitle && (
                              <p className="text-sm text-slate-500">{block.data.subtitle}</p>
                            )}
                          </div>
                        )}
                        <div className="space-y-3">
                          {(block.data?.items || []).map((faqItem: any, faqIdx: number) => {
                            const isOpen = openFaqIndex === idx * 100 + faqIdx;
                            return (
                              <div
                                key={faqIdx}
                                className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs"
                              >
                                <button
                                  type="button"
                                  onClick={() =>
                                    setOpenFaqIndex(isOpen ? null : idx * 100 + faqIdx)
                                  }
                                  className="w-full px-6 py-4 text-left font-bold text-sm flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50 transition"
                                >
                                  <span>{faqItem.question || faqItem.q}</span>
                                  <ChevronDownIcon
                                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                                  />
                                </button>
                                {isOpen && (
                                  <div className="px-6 pb-5 pt-1 text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-neutral-800">
                                    {faqItem.answer || faqItem.a}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );

                  // ── 19. TESTIMONIALS ──
                  case 'testimonials':
                    return (
                      <div key={block.id || idx} className="space-y-8">
                        {block.data?.heading && (
                          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-center">
                            {block.data.heading}
                          </h2>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {(block.data?.reviews || []).map((rev: any, rIdx: number) => (
                            <div
                              key={rIdx}
                              className="p-6 rounded-2xl border border-slate-200/60 bg-white shadow-sm space-y-3 flex flex-col"
                            >
                              <div className="flex items-center gap-0.5 text-amber-400">
                                {Array.from({ length: rev.rating || 5 }).map((_, sIdx) => (
                                  <StarIcon key={sIdx} className="w-4 h-4" />
                                ))}
                              </div>
                              <p className="text-sm text-slate-600 italic leading-relaxed flex-1">
                                "{rev.quote || rev.comment}"
                              </p>
                              <div className="pt-3 border-t border-slate-100">
                                <strong className="text-sm block text-slate-900 font-bold">
                                  {rev.author || rev.name || 'Verified Customer'}
                                </strong>
                                {rev.role && (
                                  <span className="text-xs text-slate-400">{rev.role}</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );

                  // ── 20. NEWSLETTER ──
                  case 'newsletter':
                    return (
                      <div
                        key={block.id || idx}
                        className={`p-10 sm:p-16 rounded-3xl text-center space-y-6 ${
                          block.data?.bgDark
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-50 dark:bg-neutral-900 border border-slate-200/60'
                        }`}
                      >
                        <h2 className="text-2xl font-bold font-heading">
                          {block.data?.heading || 'Stay in the Loop'}
                        </h2>
                        <p
                          className={`text-sm ${block.data?.bgDark !== false ? 'text-slate-300' : 'text-slate-600'}`}
                        >
                          {block.data?.subtitle ||
                            'Subscribe for exclusive drops, VIP access and offers.'}
                        </p>
                        {newsletterSubmitted ? (
                          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500/20 text-emerald-300 text-sm font-bold">
                            <CheckCircleIcon className="w-5 h-5" />
                            <span>Thank you for subscribing! Check your inbox soon.</span>
                          </div>
                        ) : (
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              if (newsletterEmail) setNewsletterSubmitted(true);
                            }}
                            className="flex items-center gap-2 max-w-sm mx-auto"
                          >
                            <input
                              type="email"
                              required
                              value={newsletterEmail}
                              onChange={(e) => setNewsletterEmail(e.target.value)}
                              placeholder={block.data?.placeholder || 'Enter your email...'}
                              className="flex-1 px-5 py-3.5 rounded-xl border border-slate-700 bg-white/10 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <button
                              type="submit"
                              className="px-5 py-3 rounded-xl font-bold text-sm shadow transition"
                              style={{ backgroundColor: 'var(--sf-primary)', color: '#fff' }}
                            >
                              {block.data?.buttonText || 'Subscribe'}
                            </button>
                          </form>
                        )}
                      </div>
                    );

                  // ── 21. CTA BANNER ──
                  case 'cta_banner':
                    return (
                      <div
                        key={block.id || idx}
                        className="p-10 sm:p-16 rounded-3xl text-white text-center space-y-6 relative overflow-hidden shadow-xl"
                        style={{
                          backgroundColor: block.data?.bgColor || '#0F172A',
                          backgroundImage: block.data?.backgroundImage
                            ? `linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.7)), url(${block.data?.backgroundImage})`
                            : undefined,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      >
                        <h2 className="text-2xl sm:text-4xl font-bold font-heading">
                          {block.data?.headline || 'Ready to Experience Quality?'}
                        </h2>
                        <p className="text-sm opacity-70 max-w-lg mx-auto leading-relaxed">
                          {block.data?.subtitle || ''}
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                          {(block.data?.primaryButtonText || block.data?.buttonText) && (
                            <Link
                              href={
                                block.data?.primaryButtonUrl || block.data?.buttonUrl || '/products'
                              }
                              className="px-7 py-3.5 rounded-xl bg-white text-slate-900 font-bold text-sm shadow hover:bg-slate-100 transition"
                            >
                              {block.data?.primaryButtonText || block.data?.buttonText}
                            </Link>
                          )}
                          {block.data?.secondaryButtonText && (
                            <Link
                              href={block.data?.secondaryButtonUrl || '/pages/contact'}
                              className="px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition"
                            >
                              {block.data.secondaryButtonText}
                            </Link>
                          )}
                        </div>
                      </div>
                    );

                  case 'countdown':
                    return (
                      <div
                        key={block.id || idx}
                        className={`p-8 sm:p-10 rounded-3xl bg-gradient-to-br ${block.data?.bgGradient || 'from-indigo-900 via-purple-900 to-slate-900'} text-white shadow-xl`}
                      >
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                          <div className="space-y-2 text-center sm:text-left">
                            <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-black uppercase tracking-wider">
                              {block.data?.badge || 'PROMO'}
                            </span>
                            <h2 className="text-2xl font-black">
                              {block.data?.title || 'Flash Sale'}
                            </h2>
                            <p className="text-sm text-slate-300">
                              Use code{' '}
                              <strong className="text-amber-400 font-mono">
                                {block.data?.discountCode}
                              </strong>{' '}
                              at checkout
                            </p>
                          </div>
                          <Link
                            href={block.data?.buttonUrl || '/products'}
                            className="px-7 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-sm shadow-lg shrink-0 transition"
                          >
                            {block.data?.buttonText || 'Shop Offer'}
                          </Link>
                        </div>
                      </div>
                    );

                  case 'stats':
                    return (
                      <div key={block.id || idx} className="space-y-8">
                        {block.data?.heading && (
                          <h2 className="text-2xl font-bold font-heading text-center">
                            {block.data.heading}
                          </h2>
                        )}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                          {(block.data?.stats || []).map((s: any, sIdx: number) => (
                            <div
                              key={sIdx}
                              className="text-center p-6 rounded-2xl border border-slate-200 bg-white shadow-sm"
                            >
                              <div
                                className="text-3xl sm:text-4xl font-black font-heading"
                                style={{ color: 'var(--sf-primary)' }}
                              >
                                {s.value}
                              </div>
                              <div className="text-xs text-slate-500 mt-2 font-medium">
                                {s.label}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );

                  case 'video':
                    return (
                      <div key={block.id || idx} className="space-y-5">
                        {(block.data?.heading || block.data?.title) && (
                          <h2 className="text-2xl font-bold font-heading text-center">
                            {block.data.heading || block.data.title}
                          </h2>
                        )}
                        {block.data?.videoUrl && (
                          <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-200 aspect-video">
                            <iframe
                              src={block.data.videoUrl}
                              className="w-full h-full"
                              allowFullScreen
                              title={block.data.heading || 'Video'}
                            />
                          </div>
                        )}
                      </div>
                    );

                  case 'brand_logos':
                    return (
                      <div key={block.id || idx} className="space-y-6">
                        {block.data?.heading && (
                          <p className="text-xs font-black text-center text-slate-400 uppercase tracking-widest">
                            {block.data.heading}
                          </p>
                        )}
                        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
                          {(block.data?.logos || []).map((l: any, lIdx: number) =>
                            l.imageUrl ? (
                              <img
                                key={lIdx}
                                src={l.imageUrl}
                                alt={l.name}
                                className="h-8 w-auto object-contain opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition"
                              />
                            ) : (
                              <span key={lIdx} className="text-sm font-black text-slate-400">
                                {l.name}
                              </span>
                            ),
                          )}
                        </div>
                      </div>
                    );

                  case 'featured_products':
                    return (
                      <div key={block.id || idx} className="space-y-6">
                        {block.data?.heading && (
                          <h2 className="text-2xl font-bold font-heading text-center">
                            {block.data.heading}
                          </h2>
                        )}
                        {block.data?.subtitle && (
                          <p className="text-sm text-slate-500 text-center">
                            {block.data.subtitle}
                          </p>
                        )}
                        <div
                          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${block.data?.columns || 3} gap-5`}
                        >
                          {(block.data?.products || []).map((p: any, pIdx: number) => (
                            <Link
                              key={pIdx}
                              href={p.url || '/products'}
                              className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group"
                            >
                              {p.image && (
                                <img
                                  src={p.image}
                                  alt={p.name}
                                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              )}
                              <div className="p-4 space-y-1">
                                <h3 className="font-bold text-sm text-slate-900">{p.name}</h3>
                                <span
                                  className="font-black text-base"
                                  style={{ color: 'var(--sf-primary)' }}
                                >
                                  {p.price}
                                </span>
                              </div>
                            </Link>
                          ))}
                        </div>
                        {block.data?.ctaText && (
                          <div className="text-center">
                            <Link
                              href={block.data?.ctaUrl || '/products'}
                              className="inline-block px-6 py-3 rounded-xl text-white font-bold text-sm shadow transition"
                              style={{ backgroundColor: 'var(--sf-primary)' }}
                            >
                              {block.data.ctaText}
                            </Link>
                          </div>
                        )}
                      </div>
                    );

                  case 'columns':
                    return (
                      <div
                        key={block.id || idx}
                        className={`grid grid-cols-1 md:grid-cols-${(block.data?.columns || []).length || 2} gap-8`}
                      >
                        {(block.data?.columns || []).map((col: any, cIdx: number) => (
                          <div key={cIdx} className="space-y-3">
                            {col.heading && (
                              <h3 className="text-xl font-bold font-heading">{col.heading}</h3>
                            )}
                            <div
                              className="prose prose-slate max-w-none prose-sm"
                              dangerouslySetInnerHTML={{ __html: col.content || '' }}
                            />
                          </div>
                        ))}
                      </div>
                    );

                  case 'image_gallery':
                    return (
                      <div key={block.id || idx} className="space-y-5">
                        {block.data?.heading && (
                          <h2 className="text-2xl font-bold font-heading text-center">
                            {block.data.heading}
                          </h2>
                        )}
                        <div
                          className={`grid grid-cols-2 lg:grid-cols-${block.data?.columns || 3} gap-4`}
                        >
                          {(block.data?.images || []).map((img: any, imgIdx: number) => (
                            <div
                              key={imgIdx}
                              className="rounded-2xl overflow-hidden aspect-square shadow-sm hover:shadow-md hover:scale-[1.02] transition-all border border-slate-200"
                            >
                              <img
                                src={img.url}
                                alt={img.alt || ''}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    );

                  case 'rich_text':
                    return (
                      <div
                        key={block.id || idx}
                        className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-heading prose-headings:font-bold prose-img:rounded-3xl"
                        dangerouslySetInnerHTML={{ __html: block.data?.html || '' }}
                      />
                    );

                  // ── 23. VIDEO EMBED ──
                  case 'video':
                    return (
                      <div key={block.id || idx} className="space-y-4 max-w-4xl mx-auto">
                        {block.data?.heading && (
                          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-center">
                            {block.data.heading}
                          </h2>
                        )}
                        <div className="relative aspect-video rounded-3xl overflow-hidden shadow-lg border border-slate-200 dark:border-neutral-800">
                          <iframe
                            src={
                              block.data?.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ'
                            }
                            className="w-full h-full"
                            allowFullScreen
                            title={block.data?.heading || 'Video'}
                          />
                        </div>
                      </div>
                    );

                  case 'custom_form':
                  case 'form':
                    return <StorefrontEmbeddedForm key={block.id || idx} block={block} />;

                  default:
                    return null;
                }
              };

              const isFull = block.data?.containerWidth === 'full';
              const maxWidth = block.data?.containerMaxWidth || 'max-w-7xl';
              const padding = block.data?.containerPadding || 'normal';
              const paddingClass =
                padding === 'none'
                  ? 'px-0'
                  : padding === 'compact'
                    ? 'px-3 sm:px-4'
                    : 'px-4 sm:px-6 lg:px-8';

              return (
                <div
                  key={block.id || idx}
                  className={isFull ? 'w-full' : `w-full ${maxWidth} mx-auto ${paddingClass}`}
                >
                  {renderBlockContent()}
                </div>
              );
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
                  <h2 className="text-2xl sm:text-3xl font-bold font-heading">
                    {parsed.hero.title}
                  </h2>
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
                      {sec.heading && (
                        <h3 className="text-xl font-bold font-heading">{sec.heading}</h3>
                      )}
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

    // 2. Raw HTML / Markdown string
    return (
      <div
        className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-heading prose-headings:font-bold prose-img:rounded-3xl"
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
    );
  };

  const formattedDate = page.updatedAt
    ? new Date(page.updatedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  const isBlocksPage = (() => {
    if (!page.content) return false;
    const trimmed = page.content.trim();
    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        return Array.isArray(parsed);
      } catch {
        return false;
      }
    }
    return false;
  })();

  if (isBlocksPage) {
    return (
      <TemplateLayout theme={theme}>
        <div className="w-full pb-16 font-sans">
          {renderContent()}
        </div>
      </TemplateLayout>
    );
  }

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
