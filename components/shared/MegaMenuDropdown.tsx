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
  const promoBadge = config.promoBadge || 'Featured Promotion';
  const buttonLabel = config.buttonLabel || 'Explore Now';
  const buttonUrl = config.buttonUrl || item.href || item.url || '/products';
  const catalogTitle = config.catalogTitle || `${item.label || item.title || 'Store'} Catalog & Collections`;
  const viewAllLabel = config.viewAllLabel || 'View All →';
  const viewAllUrl = config.viewAllUrl || item.href || item.url || '/products';
  const footerLeft = config.footerLeft ?? 'Fast Worldwide Delivery & Free Returns';
  const footerRight = config.footerRight ?? 'Official Store Guaranteed';

  const isDark = variant === 'dark';

  // Determine cards to display: custom mega menu items -> sublinks -> default presets
  const DEFAULT_PRESETS = [
    { label: 'All Products', href: '/products', desc: 'Browse the full catalog', badge: '' },
    { label: 'Featured Drops', href: '/collections', desc: 'Seasonal top picks', badge: 'HOT' },
    {
      label: 'Special Offers',
      href: '/products?sale=true',
      desc: 'Limited deals & bundles',
      badge: 'SALE',
    },
    {
      label: 'New Arrivals',
      href: '/products?sort=newest',
      desc: 'Fresh arrivals this week',
      badge: 'NEW',
    },
  ];

  const hasConfigCards = Array.isArray(config.items) && config.items.length > 0;
  const hasSublinks = Array.isArray(item.children) && item.children.length > 0;

  let displayCards: Array<{
    id?: string;
    label: string;
    href: string;
    desc?: string | null;
    badge?: string | null;
    target?: string;
  }> = [];

  if (hasConfigCards) {
    displayCards = (config.items || []).map((c, i) => ({
      id: c.id || `cfg-${i}`,
      label: c.label || c.title || 'Feature',
      href: c.url || c.href || '/products',
      desc: c.description || null,
      badge: c.badge || null,
      target: c.target || '_self',
    }));
  } else if (hasSublinks) {
    displayCards = (item.children || []).map((s, i) => ({
      id: s.id || `sub-${i}`,
      label: s.label || s.title || 'Link',
      href: s.url || s.href || '#',
      desc: s.description || null,
      badge: s.badge || null,
      target: s.target || '_self',
    }));
  } else {
    displayCards = DEFAULT_PRESETS.map((p, i) => ({
      id: `preset-${i}`,
      label: p.label,
      href: p.href,
      desc: p.desc,
      badge: p.badge,
      target: '_self',
    }));
  }

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
          <div
            className={`${bannerImage ? 'col-span-7' : 'col-span-12'} flex flex-col justify-between`}
          >
            <div>
              {/* Header bar with Catalog Title and View All link */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: 'var(--sf-primary, #6366f1)' }}
                  />
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-400">
                    {catalogTitle}
                  </h3>
                </div>
                <Link
                  href={viewAllUrl}
                  target={item.target || '_self'}
                  rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
                  onClick={onClose}
                  className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  {viewAllLabel}
                </Link>
              </div>

              {/* 2-Column Visual Cards Grid */}
              <div className="grid grid-cols-2 gap-3 py-1">
                {displayCards.map((card, idx) => {
                  const cardRel = card.target === '_blank' ? 'noopener noreferrer' : undefined;
                  return (
                    <Link
                      key={card.id || idx}
                      href={card.href}
                      target={card.target}
                      rel={cardRel}
                      onClick={onClose}
                      className={`group p-3 rounded-2xl border transition-all flex flex-col justify-between ${
                        isDark
                          ? 'border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/60 text-slate-200 hover:text-white'
                          : 'border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/40 text-slate-800 hover:text-indigo-900'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="text-xs font-bold tracking-tight transition-transform group-hover:translate-x-0.5 truncate">
                          {card.label}
                        </span>
                        {card.badge && (
                          <span
                            className="px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider shrink-0"
                            style={{
                              backgroundColor: isDark ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.12)',
                              color: 'var(--sf-primary, #6366f1)',
                            }}
                          >
                            {card.badge}
                          </span>
                        )}
                      </div>
                      {card.desc && (
                        <span className="block text-[10px] text-slate-400 mt-1 line-clamp-1 group-hover:text-slate-500 dark:group-hover:text-slate-300">
                          {card.desc}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Bottom Footer Highlights */}
            {(footerLeft || footerRight) && (
              <div className="pt-4 mt-4 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                {footerLeft ? <span>{footerLeft}</span> : <span />}
                {footerRight ? (
                  <span className="font-semibold text-slate-500 dark:text-slate-400">
                    {footerRight}
                  </span>
                ) : null}
              </div>
            )}
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
                  {promoBadge}
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
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
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
