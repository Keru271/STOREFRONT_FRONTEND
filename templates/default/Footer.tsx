'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';
import { useMenu } from '@/hooks/useMenu';

export default function DefaultFooter() {
  const { theme } = useTheme();
  const { items: cmsFooterItems } = useMenu('footer');

  const defaultFooterLinks = {
    Shop: [
      { label: 'All Products', href: '/products' },
      { label: 'Collections', href: '/collections' },
      { label: 'New Arrivals', href: '/products?sort=newest' },
      { label: 'Best Sellers', href: '/products?sort=popular' },
    ],
    Support: [
      { label: 'Contact Us', href: '/contact' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Shipping Info', href: '/shipping' },
      { label: 'Returns', href: '/returns' },
    ],
    Company: [
      { label: 'About Us', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/careers' },
      { label: 'Privacy Policy', href: '/privacy' },
    ],
  };

  const hasAddress = !!(
    theme.addressStreet ||
    theme.addressCity ||
    theme.addressState ||
    theme.addressZip ||
    theme.addressCountry
  );

  const socialChannels = [
    { name: 'Instagram', url: theme.socialInstagram, icon: '📸' },
    { name: 'Facebook', url: theme.socialFacebook, icon: '📘' },
    { name: 'Twitter / X', url: theme.socialTwitter, icon: '🐦' },
    { name: 'LinkedIn', url: theme.socialLinkedin, icon: '💼' },
    { name: 'YouTube', url: theme.socialYoutube, icon: '▶️' },
    { name: 'TikTok', url: theme.socialTiktok, icon: '🎵' },
    { name: 'Pinterest', url: theme.socialPinterest, icon: '📌' },
  ].filter((s) => !!s.url);

  return (
    <footer
      className="mt-auto"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--sf-text) 95%, transparent)',
        color: 'color-mix(in srgb, var(--sf-bg) 85%, transparent)',
      }}
    >
      {/* Newsletter Section (Configured via CMS footerShowNewsletter) */}
      {theme.footerShowNewsletter !== false && (
        <div
          className="py-12 px-4"
          style={{ backgroundColor: 'var(--sf-primary)' }}
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold text-white">Stay in the loop with {theme.storeName}</h3>
              <p className="text-white/80 mt-1 text-sm">Subscribe for exclusive deals and new arrivals.</p>
            </div>
            <form className="flex gap-3 w-full md:w-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-72 px-4 py-2.5 rounded-lg text-sm outline-none"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  color: 'white',
                  border: '1.5px solid rgba(255,255,255,0.3)',
                }}
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex-shrink-0"
                style={{
                  backgroundColor: 'white',
                  color: 'var(--sf-primary)',
                }}
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer Links & Contact Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-10">
          
          {/* Brand & Contact Support Info */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              {theme.logo ? (
                <Image
                  src={theme.logo}
                  alt={theme.storeName}
                  width={120}
                  height={36}
                  className="h-8 w-auto object-contain mb-1"
                />
              ) : (
                <span className="text-xl font-bold" style={{ color: 'white' }}>
                  {theme.storeName}
                </span>
              )}
            </Link>
            
            {theme.description && (
              <p className="text-sm leading-relaxed max-w-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                {theme.description}
              </p>
            )}

            {/* Support Phone, Email & Business Address */}
            <div className="space-y-2 text-xs pt-1" style={{ color: 'rgba(255,255,255,0.75)' }}>
              {theme.contactPhone && (
                <div className="flex items-center gap-2">
                  <span className="opacity-60">📞 Support:</span>
                  <a href={`tel:${theme.contactPhone}`} className="font-semibold text-white hover:underline">
                    {theme.contactPhone}
                  </a>
                </div>
              )}

              {theme.contactEmail && (
                <div className="flex items-center gap-2">
                  <span className="opacity-60">✉️ Email:</span>
                  <a href={`mailto:${theme.contactEmail}`} className="font-semibold text-white hover:underline">
                    {theme.contactEmail}
                  </a>
                </div>
              )}

              {hasAddress && (
                <div className="flex items-start gap-2 pt-0.5">
                  <span className="opacity-60 flex-shrink-0">📍 Address:</span>
                  <span className="leading-relaxed">
                    {[theme.addressStreet, theme.addressCity, theme.addressState, theme.addressZip]
                      .filter(Boolean)
                      .join(', ')}
                    {theme.addressCountry ? ` (${theme.addressCountry})` : ''}
                  </span>
                </div>
              )}
            </div>

            {/* Social Media Links from CMS */}
            {theme.footerShowSocial !== false && socialChannels.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {socialChannels.map((soc) => (
                  <a
                    key={soc.name}
                    href={soc.url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={soc.name}
                    title={soc.name}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all duration-200"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.08)',
                      color: 'rgba(255,255,255,0.85)',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'var(--sf-primary)';
                      (e.currentTarget as HTMLAnchorElement).style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'rgba(255,255,255,0.08)';
                      (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.85)';
                    }}
                  >
                    <span>{soc.icon}</span>
                    <span>{soc.name}</span>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Navigation & Link Columns */}
          {cmsFooterItems && cmsFooterItems.length > 0 ? (
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
              <h4 className="font-semibold text-xs tracking-widest uppercase mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Navigation
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {cmsFooterItems.map((item, idx) => (
                  <Link
                    key={item.id || idx}
                    href={item.href || item.url || '/'}
                    className="text-sm transition-all duration-200 hover:translate-x-1 inline-block"
                    style={{ color: 'rgba(255,255,255,0.7)' }}
                  >
                    {item.label || item.title}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            Object.entries(defaultFooterLinks).map(([section, links]) => (
              <div key={section}>
                <h4 className="font-semibold text-xs tracking-widest uppercase mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {section}
                </h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm transition-colors hover:text-white"
                        style={{ color: 'rgba(255,255,255,0.6)' }}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>

        {/* Bottom Bar */}
        <div
          className="mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs"
          style={{
            borderTop: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.4)',
          }}
        >
          <p>{theme.footerCopyright || `© ${new Date().getFullYear()} ${theme.storeName}. All rights reserved.`}</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/shipping" className="hover:text-white transition-colors">Shipping & Returns</Link>
          </div>
          {theme.footerShowPaymentBadges !== false && (
            <div className="flex items-center gap-2 text-xs opacity-75">
              <span className="px-2 py-0.5 bg-white/10 rounded font-semibold text-white text-[10px]">VISA</span>
              <span className="px-2 py-0.5 bg-white/10 rounded font-semibold text-white text-[10px]">MASTERCARD</span>
              <span className="px-2 py-0.5 bg-white/10 rounded font-semibold text-white text-[10px]">STRIPE</span>
              <span className="px-2 py-0.5 bg-white/10 rounded font-semibold text-white text-[10px]">RAZORPAY</span>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
