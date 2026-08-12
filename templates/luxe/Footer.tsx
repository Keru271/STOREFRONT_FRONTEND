'use client';

import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';

export default function LuxeFooter() {
  const { theme } = useTheme();

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
              Be the first to discover new arrivals and receive exclusive offers.
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
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <Link href="/">
              <span className="text-xl font-bold tracking-[0.2em] uppercase" style={{ color: 'var(--sf-text)' }}>
                {theme.storeName}
              </span>
            </Link>
            {theme.description && (
              <p className="mt-4 text-sm font-light leading-relaxed" style={{ color: 'color-mix(in srgb, var(--sf-text) 45%, transparent)' }}>
                {theme.description}
              </p>
            )}
            {theme.footerShowSocial !== false && (
              <div className="flex gap-4 mt-6">
                {['IG', 'TW', 'FB'].map((soc) => (
                  <a
                    key={soc}
                    href="#"
                    className="w-8 h-8 flex items-center justify-center border text-xs font-light tracking-wider transition-all hover:border-opacity-80"
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
                    {soc}
                  </a>
                ))}
              </div>
            )}
          </div>

          {[
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
          ))}
        </div>

        <div className="mt-12 pt-6 flex justify-between items-center" style={{ borderTop: '1px solid color-mix(in srgb, var(--sf-text) 6%, transparent)' }}>
          <p className="text-xs font-light" style={{ color: 'color-mix(in srgb, var(--sf-text) 30%, transparent)' }}>
            {theme.footerCopyright || `© ${new Date().getFullYear()} ${theme.storeName}`}
          </p>
          <span className="text-xs font-light tracking-widest uppercase" style={{ color: 'var(--sf-primary)' }}>
            Luxury Redefined
          </span>
        </div>
      </div>
    </footer>
  );
}
