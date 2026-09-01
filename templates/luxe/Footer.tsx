'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';
import { useMenu } from '@/hooks/useMenu';

export default function LuxeFooter() {
  const { theme } = useTheme();
  const { items: cmsFooterItems } = useMenu('footer');

  const hasAddress = !!(
    theme.addressStreet ||
    theme.addressCity ||
    theme.addressState ||
    theme.addressZip ||
    theme.addressCountry
  );

  const socialChannels = [
    { name: 'Instagram', label: 'IG', url: theme.socialInstagram },
    { name: 'Facebook', label: 'FB', url: theme.socialFacebook },
    { name: 'Twitter', label: 'TW', url: theme.socialTwitter },
    { name: 'LinkedIn', label: 'IN', url: theme.socialLinkedin },
    { name: 'YouTube', label: 'YT', url: theme.socialYoutube },
    { name: 'TikTok', label: 'TT', url: theme.socialTiktok },
    { name: 'Pinterest', label: 'PIN', url: theme.socialPinterest },
  ].filter((s) => !!s.url);

  return (
    <footer style={{ backgroundColor: 'var(--sf-bg)', borderTop: '1px solid color-mix(in srgb, var(--sf-primary) 20%, color-mix(in srgb, var(--sf-text) 8%, transparent))' }}>
      {theme.footerShowNewsletter !== false && (
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center max-w-lg mx-auto">
            <span className="text-xs tracking-[0.3em] uppercase mb-3 block" style={{ color: 'var(--sf-primary)' }}>
              Exclusive Access
            </span>
            <h3 className="text-3xl font-light mb-2" style={{ color: 'var(--sf-text)' }}>Members Only</h3>
            <p className="text-sm font-light mb-8" style={{ color: 'color-mix(in srgb, var(--sf-text) 50%, transparent)' }}>
              Be the first to discover new arrivals and receive exclusive offers from {theme.storeName}.
            </p>
            <form className="flex gap-0" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-5 py-3.5 text-sm bg-transparent"
                style={{
                  color: 'var(--sf-text)',
                  border: '1px solid color-mix(in srgb, var(--sf-text) 20%, transparent)',
                  borderRight: 'none',
                }}
              />
              <button
                type="submit"
                className="px-6 py-3.5 text-xs tracking-[0.15em] uppercase font-medium transition-opacity hover:opacity-80"
                style={{
                  backgroundColor: 'var(--sf-primary)',
                  color: 'white',
                  border: '1px solid var(--sf-primary)',
                }}
              >
                Join
              </button>
            </form>
          </div>
        </div>
      )}

      <div
        className="max-w-7xl mx-auto px-6 py-12"
        style={{ borderTop: '1px solid color-mix(in srgb, var(--sf-text) 6%, transparent)' }}
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              {theme.logo ? (
                <Image
                  src={theme.logo}
                  alt={theme.storeName}
                  width={120}
                  height={36}
                  className="h-8 w-auto object-contain mb-3"
                />
              ) : (
                <span className="text-xl font-bold tracking-[0.2em] uppercase" style={{ color: 'var(--sf-text)' }}>
                  {theme.storeName}
                </span>
              )}
            </Link>
            
            {theme.description && (
              <p className="text-sm font-light leading-relaxed max-w-sm" style={{ color: 'color-mix(in srgb, var(--sf-text) 45%, transparent)' }}>
                {theme.description}
              </p>
            )}

            {/* Support Concierge Details */}
            <div className="space-y-1.5 text-xs font-light" style={{ color: 'color-mix(in srgb, var(--sf-text) 60%, transparent)' }}>
              {theme.contactPhone && (
                <p>
                  Concierge: <a href={`tel:${theme.contactPhone}`} className="hover:underline" style={{ color: 'var(--sf-primary)' }}>{theme.contactPhone}</a>
                </p>
              )}
              {theme.contactEmail && (
                <p>
                  Client Services: <a href={`mailto:${theme.contactEmail}`} className="hover:underline" style={{ color: 'var(--sf-primary)' }}>{theme.contactEmail}</a>
                </p>
              )}
              {hasAddress && (
                <p className="text-[11px]">
                  Maison: {[theme.addressStreet, theme.addressCity, theme.addressState, theme.addressZip].filter(Boolean).join(', ')} {theme.addressCountry ? `(${theme.addressCountry})` : ''}
                </p>
              )}
            </div>

            {/* Dynamic Social Links */}
            {theme.footerShowSocial !== false && socialChannels.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {socialChannels.map((soc) => (
                  <a
                    key={soc.name}
                    href={soc.url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={soc.name}
                    className="px-2.5 py-1 flex items-center justify-center border text-[10px] font-light tracking-widest uppercase transition-all hover:border-opacity-80"
                    style={{
                      color: 'var(--sf-text)',
                      borderColor: 'color-mix(in srgb, var(--sf-text) 25%, transparent)',
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLAnchorElement;
                      el.style.backgroundColor = 'var(--sf-primary)';
                      el.style.borderColor = 'var(--sf-primary)';
                      el.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLAnchorElement;
                      el.style.backgroundColor = 'transparent';
                      el.style.borderColor = 'color-mix(in srgb, var(--sf-text) 25%, transparent)';
                      el.style.color = 'var(--sf-text)';
                    }}
                  >
                    {soc.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {cmsFooterItems && cmsFooterItems.length > 0 ? (
            <div className="col-span-1 md:col-span-3">
              <p className="text-xs tracking-[0.2em] uppercase mb-5" style={{ color: 'color-mix(in srgb, var(--sf-text) 35%, transparent)' }}>
                Directory
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {cmsFooterItems.map((item, idx) => {
                  const target = item.target || '_self';
                  const rel = target === '_blank' ? 'noopener noreferrer' : undefined;
                  return (
                    <Link
                      key={item.id || idx}
                      href={item.href || item.url || '/'}
                      target={target}
                      rel={rel}
                      className="block text-sm font-light transition-opacity hover:opacity-50"
                      style={{ color: 'var(--sf-text)' }}
                    >
                      {item.label || item.title}
                    </Link>
                  );
                })}
              </div>
            </div>
          ) : (
            [
              { title: 'The Collection', links: [{ l: 'New Arrivals', h: '/products?sort=newest' }, { l: 'Best Sellers', h: '/products?sort=popular' }, { l: 'Collections', h: '/collections' }] },
              { title: 'Client Services', links: [{ l: 'Contact', h: '/contact' }, { l: 'Shipping', h: '/shipping' }, { l: 'Returns', h: '/returns' }] },
              { title: 'Legal', links: [{ l: 'Privacy', h: '/privacy' }, { l: 'Terms', h: '/terms' }, { l: 'Cookies', h: '/cookies' }] },
            ].map(({ title, links }) => (
              <div key={title}>
                <p className="text-xs tracking-[0.2em] uppercase mb-5" style={{ color: 'color-mix(in srgb, var(--sf-text) 35%, transparent)' }}>
                  {title}
                </p>
                <div className="space-y-3">
                  {links.map(({ l, h }) => (
                    <Link key={h} href={h} className="block text-sm font-light transition-opacity hover:opacity-50" style={{ color: 'var(--sf-text)' }}>
                      {l}
                    </Link>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        <div
          className="mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-light"
          style={{
            borderTop: '1px solid color-mix(in srgb, var(--sf-text) 6%, transparent)',
            color: 'color-mix(in srgb, var(--sf-text) 35%, transparent)',
          }}
        >
          <p>{theme.footerCopyright || `© ${new Date().getFullYear()} ${theme.storeName}. All rights reserved.`}</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:opacity-100 transition-opacity">Privacy</Link>
            <Link href="/terms" className="hover:opacity-100 transition-opacity">Terms</Link>
            <Link href="/cookies" className="hover:opacity-100 transition-opacity">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
