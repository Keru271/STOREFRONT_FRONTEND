// ─── Theme & Store Info API ──────────────────────────────────────────────────
// Fetches the active store branding (name, logo, favicon, meta title)
// and theme configuration from the backend CMS.

import { apiClient } from './client';
import type { ThemeConfig, StoreInfo } from './types';

// Default fallback theme — used when backend is unreachable
export const DEFAULT_THEME: ThemeConfig = {
  storeName: 'Storefront',
  slug: 'storefront',
  currency: 'USD',
  language: 'en-US',
  timezone: 'UTC',
  activeTemplateSlug: 'mincom',
  themePrimaryColor: '#6366f1',
  themeSecondaryColor: '#8b5cf6',
  themeBackgroundColor: '#ffffff',
  themeTextColor: '#111827',
  themeAccentColor: '#f59e0b',
  themeHeadingFont: 'Inter',
  themeBodyFont: 'Inter',
  themeFontSize: '16px',
  themeBorderRadius: '0.5rem',
  themeButtonStyle: 'rounded',
  headerSticky: true,
  headerShowSearch: true,
  headerShowCurrency: true,
  footerShowSocial: true,
  footerShowNewsletter: true,
  footerCopyright: `© ${new Date().getFullYear()} Storefront. All rights reserved.`,
  seoSiteTitle: 'Storefront | Modern E-Commerce',
  seoMetaDescription: 'Shop premium products with fast shipping and secure checkout.',
};

/**
 * Fetches the storefront theme config from the backend.
 * Uses on-demand revalidation so changes saved in the CMS reflect immediately.
 */
export async function getTheme(): Promise<ThemeConfig> {
  try {
    const theme = await apiClient.get<ThemeConfig>('api/storefront/theme', {
      next: { revalidate: 0, tags: ['theme'] },
    });
    return theme;
  } catch {
    return DEFAULT_THEME;
  }
}

/**
 * Fetches dedicated store branding info (storeName, logo, favicon, meta title, description).
 */
export async function getStoreInfo(): Promise<StoreInfo> {
  try {
    const info = await apiClient.get<StoreInfo>('api/storefront/theme/info', {
      next: { revalidate: 0, tags: ['store-info', 'theme'] },
    });
    console.log({ info })
    return info;
  } catch {
    return {
      storeName: DEFAULT_THEME.storeName,
      slug: DEFAULT_THEME.slug,
      logo: DEFAULT_THEME.logo,
      favicon: DEFAULT_THEME.favicon,
      seoSiteTitle: DEFAULT_THEME.seoSiteTitle,
      seoMetaDescription: DEFAULT_THEME.seoMetaDescription,
      description: DEFAULT_THEME.description,
      currency: DEFAULT_THEME.currency,
      language: DEFAULT_THEME.language,
      activeTemplateSlug: DEFAULT_THEME.activeTemplateSlug,
    };
  }
}
