'use client';

import React from 'react';
import Link from 'next/link';
import type { MenuItem } from '@/lib/api/types';

interface MegaMenuDropdownProps {
  item: MenuItem;
  isOpen: boolean;
  onClose?: () => void;
  variant?: 'light' | 'dark';
  className?: string;
}

export const MegaMenuDropdown: React.FC<MegaMenuDropdownProps> = ({
  item,
  isOpen,
  onClose,
  variant = 'light',
  className = '',
}) => {
  if (!isOpen) return null;

  const config = item.megaMenuConfig || {};
  const bannerImage =
    config.bannerImage ||
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80';
  const headline = config.headline || `Featured in ${item.label || item.title || 'Store'}`;
  const buttonLabel = config.buttonLabel || 'Explore Now';
  const buttonUrl = config.buttonUrl || item.href || item.url || '/products';

  const sublinks = item.children || [];

  const isDark = variant === 'dark';

  return (
    <div
      className={`absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50 animate-in fade-in zoom-in-95 duration-200 ${className}`}
      style={{ minWidth: '720px', maxWidth: '960px' }}
      onMouseLeave={onClose}
    >
      <div
        className={`rounded-3xl p-6 shadow-2xl border backdrop-blur-xl transition-all duration-300 ${
          isDark
            ? 'bg-[#181a1d]/95 border-slate-700/80 text-white shadow-black/60'
            : 'bg-white/95 border-slate-200/90 text-slate-900 shadow-slate-900/15'
        }`}
      >
        <div className="grid grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Sublinks & Collections */}
          <div className={`${bannerImage ? 'col-span-7' : 'col-span-12'} flex flex-col justify-between`}>
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: 'var(--sf-primary, #6366f1)' }}
                  />
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-400">
                    {item.label || item.title} Catalog & Collections
                  </h3>
                </div>
                <Link
                  href={item.href || item.url || '/products'}
                  target={item.target || '_self'}
                  rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
                  onClick={onClose}
                  className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  View All &rarr;
                </Link>
              </div>

              {sublinks.length > 0 ? (
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  {sublinks.map((sub, idx) => {
                    const subHref = sub.href || sub.url || '#';
                    const subLabel = sub.label || sub.title || 'Link';
                    const subTarget = sub.target || '_self';
                    const subRel = subTarget === '_blank' ? 'noopener noreferrer' : undefined;
                    return (
                      <Link
                        key={sub.id || idx}
                        href={subHref}
                        target={subTarget}
                        rel={subRel}
                        onClick={onClose}
                        className={`group flex items-center justify-between p-2 rounded-xl transition-all ${
                          isDark
                            ? 'hover:bg-slate-800/70 text-slate-200 hover:text-white'
                            : 'hover:bg-slate-50 text-slate-700 hover:text-indigo-600'
                        }`}
                      >
                        <span className="text-xs font-semibold tracking-tight transition-transform group-hover:translate-x-1">
                          {subLabel}
                        </span>
                        <svg
                          className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 py-2">
                  {[
                    { label: 'All Products', href: '/products', desc: 'Browse the full catalog' },
                    { label: 'Featured Drops', href: '/collections', desc: 'Seasonal top picks' },
                    { label: 'Special Offers', href: '/products?sale=true', desc: 'Limited deals & bundles' },
                    { label: 'New Arrivals', href: '/products?sort=newest', desc: 'Fresh arrivals this week' },
                  ].map((preset, idx) => (
                    <Link
                      key={idx}
                      href={preset.href}
                      onClick={onClose}
                      className={`p-3 rounded-2xl border transition-all ${
                        isDark
                          ? 'border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                          : 'border-slate-100 hover:border-indigo-100 hover:bg-slate-50'
                      }`}
                    >
                      <span className="block text-xs font-bold">{preset.label}</span>
                      <span className="block text-[10px] text-slate-400 mt-0.5">{preset.desc}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 mt-4 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>Fast Worldwide Delivery & Free Returns</span>
              <span className="font-semibold text-slate-500">Official Store Guaranteed</span>
            </div>
          </div>

          {/* Right Column: Visual Promo Card */}
          {bannerImage && (
            <div className="col-span-5 relative rounded-2xl overflow-hidden min-h-[260px] shadow-lg flex flex-col justify-end p-6 group">
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('${bannerImage}')` }}
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              {/* Card Content */}
              <div className="relative z-10 space-y-3">
                <span className="inline-block px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider">
                  Featured Promotion
                </span>

                <h4 className="text-base sm:text-lg font-black text-white leading-snug drop-shadow-sm">
                  {headline}
                </h4>

                <Link
                  href={buttonUrl}
                  target={item.target || '_self'}
                  rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
                  onClick={onClose}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 active:scale-95 text-xs font-black shadow-md transition-all"
                  style={{
                    backgroundColor: 'var(--sf-primary, #ffffff)',
                    color: '#ffffff',
                  }}
                >
                  <span>{buttonLabel}</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MegaMenuDropdown;
