'use client';

import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { useMenu } from '@/hooks/useMenu';

export default function NovaFooter() {
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
    <footer className="w-full bg-[#f5f5f7] border-t border-[#d2d2d7] text-[#707070] text-[12px] pt-10 pb-12">
      <div className="max-w-[1024px] mx-auto px-4 sm:px-6">
        
        {/* Footnote / Disclaimer */}
        <div className="pb-6 mb-6 border-b border-[#d2d2d7]/70 text-[11px] leading-relaxed text-[#858585]">
          <p>
            {theme.description || `Trade-in values and promotions vary based on eligibility. Fast nationwide delivery, secure checkout encryption, and 14-day hassle-free return guarantee provided on all orders.`}
          </p>
        </div>

        {/* Support, Contact & Address Bar */}
        {(theme.contactEmail || theme.contactPhone || hasAddress) && (
          <div className="pb-6 mb-6 border-b border-[#d2d2d7]/70 grid grid-cols-1 sm:grid-cols-3 gap-4 text-[11px] text-[#515154]">
            {theme.contactPhone && (
              <div>
                <span className="font-semibold text-[#1d1d1f] block">Customer Support</span>
                <a href={`tel:${theme.contactPhone}`} className="text-[#0066cc] hover:underline">
                  {theme.contactPhone}
                </a>
              </div>
            )}
            {theme.contactEmail && (
              <div>
                <span className="font-semibold text-[#1d1d1f] block">Email Inquiries</span>
                <a href={`mailto:${theme.contactEmail}`} className="text-[#0066cc] hover:underline">
                  {theme.contactEmail}
                </a>
              </div>
            )}
            {hasAddress && (
              <div>
                <span className="font-semibold text-[#1d1d1f] block">Corporate Headquarters</span>
                <span>
                  {[theme.addressStreet, theme.addressCity, theme.addressState, theme.addressZip]
                    .filter(Boolean)
                    .join(', ')}
                  {theme.addressCountry ? ` (${theme.addressCountry})` : ''}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Multi-Column Directory */}
        {cmsFooterItems && cmsFooterItems.length > 0 ? (
          <div className="mb-8">
            <h4 className="text-[12px] font-semibold text-[#1d1d1f] mb-3">Directory</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {cmsFooterItems.map((item, idx) => {
                const target = item.target || '_self';
                const rel = target === '_blank' ? 'noopener noreferrer' : undefined;
                return (
                  <Link
                    key={item.id || idx}
                    href={item.href || item.url || '/'}
                    target={target}
                    rel={rel}
                    className="hover:text-[#1d1d1f] transition-colors"
                  >
                    {item.label || item.title}
                  </Link>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-[12px] font-semibold text-[#1d1d1f] mb-2.5">Shop & Learn</h4>
              <ul className="space-y-2">
                <li><Link href="/products?category=electronics" className="hover:text-[#1d1d1f] transition-colors">Mac & Computing</Link></li>
                <li><Link href="/products?category=apparel" className="hover:text-[#1d1d1f] transition-colors">Wearables & Apparel</Link></li>
                <li><Link href="/products?category=lifestyle" className="hover:text-[#1d1d1f] transition-colors">Smart Living & Audio</Link></li>
                <li><Link href="/products" className="hover:text-[#1d1d1f] transition-colors">All Products</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[12px] font-semibold text-[#1d1d1f] mb-2.5">Account & Bag</h4>
              <ul className="space-y-2">
                <li><Link href="/account" className="hover:text-[#1d1d1f] transition-colors">Manage Your ID</Link></li>
                <li><Link href="/account/orders" className="hover:text-[#1d1d1f] transition-colors">Order Status & Tracking</Link></li>
                <li><Link href="/wishlist" className="hover:text-[#1d1d1f] transition-colors">Saved Wishlist</Link></li>
                <li><Link href="/cart" className="hover:text-[#1d1d1f] transition-colors">Shopping Bag</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[12px] font-semibold text-[#1d1d1f] mb-2.5">Entertainment & Values</h4>
              <ul className="space-y-2">
                <li><Link href="/products" className="hover:text-[#1d1d1f] transition-colors">Protection Care</Link></li>
                <li><Link href="/products" className="hover:text-[#1d1d1f] transition-colors">Certified Refurbished</Link></li>
                <li><Link href="/products" className="hover:text-[#1d1d1f] transition-colors">Trade In & Recycle</Link></li>
                <li><Link href="/products" className="hover:text-[#1d1d1f] transition-colors">Sustainability</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[12px] font-semibold text-[#1d1d1f] mb-2.5">Store Support</h4>
              <ul className="space-y-2">
                <li><Link href="/contact" className="hover:text-[#1d1d1f] transition-colors">Customer Help Center</Link></li>
                <li><Link href="/shipping" className="hover:text-[#1d1d1f] transition-colors">Shipping & Delivery Rates</Link></li>
                <li><Link href="/returns" className="hover:text-[#1d1d1f] transition-colors">Returns & Refunds</Link></li>
                <li><Link href="/privacy" className="hover:text-[#1d1d1f] transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
        )}

        {/* Social Links if active */}
        {theme.footerShowSocial !== false && socialChannels.length > 0 && (
          <div className="pb-6 mb-6 flex flex-wrap items-center gap-3 text-[11px] text-[#515154]">
            <span className="font-semibold text-[#1d1d1f]">Follow {theme.storeName}:</span>
            {socialChannels.map((s) => (
              <a
                key={s.name}
                href={s.url!}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0066cc] hover:underline"
              >
                {s.name}
              </a>
            ))}
          </div>
        )}

        {/* Legal & Copyright */}
        <div className="pt-4 border-t border-[#d2d2d7]/70 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-[#858585]">
          <div>
            {theme.footerCopyright || `Copyright © ${new Date().getFullYear()} ${theme.storeName || 'Nova'}. All rights reserved.`}
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy" className="hover:text-[#1d1d1f] transition-colors">Privacy Policy</Link>
            <span>|</span>
            <Link href="/terms" className="hover:text-[#1d1d1f] transition-colors">Terms of Use</Link>
            <span>|</span>
            <Link href="/sales" className="hover:text-[#1d1d1f] transition-colors">Sales Policy</Link>
            <span>|</span>
            <Link href="/legal" className="hover:text-[#1d1d1f] transition-colors">Legal</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
