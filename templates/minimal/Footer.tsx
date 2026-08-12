'use client';

import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';

export default function MinimalFooter() {
  const { theme } = useTheme();
  return (
    <footer className="mt-auto pt-16 pb-10 px-6" style={{ borderTop: '1px solid color-mix(in srgb, var(--sf-text) 10%, transparent)' }}>
      <div className="max-w-6xl mx-auto">
        {theme.footerShowNewsletter !== false && (
          <div className="mb-12 text-center">
            <p className="text-xs tracking-widest uppercase mb-4" style={{ color: 'color-mix(in srgb, var(--sf-text) 40%, transparent)' }}>
              Newsletter
            </p>
            <h3 className="text-2xl font-light mb-5" style={{ color: 'var(--sf-text)' }}>Stay in the know</h3>
            <form className="flex max-w-sm mx-auto gap-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 px-0 py-2 text-sm bg-transparent border-b outline-none"
                style={{
                  color: 'var(--sf-text)',
                  borderColor: 'color-mix(in srgb, var(--sf-text) 30%, transparent)',
                }}
              />
              <button type="submit" className="text-xs tracking-widest uppercase px-4 py-2 transition-opacity hover:opacity-60" style={{ color: 'var(--sf-text)' }}>
                Subscribe
              </button>
            </form>
          </div>
        )}

        <div className="grid grid-cols-3 gap-8 mb-12 text-center">
          {[
            { section: 'Shop', links: [{ label: 'Products', href: '/products' }, { label: 'Collections', href: '/collections' }] },
            { section: 'Company', links: [{ label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }] },
            { section: 'Legal', links: [{ label: 'Privacy', href: '/privacy' }, { label: 'Terms', href: '/terms' }] },
          ].map(({ section, links }) => (
            <div key={section}>
              <p className="text-xs tracking-widest uppercase mb-4" style={{ color: 'color-mix(in srgb, var(--sf-text) 35%, transparent)' }}>
                {section}
              </p>
              <div className="space-y-2">
                {links.map((l) => (
                  <Link key={l.href} href={l.href} className="block text-sm transition-opacity hover:opacity-50" style={{ color: 'var(--sf-text)' }}>
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center" style={{ borderTop: '1px solid color-mix(in srgb, var(--sf-text) 8%, transparent)', paddingTop: '2rem' }}>
          <p className="text-xs" style={{ color: 'color-mix(in srgb, var(--sf-text) 35%, transparent)' }}>
            {theme.footerCopyright || `© ${new Date().getFullYear()} ${theme.storeName}`}
          </p>
        </div>
      </div>
    </footer>
  );
}
