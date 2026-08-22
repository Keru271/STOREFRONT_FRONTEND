'use client';

import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { useMenu } from '@/hooks/useMenu';

export default function MinimalFooter() {
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
    { name: 'Instagram', url: theme.socialInstagram },
    { name: 'Facebook', url: theme.socialFacebook },
    { name: 'Twitter', url: theme.socialTwitter },
    { name: 'LinkedIn', url: theme.socialLinkedin },
    { name: 'YouTube', url: theme.socialYoutube },
    { name: 'TikTok', url: theme.socialTiktok },
    { name: 'Pinterest', url: theme.socialPinterest },
  ].filter((s) => !!s.url);

  return (
    <footer className="mt-auto pt-16 pb-10 px-6 font-mono text-xs" style={{ borderTop: '1px solid color-mix(in srgb, var(--sf-text) 10%, transparent)' }}>
      <div className="max-w-6xl mx-auto">
        
        {/* Newsletter Section */}
        {theme.footerShowNewsletter !== false && (
          <div className="mb-12 text-center">
            <p className="text-[10px] tracking-widest uppercase mb-3" style={{ color: 'color-mix(in srgb, var(--sf-text) 40%, transparent)' }}>
              Newsletter
            </p>
            <h3 className="text-xl font-normal tracking-tight mb-4" style={{ color: 'var(--sf-text)' }}>Stay in the know with {theme.storeName}</h3>
            <form className="flex max-w-sm mx-auto gap-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 px-0 py-2 text-xs bg-transparent border-b outline-none"
                style={{
                  color: 'var(--sf-text)',
                  borderColor: 'color-mix(in srgb, var(--sf-text) 30%, transparent)',
                }}
              />
              <button type="submit" className="text-[11px] tracking-widest uppercase px-4 py-2 transition-opacity hover:opacity-60 font-bold" style={{ color: 'var(--sf-text)' }}>
                Subscribe →
              </button>
            </form>
          </div>
        )}

        {/* Contact, Address & Social Info */}
        {(theme.contactEmail || theme.contactPhone || hasAddress || (theme.footerShowSocial !== false && socialChannels.length > 0)) && (
          <div className="mb-12 pb-8 text-center space-y-3" style={{ borderBottom: '1px solid color-mix(in srgb, var(--sf-text) 8%, transparent)' }}>
            <div className="flex flex-wrap justify-center items-center gap-6 text-[11px]" style={{ color: 'color-mix(in srgb, var(--sf-text) 60%, transparent)' }}>
              {theme.contactPhone && (
                <span>TEL: <a href={`tel:${theme.contactPhone}`} className="hover:underline" style={{ color: 'var(--sf-text)' }}>{theme.contactPhone}</a></span>
              )}
              {theme.contactEmail && (
                <span>EMAIL: <a href={`mailto:${theme.contactEmail}`} className="hover:underline" style={{ color: 'var(--sf-text)' }}>{theme.contactEmail}</a></span>
              )}
              {hasAddress && (
                <span>LOC: {[theme.addressStreet, theme.addressCity, theme.addressState, theme.addressZip].filter(Boolean).join(', ')} {theme.addressCountry ? `(${theme.addressCountry})` : ''}</span>
              )}
            </div>

            {theme.footerShowSocial !== false && socialChannels.length > 0 && (
              <div className="flex flex-wrap justify-center gap-4 text-[10px] uppercase tracking-widest pt-2">
                {socialChannels.map((s) => (
                  <a
                    key={s.name}
                    href={s.url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline opacity-70 hover:opacity-100"
                    style={{ color: 'var(--sf-text)' }}
                  >
                    [{s.name}]
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Navigation Directory */}
        {cmsFooterItems && cmsFooterItems.length > 0 ? (
          <div className="mb-12 text-center">
            <p className="text-[10px] tracking-widest uppercase mb-4" style={{ color: 'color-mix(in srgb, var(--sf-text) 35%, transparent)' }}>
              Quick Links
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-xs">
              {cmsFooterItems.map((item, idx) => (
                <Link
                  key={item.id || idx}
                  href={item.href || item.url || '/'}
                  className="transition-opacity hover:opacity-50"
                  style={{ color: 'var(--sf-text)' }}
                >
                  {item.label || item.title}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-8 mb-12 text-center text-xs">
            {[
              { section: 'Shop', links: [{ label: 'Products', href: '/products' }, { label: 'Collections', href: '/collections' }] },
              { section: 'Company', links: [{ label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }] },
              { section: 'Legal', links: [{ label: 'Privacy', href: '/privacy' }, { label: 'Terms', href: '/terms' }] },
            ].map(({ section, links }) => (
              <div key={section}>
                <p className="text-[10px] tracking-widest uppercase mb-4" style={{ color: 'color-mix(in srgb, var(--sf-text) 35%, transparent)' }}>
                  {section}
                </p>
                <div className="space-y-2">
                  {links.map((l) => (
                    <Link key={l.href} href={l.href} className="block transition-opacity hover:opacity-50" style={{ color: 'var(--sf-text)' }}>
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center pt-6" style={{ borderTop: '1px solid color-mix(in srgb, var(--sf-text) 8%, transparent)' }}>
          <p className="text-[10px]" style={{ color: 'color-mix(in srgb, var(--sf-text) 35%, transparent)' }}>
            {theme.footerCopyright || `© ${new Date().getFullYear()} ${theme.storeName}. All rights reserved.`}
          </p>
        </div>
      </div>
    </footer>
  );
}
