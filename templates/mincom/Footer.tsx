'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useMenu } from '@/hooks/useMenu';

const defaultFooterLinks = {
  departments: [
    { label: 'Living Room', href: '/products?category=living-room' },
    { label: 'Bedroom Furniture', href: '/products?category=bedroom' },
    { label: 'Kitchen & Dining', href: '/products?category=dining' },
    { label: 'Home Office Desks', href: '/products?category=office' },
    { label: 'Lighting & Accents', href: '/products?category=decor' },
    { label: 'Featured Collections', href: '/collections' },
  ],
  customerService: [
    { label: 'My Account & Orders', href: '/account' },
    { label: 'Wishlist', href: '/wishlist' },
    { label: 'Shopping Bag', href: '/cart' },
    { label: 'Shipping & Delivery', href: '/shipping' },
    { label: '30-Day Returns Policy', href: '/returns' },
    { label: 'Contact Us', href: '/contact' },
  ],
  company: [
    { label: 'Our Story & Craft', href: '/about' },
    { label: 'Design Journal / Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms & Conditions', href: '/terms' },
    { label: 'Help & FAQs', href: '/faq' },
  ],
};

export default function MincomFooter() {
  const { theme } = useTheme();
  const { items: cmsFooterItems } = useMenu('footer');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  const hasAddress = Boolean(theme.addressStreet || theme.addressCity || theme.addressCountry);

  return (
    <footer className="w-full bg-[#181a1c] text-[#9ca3af] text-xs pt-16 pb-8 border-t border-[#26292d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Newsletter Highlight Banner (toggled via CMS footerShowNewsletter) */}
        {theme.footerShowNewsletter !== false && (
          <div className="bg-[#23272a] rounded-3xl p-8 sm:p-10 mb-16 border border-[#2e3338] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-2">
              <span className="text-amber-400 font-bold uppercase tracking-widest text-xs flex items-center gap-1.5">
                <span>✉️</span> {theme.storeName?.toUpperCase() || 'MINCOM'} NEWSLETTER
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Get 20% Off Your First Order
              </h3>
              <p className="text-slate-400 text-xs max-w-md">
                Subscribe to get special offers, design tips, and exclusive member discounts.
              </p>
            </div>

            <div className="lg:col-span-6">
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 px-5 py-3.5 rounded-2xl bg-white text-slate-900 placeholder:text-slate-400 text-xs font-medium outline-none focus:ring-2 focus:ring-amber-400"
                />
                <button
                  type="submit"
                  className="px-8 py-3.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl transition shadow-lg flex-shrink-0"
                >
                  {subscribed ? 'Subscribed! ✓' : 'Subscribe Now'}
                </button>
              </form>
              <p className="text-[11px] text-slate-500 mt-2">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        )}

        {/* Multi-Column Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#26292d]">
          
          {/* Col 1: About Store (from CMS config) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              {theme.logo ? (
                <img src={theme.logo} alt={theme.storeName} className="h-8 w-auto object-contain" />
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-amber-400 rounded-xl flex items-center justify-center text-slate-950 font-black text-lg">
                    {theme.storeName ? theme.storeName[0].toUpperCase() : 'M'}
                  </div>
                  <span className="text-xl font-black tracking-tight text-white uppercase">
                    {theme.storeName || 'MINCOM'}
                  </span>
                </div>
              )}
            </div>
            
            <p className="text-slate-400 leading-relaxed text-xs max-w-sm">
              {theme.description || `${theme.storeName} is your premier destination for handcrafted, premium lifestyle collections and modern living essentials.`}
            </p>

            <div className="space-y-1.5 text-xs text-slate-300">
              {theme.contactPhone && (
                <p>📞 Phone: <strong className="text-white">{theme.contactPhone}</strong></p>
              )}
              {theme.contactEmail && (
                <p>✉️ Email: <strong className="text-white">{theme.contactEmail}</strong></p>
              )}
              {hasAddress && (
                <p className="text-slate-400">
                  📍 {theme.addressStreet ? `${theme.addressStreet}, ` : ''}{theme.addressCity ? `${theme.addressCity}, ` : ''}{theme.addressState ? `${theme.addressState} ` : ''}{theme.addressZip || ''} {theme.addressCountry ? `(${theme.addressCountry})` : ''}
                </p>
              )}
            </div>

            {/* Social media profile links from CMS */}
            {theme.footerShowSocial !== false && (
              <div className="flex flex-wrap items-center gap-2 pt-2">
                {theme.socialInstagram && (
                  <a href={theme.socialInstagram} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#23272a] hover:bg-amber-400 hover:text-slate-950 text-slate-300 flex items-center justify-center text-xs font-bold transition">
                    IG
                  </a>
                )}
                {theme.socialFacebook && (
                  <a href={theme.socialFacebook} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#23272a] hover:bg-amber-400 hover:text-slate-950 text-slate-300 flex items-center justify-center text-xs font-bold transition">
                    FB
                  </a>
                )}
                {theme.socialTwitter && (
                  <a href={theme.socialTwitter} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#23272a] hover:bg-amber-400 hover:text-slate-950 text-slate-300 flex items-center justify-center text-xs font-bold transition">
                    X
                  </a>
                )}
                {theme.socialYoutube && (
                  <a href={theme.socialYoutube} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#23272a] hover:bg-amber-400 hover:text-slate-950 text-slate-300 flex items-center justify-center text-xs font-bold transition">
                    YT
                  </a>
                )}
                {theme.socialPinterest && (
                  <a href={theme.socialPinterest} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#23272a] hover:bg-amber-400 hover:text-slate-950 text-slate-300 flex items-center justify-center text-xs font-bold transition">
                    PIN
                  </a>
                )}
                {theme.socialLinkedin && (
                  <a href={theme.socialLinkedin} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#23272a] hover:bg-amber-400 hover:text-slate-950 text-slate-300 flex items-center justify-center text-xs font-bold transition">
                    IN
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Dynamic or Default Menu Columns */}
          {cmsFooterItems && cmsFooterItems.length > 0 ? (
            <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-8">
              <div className="space-y-3 col-span-2 sm:col-span-3">
                <h4 className="text-white font-bold uppercase tracking-wider text-xs">Quick Links</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  {cmsFooterItems.map((item, idx) => {
                    const target = item.target || '_self';
                    const rel = target === '_blank' ? 'noopener noreferrer' : undefined;
                    return (
                      <Link
                        key={item.id || idx}
                        href={item.href || item.url || '/'}
                        target={target}
                        rel={rel}
                        className="hover:text-amber-400 transition"
                      >
                        {item.label || item.title}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Col 2: Shop Departments */}
              <div className="space-y-3">
                <h4 className="text-white font-bold uppercase tracking-wider text-xs">Departments</h4>
                <ul className="space-y-2 text-xs">
                  {defaultFooterLinks.departments.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="hover:text-amber-400 transition">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Col 3: Customer Care */}
              <div className="space-y-3">
                <h4 className="text-white font-bold uppercase tracking-wider text-xs">Customer Service</h4>
                <ul className="space-y-2 text-xs">
                  {defaultFooterLinks.customerService.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="hover:text-amber-400 transition">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Col 4: About & Legal */}
              <div className="space-y-3">
                <h4 className="text-white font-bold uppercase tracking-wider text-xs">Company</h4>
                <ul className="space-y-2 text-xs">
                  {defaultFooterLinks.company.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="hover:text-amber-400 transition">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

        </div>

        {/* Bottom Bar with Copyright (from CMS) & Payment Icons */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            {theme.footerCopyright || `© ${new Date().getFullYear()} ${theme.storeName || 'Mincom'}. All rights reserved.`}
          </p>
          
          {theme.footerShowPaymentBadges !== false && (
            <div className="flex items-center gap-3 text-lg opacity-80">
              <span title="Visa" className="px-2 py-1 bg-[#23272a] rounded text-[11px] font-bold text-white border border-[#373e45]">VISA</span>
              <span title="Mastercard" className="px-2 py-1 bg-[#23272a] rounded text-[11px] font-bold text-white border border-[#373e45]">MASTERCARD</span>
              <span title="Amex" className="px-2 py-1 bg-[#23272a] rounded text-[11px] font-bold text-white border border-[#373e45]">AMEX</span>
              <span title="Stripe" className="px-2 py-1 bg-[#23272a] rounded text-[11px] font-bold text-white border border-[#373e45]">STRIPE</span>
              <span title="Razorpay" className="px-2 py-1 bg-[#23272a] rounded text-[11px] font-bold text-white border border-[#373e45]">RAZORPAY</span>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
