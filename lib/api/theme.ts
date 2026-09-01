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
  themeBackgroundImage: null,
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
 * Falls back to CMS backend if storefront-backend is not running.
 */
export async function getTheme(): Promise<ThemeConfig> {
  try {
    const theme = await apiClient.get<ThemeConfig>('api/storefront/theme', {
      next: { revalidate: 0, tags: ['theme'] },
    });
    if (theme && (theme.themeHeadingFont || theme.themePrimaryColor || theme.activeTemplateSlug)) {
      return theme;
    }
  } catch (err) {
    console.warn('Storefront backend theme endpoint unreachable, trying CMS backend fallback...');
  }

  // Resilient fallback: Query CMS backend directly if storefront-backend is offline
  try {
    const cmsBase = process.env.NEXT_PUBLIC_CMS_API_URL || 'http://localhost:5000/api';
    const storeId = process.env.NEXT_PUBLIC_STORE_ID || '';
    const res = await fetch(`${cmsBase}/stores/theme${storeId ? `?storeId=${encodeURIComponent(storeId)}` : ''}`, {
      headers: storeId ? { 'x-store-id': storeId } : {},
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      return {
        ...DEFAULT_THEME,
        ...data,
        storeName: data.name || DEFAULT_THEME.storeName,
      };
    }
  } catch {
    // ignore
  }

  return DEFAULT_THEME;
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
